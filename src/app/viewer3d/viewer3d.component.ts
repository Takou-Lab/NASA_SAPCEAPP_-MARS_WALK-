import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as THREE from 'three';
import { VIEWER_GRAPHICS, ViewerControls, ViewerRenderer } from './viewer3d.graphics';
import { MissionService } from '../core/mission.service';
import { ImageManifest, ScienceMarker } from '../core/models';
import { routePoints } from '../core/route';
import { validPoint } from '../core/validation';
import { DISPLAY_Y_OFFSET, mapPointTo3D } from './transform';

type ImageDisplayState = 'waiting' | 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-viewer3d',
  standalone: true,
  templateUrl: './viewer3d.component.html',
  styleUrl: './viewer3d.component.scss',
})
export class Viewer3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') private containerRef?: ElementRef<HTMLDivElement>;
  readonly mission = inject(MissionService);
  private readonly document = inject(DOCUMENT);
  private readonly graphics = inject(VIEWER_GRAPHICS);
  readonly webglAvailable = signal(true);
  readonly graphicsError = signal<string | null>(null);
  readonly imageDisplayState = signal<ImageDisplayState>('waiting');
  readonly imageDisplayError = signal<string | null>(null);
  readonly hoverCoords = signal<{ x: number; y: number; sceneX: number; sceneZ: number } | null>(
    null,
  );
  readonly hoveredMarker = signal<ScienceMarker | null>(null);
  readonly selectedMarker = computed(
    () => this.mission.markers().find((m) => m.id === this.mission.selectedMarkerId()) ?? null,
  );
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: ViewerRenderer;
  private controls?: ViewerControls;
  private animFrameId?: number;
  private resizeObserver?: ResizeObserver;
  private terrainMesh?: THREE.Mesh;
  private practiceGrid?: THREE.Group;
  private currentImage: ImageManifest | null | undefined;
  private pendingTexture?: THREE.Texture;
  private readonly releasedTextures = new WeakSet<THREE.Texture>();
  private imageRequest = 0;
  private destroyed = false;
  private readonly routeGroup = new THREE.Group();
  private readonly markersGroup = new THREE.Group();
  private readonly markerMeshMap = new Map<THREE.Object3D, string>();
  private hoveredObject?: THREE.Object3D;
  private readonly raycaster = new THREE.Raycaster();
  private readonly mouse = new THREE.Vector2();
  private readonly boundOnClick = (e: MouseEvent) => this.onCanvasClick(e);
  private readonly boundOnMouseMove = (e: MouseEvent) => this.onCanvasMouseMove(e);
  private readonly boundOnMouseLeave = () => this.onCanvasMouseLeave();
  private readonly boundOnContextLost = (event: Event) => {
    event.preventDefault();
    this.graphicsError.set(
      '3D graphics were interrupted. Close and reopen this viewer. The 2D mission remains available.',
    );
    this.webglAvailable.set(false);
    this.cleanup();
  };

  constructor() {
    effect(() => {
      const image = this.mission.image();
      if (this.scene) this.rebuildTerrain(image);
    });
    effect(() => {
      const image = this.mission.image();
      const route = this.mission.route();
      const ready = this.imageDisplayState() === 'ready';
      if (this.scene) this.rebuildRoute(route, ready ? image : null);
    });
    effect(() => {
      const image = this.mission.image();
      const markers = this.mission.markers();
      const ready = this.imageDisplayState() === 'ready';
      if (this.scene) this.rebuildMarkers(markers, ready ? image : null);
    });
  }

  ngAfterViewInit(): void {
    if (!this.containerRef) return;
    try {
      // Three.js owns WebGL2 detection. A WebGL1-only preflight is insufficient.
      this.initThree(this.containerRef.nativeElement);
    } catch {
      this.cleanup();
      this.webglAvailable.set(false);
      this.graphicsError.set(
        '3D graphics could not start. WebGL2 may be unavailable or disabled. The 2D mission remains available.',
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cleanup();
  }

  private initThree(container: HTMLDivElement): void {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06080d);
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
    this.camera.position.set(0, 1000, 1200);
    this.renderer = this.graphics.createRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(this.renderer.domElement);
    this.controls = this.graphics.createControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const light = new THREE.DirectionalLight(0xfff5e6, 1.25);
    light.position.set(800, 1500, 600);
    this.scene.add(light, this.createStarfield(), this.routeGroup, this.markersGroup);
    this.rebuildTerrain(this.mission.image());
    const dom = this.renderer.domElement;
    dom.addEventListener('click', this.boundOnClick);
    dom.addEventListener('mousemove', this.boundOnMouseMove);
    dom.addEventListener('mouseleave', this.boundOnMouseLeave);
    dom.addEventListener('webglcontextlost', this.boundOnContextLost);
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0)
          this.onResize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    this.resizeObserver.observe(container);
    this.animate();
  }

  private createStarfield(): THREE.Points {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 16000 + Math.random() * 6000;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 200; // upper hemisphere
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xc8d6e5,
      size: 2,
      transparent: true,
      opacity: 0.5,
    });
    return new THREE.Points(geom, mat);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    this.controls?.update();
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
  };

  private onResize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private releaseTexture(texture: THREE.Texture): void {
    if (this.releasedTextures.has(texture)) return;
    this.releasedTextures.add(texture);
    texture.dispose();
  }

  private disposeTree(root: THREE.Object3D): void {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    root.traverse((object) => {
      if (!(
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Points
      ))
        return;
      geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => materials.add(material));
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => {
      for (const value of Object.values(material))
        if (value instanceof THREE.Texture) this.releaseTexture(value);
      material.dispose();
    });
  }

  private rebuildTerrain(image: ImageManifest | null): void {
    if (!this.scene || this.currentImage === image) return;
    this.currentImage = image;
    const request = ++this.imageRequest;
    this.onCanvasMouseLeave();
    if (this.pendingTexture) this.releaseTexture(this.pendingTexture);
    this.pendingTexture = undefined;
    for (const object of [this.terrainMesh, this.practiceGrid]) {
      if (object) {
        this.scene.remove(object);
        this.disposeTree(object);
      }
    }
    this.terrainMesh = undefined;
    this.practiceGrid = undefined;
    this.imageDisplayError.set(null);
    if (!image) {
      this.imageDisplayState.set('waiting');
      const group = new THREE.Group();
      group.add(new THREE.GridHelper(1000, 20, 0xff6633, 0x334155), new THREE.AxesHelper(200));
      this.practiceGrid = group;
      this.scene.add(group);
      return;
    }
    this.imageDisplayState.set('loading');
    let texture: THREE.Texture | undefined;
    const isCurrent = () => !this.destroyed && !!this.scene && request === this.imageRequest;
    try {
      texture = this.graphics.loadTexture(
        new URL(image.assetPath, this.document.baseURI).href,
        (loaded) => {
          if (!isCurrent()) {
            this.releaseTexture(loaded);
            return;
          }
          this.pendingTexture = undefined;
          const pixels = loaded.image as
            | { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number }
            | undefined;
          if (
            (pixels?.naturalWidth ?? pixels?.width) !== image.width ||
            (pixels?.naturalHeight ?? pixels?.height) !== image.height
          ) {
            this.releaseTexture(loaded);
            this.imageDisplayError.set('The 3D image dimensions do not match the active manifest.');
            this.imageDisplayState.set('error');
            return;
          }
          loaded.colorSpace = THREE.SRGBColorSpace;
          // A flat, unshaded texture preserves the image's colors; it is not terrain.
          this.terrainMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(image.width, image.height),
            new THREE.MeshBasicMaterial({ map: loaded }),
          );
          this.terrainMesh.rotation.x = -Math.PI / 2;
          this.scene!.add(this.terrainMesh);
          this.resetCamera();
          this.imageDisplayState.set('ready');
        },
        () => {
          if (texture) this.releaseTexture(texture);
          if (!isCurrent()) return;
          this.pendingTexture = undefined;
          this.imageDisplayError.set(
            'The 3D image could not be loaded. The 2D mission state is unchanged.',
          );
          this.imageDisplayState.set('error');
        },
      );
      this.pendingTexture = texture;
    } catch {
      if (texture) this.releaseTexture(texture);
      this.pendingTexture = undefined;
      this.imageDisplayError.set(
        'The 3D image could not be loaded. The 2D mission state is unchanged.',
      );
      this.imageDisplayState.set('error');
    }
  }

  // --- Route Polyline Construction ---
  private rebuildRoute(
    route: ReturnType<typeof this.mission.route>,
    img: ReturnType<typeof this.mission.image>,
  ): void {
    while (this.routeGroup.children.length > 0) {
      const obj = this.routeGroup.children[0];
      this.routeGroup.remove(obj);
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    if (!img) return;

    const points = routePoints(route);
    if (points.length === 0) return;

    const scale = Math.max(img.width, img.height);
    const nodeRadius = Math.max(2, scale / 200);

    // Polyline connecting points in Mars Gold
    if (points.length >= 2) {
      const pathPoints = points.map((p) =>
        mapPointTo3D(p, img.width, img.height, DISPLAY_Y_OFFSET),
      );
      const lineGeom = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b, // Mars gold
        linewidth: 2,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      this.routeGroup.add(line);
    }

    // Waypoint nodes with visual landing rings
    points.forEach((p, index) => {
      let color = 0x38bdf8; // waypoints: sky blue
      const isStart = route.start !== null && index === 0;
      const isDest = index === points.length - 1 && route.destination !== null;

      if (isStart)
        color = 0x22c55e; // start: vibrant green
      else if (isDest) color = 0xef4444; // dest: red

      // Floating sphere
      const nodeGeom = new THREE.SphereGeometry(nodeRadius, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      const pos = mapPointTo3D(p, img.width, img.height, DISPLAY_Y_OFFSET + nodeRadius);
      nodeMesh.position.copy(pos);
      this.routeGroup.add(nodeMesh);

      // Ground beacon ring
      const ringGeom = new THREE.RingGeometry(nodeRadius * 1.2, nodeRadius * 1.8, 24);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(mapPointTo3D(p, img.width, img.height, DISPLAY_Y_OFFSET));
      this.routeGroup.add(ringMesh);
    });
  }

  // --- Science Markers Construction ---
  private rebuildMarkers(
    markers: ReturnType<typeof this.mission.markers>,
    img: ReturnType<typeof this.mission.image>,
  ): void {
    this.onCanvasMouseLeave();
    this.markerMeshMap.clear();

    while (this.markersGroup.children.length > 0) {
      const obj = this.markersGroup.children[0];
      this.markersGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    if (!img) return;

    const scale = Math.max(img.width, img.height);
    const pinRadius = Math.max(3, scale / 150);
    const pinHeight = pinRadius * 2.5;

    const activeMarkers = markers.filter(
      (m) =>
        m.imageRef === img.imageRef &&
        m.positionStatus !== 'unavailable' &&
        validPoint(m.position, img),
    );

    for (const marker of activeMarkers) {
      const isVerified = marker.positionStatus === 'verified';
      const color = isVerified ? 0x10b981 : 0xf59e0b;

      // Pin cone pointing down to map position
      const coneGeom = new THREE.ConeGeometry(pinRadius, pinHeight, 16);
      coneGeom.rotateX(Math.PI);

      const coneMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.2,
      });

      const coneMesh = new THREE.Mesh(coneGeom, coneMat);
      const pos = mapPointTo3D(
        marker.position!,
        img.width,
        img.height,
        DISPLAY_Y_OFFSET + pinHeight / 2,
      );
      coneMesh.position.copy(pos);

      this.markersGroup.add(coneMesh);
      this.markerMeshMap.set(coneMesh, marker.id);
    }
  }

  // --- Mouse & Hover Interactions ---
  private onCanvasMouseMove(event: MouseEvent): void {
    if (!this.containerRef || !this.camera || this.imageDisplayState() !== 'ready') return;

    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Marker hover check
    const markerHits = this.raycaster.intersectObjects(this.markersGroup.children, true);
    if (markerHits.length > 0) {
      const hitObj = markerHits[0].object;
      if (this.hoveredObject !== hitObj) {
        if (this.hoveredObject) this.hoveredObject.scale.set(1, 1, 1);
        this.hoveredObject = hitObj;
        this.hoveredObject.scale.set(1.3, 1.3, 1.3);
      }
      const markerId = this.markerMeshMap.get(hitObj);
      const m = this.mission.markers().find((item) => item.id === markerId) ?? null;
      this.hoveredMarker.set(m);
      if (this.renderer?.domElement) this.renderer.domElement.style.cursor = 'pointer';
    } else {
      if (this.hoveredObject) {
        this.hoveredObject.scale.set(1, 1, 1);
        this.hoveredObject = undefined;
      }
      this.hoveredMarker.set(null);
      if (this.renderer?.domElement) this.renderer.domElement.style.cursor = 'default';
    }

    // 2. Terrain coordinate hover check
    const targets: THREE.Object3D[] = [];
    if (this.terrainMesh) targets.push(this.terrainMesh);
    if (this.practiceGrid) targets.push(this.practiceGrid);

    const terrainHits = this.raycaster.intersectObjects(targets, true);
    if (terrainHits.length > 0) {
      const pt = terrainHits[0].point;
      const img = this.mission.image();
      if (!img) return;
      const w = img.width;
      const h = img.height;
      const x = Math.max(0, Math.min(w, Math.round(pt.x + w / 2)));
      const y = Math.max(0, Math.min(h, Math.round(h / 2 - pt.z)));
      this.hoverCoords.set({
        x,
        y,
        sceneX: Math.round(pt.x),
        sceneZ: Math.round(pt.z),
      });
    } else {
      this.hoverCoords.set(null);
    }
  }

  private onCanvasMouseLeave(): void {
    if (this.hoveredObject) {
      this.hoveredObject.scale.set(1, 1, 1);
      this.hoveredObject = undefined;
    }
    this.hoveredMarker.set(null);
    this.hoverCoords.set(null);
    if (this.renderer?.domElement) this.renderer.domElement.style.cursor = 'default';
  }

  private onCanvasClick(event: MouseEvent): void {
    if (!this.containerRef || !this.camera || this.imageDisplayState() !== 'ready') return;

    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.markersGroup.children, true);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const markerId = this.markerMeshMap.get(hitObj);
      if (markerId) {
        this.mission.selectMarker(markerId);
      }
    }
  }

  closeMarkerCard(): void {
    this.mission.selectMarker(null);
  }

  // --- Camera View Presets ---
  setViewPreset(preset: 'rehearsal' | 'topDown' | 'oblique'): void {
    if (!this.camera || !this.controls) return;
    const img = this.mission.image();
    const width = img?.width ?? 1000;
    const height = img?.height ?? 800;
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const aspect = Math.max(0.05, this.camera.aspect);
    const halfHorizontalFov = Math.atan(Math.tan(halfFov) * aspect);
    const distance =
      (Math.hypot(width, height) / 2 / Math.sin(Math.min(halfFov, halfHorizontalFov))) * 1.1;
    const topDistance = (Math.max(height / 2, width / (2 * aspect)) / Math.tan(halfFov)) * 1.1;

    switch (preset) {
      case 'rehearsal':
        this.camera.position.set(0, 0.8, 0.7).normalize().multiplyScalar(distance);
        this.camera.up.set(0, 1, 0);
        this.controls.target.set(0, 0, 0);
        break;
      case 'topDown':
        this.camera.position.set(0, topDistance, 0);
        this.camera.up.set(0, 0, -1); // Image +y (-Z) at top; geographic orientation is unverified
        this.controls.target.set(0, 0, 0);
        break;
      case 'oblique':
        this.camera.position.set(0, 0.25, 0.9).normalize().multiplyScalar(distance);
        this.camera.up.set(0, 1, 0);
        this.controls.target.set(0, 0, 0);
        break;
    }
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }

  resetCamera(): void {
    this.setViewPreset('rehearsal');
  }

  private cleanup(): void {
    ++this.imageRequest;
    if (this.pendingTexture) this.releaseTexture(this.pendingTexture);
    this.pendingTexture = undefined;
    if (this.animFrameId !== undefined) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    const dom = this.renderer?.domElement;
    dom?.removeEventListener('click', this.boundOnClick);
    dom?.removeEventListener('mousemove', this.boundOnMouseMove);
    dom?.removeEventListener('mouseleave', this.boundOnMouseLeave);
    dom?.removeEventListener('webglcontextlost', this.boundOnContextLost);
    this.onCanvasMouseLeave();
    this.controls?.dispose();
    this.controls = undefined;
    this.markerMeshMap.clear();
    if (this.scene) {
      this.disposeTree(this.scene);
      this.scene.clear();
    }
    this.routeGroup.clear();
    this.markersGroup.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    dom?.remove();
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.terrainMesh = undefined;
    this.practiceGrid = undefined;
    this.currentImage = undefined;
  }
}
