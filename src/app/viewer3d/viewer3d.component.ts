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
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MissionService } from '../core/mission.service';
import { ScienceMarker } from '../core/models';
import { routePoints } from '../core/route';
import { DISPLAY_Y_OFFSET, mapPointTo3D } from './transform';

@Component({
  selector: 'app-viewer3d',
  standalone: true,
  templateUrl: './viewer3d.component.html',
  styleUrl: './viewer3d.component.scss',
})
export class Viewer3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false })
  private containerRef?: ElementRef<HTMLDivElement>;

  readonly mission = inject(MissionService);

  readonly webglAvailable = signal<boolean>(true);
  readonly xrSupported = signal<boolean>(false);
  readonly isPresenting = signal<boolean>(false);

  // Visual enhancements state
  readonly cameraHeading = signal<number>(0);
  readonly hoverCoords = signal<{ x: number; y: number; sceneX: number; sceneZ: number } | null>(null);
  readonly hoveredMarker = signal<ScienceMarker | null>(null);

  readonly selectedMarker = computed<ScienceMarker | null>(() => {
    const id = this.mission.selectedMarkerId();
    if (!id) return null;
    return this.mission.markers().find((m) => m.id === id) ?? null;
  });

  // Three.js Core
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private animFrameId?: number;
  private resizeObserver?: ResizeObserver;

  // Scene object groups
  private terrainMesh?: THREE.Mesh;
  private practiceGrid?: THREE.Group;
  private northIndicator?: THREE.Group;
  private starsMesh?: THREE.Points;
  private routeGroup = new THREE.Group();
  private markersGroup = new THREE.Group();
  private markerMeshMap = new Map<THREE.Object3D, string>();
  private hoveredObject?: THREE.Object3D;

  // Raycasting for interactive marker clicks & coordinate hover
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private boundOnClick = (e: MouseEvent) => this.onCanvasClick(e);
  private boundOnMouseMove = (e: MouseEvent) => this.onCanvasMouseMove(e);
  private boundOnMouseLeave = () => this.onCanvasMouseLeave();

  constructor() {
    // Reactive sync with MissionService signals
    effect(() => {
      const img = this.mission.image();
      const route = this.mission.route();
      const markers = this.mission.markers();

      if (this.scene) {
        this.rebuildTerrain(img);
        this.rebuildRoute(route, img);
        this.rebuildMarkers(markers, img);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.containerRef) return;

    if (!this.checkWebGLSupport()) {
      this.webglAvailable.set(false);
      return;
    }

    this.initThree(this.containerRef.nativeElement);
    this.checkWebXRSupport();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  private initThree(container: HTMLDivElement): void {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06080d);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
    this.camera.position.set(0, 1000, 1200);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.25);
    sunLight.position.set(800, 1500, 600);
    this.scene.add(sunLight);

    // Atmospheric Starfield
    this.starsMesh = this.createStarfield();
    this.scene.add(this.starsMesh);

    // Groups
    this.scene.add(this.routeGroup);
    this.scene.add(this.markersGroup);

    // Initial build
    this.rebuildTerrain(this.mission.image());
    this.rebuildRoute(this.mission.route(), this.mission.image());
    this.rebuildMarkers(this.mission.markers(), this.mission.image());

    // 6. Interaction & Resizing
    const dom = this.renderer.domElement;
    dom.addEventListener('click', this.boundOnClick);
    dom.addEventListener('mousemove', this.boundOnMouseMove);
    dom.addEventListener('mouseleave', this.boundOnMouseLeave);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          this.onResize(entry.contentRect.width, entry.contentRect.height);
        }
      }
    });
    this.resizeObserver.observe(container);

    // 7. Render Loop
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

    // Update camera heading for compass
    if (this.camera) {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      // North is -Z direction, East is +X
      const angleRad = Math.atan2(dir.x, -dir.z);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);
      this.cameraHeading.set(Math.round((angleDeg + 360) % 360));
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onResize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // --- Terrain Construction (v1 Flat Fallback) ---
  private rebuildTerrain(img: ReturnType<typeof this.mission.image>): void {
    if (!this.scene) return;

    if (this.terrainMesh) {
      this.scene.remove(this.terrainMesh);
      this.terrainMesh.geometry.dispose();
      if (Array.isArray(this.terrainMesh.material)) {
        this.terrainMesh.material.forEach((m) => m.dispose());
      } else {
        this.terrainMesh.material.dispose();
      }
      this.terrainMesh = undefined;
    }

    if (this.practiceGrid) {
      this.scene.remove(this.practiceGrid);
      this.practiceGrid = undefined;
    }

    if (this.northIndicator) {
      this.scene.remove(this.northIndicator);
      this.northIndicator = undefined;
    }

    if (img && img.width > 0 && img.height > 0) {
      const geometry = new THREE.PlaneGeometry(img.width, img.height);
      const textureLoader = new THREE.TextureLoader();

      const texture = textureLoader.load(
        img.assetPath,
        () => this.renderer?.render(this.scene!, this.camera!),
        undefined,
        () => {
          // Keep Mars fallback color if asset fails to load
        }
      );

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0x9c4125, // Mars clay fallback tint
        roughness: 0.9,
        metalness: 0.1,
      });

      this.terrainMesh = new THREE.Mesh(geometry, material);
      this.terrainMesh.rotation.x = -Math.PI / 2;
      this.terrainMesh.position.set(0, 0, 0);
      this.scene.add(this.terrainMesh);

      // Add 3D North Indicator
      this.northIndicator = this.createNorthIndicator(img.width, img.height);
      this.scene.add(this.northIndicator);

      const maxDim = Math.max(img.width, img.height);
      if (this.camera) {
        this.camera.position.set(0, maxDim * 0.9, maxDim * 0.8);
        this.camera.lookAt(0, 0, 0);
        this.controls?.target.set(0, 0, 0);
        this.controls?.update();
      }
    } else {
      // Practice Scene
      const group = new THREE.Group();
      const grid = new THREE.GridHelper(1000, 20, 0xff6633, 0x334155);
      grid.position.y = 0;
      group.add(grid);

      const axes = new THREE.AxesHelper(200);
      axes.position.y = 1;
      group.add(axes);

      this.practiceGrid = group;
      this.scene.add(group);
    }
  }

  private createNorthIndicator(width: number, height: number): THREE.Group {
    const group = new THREE.Group();
    const dir = new THREE.Vector3(0, 0, -1); // North is -Z
    const origin = new THREE.Vector3(-width / 2 + 50, DISPLAY_Y_OFFSET + 2, -height / 2 + 50);
    const arrow = new THREE.ArrowHelper(dir, origin, 50, 0xef4444, 15, 10);
    group.add(arrow);
    return group;
  }

  // --- Route Polyline Construction ---
  private rebuildRoute(
    route: ReturnType<typeof this.mission.route>,
    img: ReturnType<typeof this.mission.image>
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
      const pathPoints = points.map((p) => mapPointTo3D(p, img.width, img.height, DISPLAY_Y_OFFSET));
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
      const isStart = index === 0;
      const isDest = index === points.length - 1 && route.destination !== null;

      if (isStart) color = 0x22c55e; // start: vibrant green
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
    img: ReturnType<typeof this.mission.image>
  ): void {
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
      (m) => m.imageRef === img.imageRef && m.position !== null
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
      const pos = mapPointTo3D(marker.position!, img.width, img.height, DISPLAY_Y_OFFSET + pinHeight / 2);
      coneMesh.position.copy(pos);

      this.markersGroup.add(coneMesh);
      this.markerMeshMap.set(coneMesh, marker.id);
    }
  }

  // --- Mouse & Hover Interactions ---
  private onCanvasMouseMove(event: MouseEvent): void {
    if (!this.containerRef || !this.camera) return;

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
      const w = img?.width || 1000;
      const h = img?.height || 800;
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
    if (!this.containerRef || !this.camera) return;

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
    const span = img ? Math.max(img.width, img.height) : 1000;

    switch (preset) {
      case 'rehearsal':
        this.camera.position.set(0, span * 0.8, span * 0.7);
        this.camera.up.set(0, 1, 0);
        this.controls.target.set(0, 0, 0);
        break;
      case 'topDown':
        this.camera.position.set(0, span * 1.2, 0);
        this.camera.up.set(0, 0, -1); // North (-Z) at top
        this.controls.target.set(0, 0, 0);
        break;
      case 'oblique':
        this.camera.position.set(0, span * 0.25, span * 0.9);
        this.camera.up.set(0, 1, 0);
        this.controls.target.set(0, 0, 0);
        break;
    }
    this.controls.update();
  }

  resetCamera(): void {
    this.setViewPreset('rehearsal');
  }

  // --- Optional WebXR Fallback Check ---
  private checkWebXRSupport(): void {
    if ('xr' in navigator && (navigator as any).xr?.isSessionSupported) {
      (navigator as any).xr
        .isSessionSupported('immersive-vr')
        .then((supported: boolean) => this.xrSupported.set(supported))
        .catch(() => this.xrSupported.set(false));
    } else {
      this.xrSupported.set(false);
    }
  }

  toggleVR(): void {
    if (!this.xrSupported()) return;
    this.isPresenting.update((p) => !p);
  }

  // --- Lifecycle Teardown & Resource Disposal ---
  private cleanup(): void {
    if (this.animFrameId !== undefined) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.renderer?.domElement) {
      const dom = this.renderer.domElement;
      dom.removeEventListener('click', this.boundOnClick);
      dom.removeEventListener('mousemove', this.boundOnMouseMove);
      dom.removeEventListener('mouseleave', this.boundOnMouseLeave);
    }

    if (this.controls) {
      this.controls.dispose();
      this.controls = undefined;
    }

    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if ((mat as any).map) (mat as any).map.dispose();
              mat.dispose();
            });
          } else if (object.material) {
            if ((object.material as any).map) (object.material as any).map.dispose();
            object.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = undefined;
    }

    this.scene = undefined;
    this.camera = undefined;
  }
}
