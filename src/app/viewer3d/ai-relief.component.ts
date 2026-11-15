import {
  AfterViewInit,
  InjectionToken,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VIEWER_GRAPHICS, ViewerControls, ViewerRenderer } from './viewer3d.graphics';
import { modelMetrics, triangleMetrics } from './model-metrics';

export const RELIEF_LOADER = new InjectionToken<Pick<GLTFLoader, 'load'>>('Relief model loader', {
  providedIn: 'root',
  factory: () => new GLTFLoader(),
});

@Component({
  selector: 'app-ai-relief',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <h3>AI-generated Mars relief</h3>
    <p>
      <strong>Illustration only — not measured terrain.</strong> Pixal3D generated this geometry
      from an image. Model inclination is not Martian slope; vertical scale, geographic alignment
      and correspondence with the active map are unverified.
    </p>
    <p>
      Rotate with one finger or left drag; pinch/scroll to zoom; two fingers/right drag to pan. Tap
      the surface to inspect a triangle.
    </p>
    <button type="button" (click)="reset()">Reset model view</button>
    <button type="button" (click)="top()">Model top view</button>
    <div
      #viewport
      class="relief-viewport"
      tabindex="0"
      aria-label="Interactive AI-generated relief"
    ></div>
    <p role="status">{{ status() }}</p>
    @if (metrics(); as m) {
      <dl>
        <dt>Mean model inclination (area weighted)</dt>
        <dd>{{ m.meanSlope | number: '1.1-1' }}°</dd>
        <dt>Maximum model triangle inclination</dt>
        <dd>{{ m.maxSlope | number: '1.1-1' }}°</dd>
        <dt>Model vertical range</dt>
        <dd>{{ m.heightRange | number: '1.2-2' }} model units</dd>
        <dt>Model footprint</dt>
        <dd>{{ m.width | number: '1.1-1' }} × {{ m.depth | number: '1.1-1' }} model units</dd>
        <dt>Model surface area</dt>
        <dd>{{ m.area | number: '1.1-1' }} square model units</dd>
        <dt>Triangles</dt>
        <dd>{{ m.triangles }}</dd>
      </dl>
    }
    @if (selected(); as s) {
      <p role="status">
        Selected triangle: {{ s.slope | number: '1.1-1' }}° model inclination; relative height
        {{ s.height | number: '1.2-2' }} model units.
      </p>
    }
    <p>
      These calculations use the supplied mesh as-is, with model Y as vertical. No conversion to
      meters, route gradient, ascent, hazard or safety rating is supported. The 2D mission and
      exports retain their scientific terrain-unavailable status.
    </p>
    <p>
      Generated with
      <a href="https://github.com/TencentARC/Pixal3D" target="_blank" rel="noopener noreferrer"
        >Tencent ARC Pixal3D</a
      >; input imagery credited separately in the Image Data Passport. This viewer does not run AI
      inference.
    </p>
  `,
  styles: [
    `
      :host {
        display: block;
        color: var(--text-primary);
        overflow-wrap: anywhere;
      }
      .relief-viewport {
        width: 100%;
        height: 420px;
        min-height: 300px;
        margin-top: 12px;
        touch-action: none;
        background: #111827;
      }
      .relief-viewport:focus-visible {
        outline: 3px solid #38bdf8;
      }
      button {
        padding: 12px;
        margin: 4px;
        border: 1px solid currentColor;
        border-radius: 6px;
        background: transparent;
        color: inherit;
      }
      dl {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
      }
      dd {
        margin: 0;
      }
      @media (max-width: 480px) {
        .relief-viewport {
          height: 360px;
        }
        dl {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AiReliefComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport') private viewport?: ElementRef<HTMLDivElement>;
  private readonly graphics = inject(VIEWER_GRAPHICS);
  private readonly loader = inject(RELIEF_LOADER);
  private readonly document = inject(DOCUMENT);
  readonly status = signal('Loading supplied 3D model…');
  readonly metrics = signal<ReturnType<typeof modelMetrics> | null>(null);
  readonly selected = signal<{ slope: number; height: number } | null>(null);
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  private renderer?: ViewerRenderer;
  private controls?: ViewerControls;
  private observer?: ResizeObserver;
  private model?: THREE.Group;
  private frame?: number;
  private dead = false;
  private center = new THREE.Vector3();
  private radius = 200;
  private pointerStart = { x: 0, y: 0 };
  ngAfterViewInit() {
    try {
      this.renderer = this.graphics.createRenderer();
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.viewport!.nativeElement.appendChild(this.renderer.domElement);
      this.scene.background = new THREE.Color(0x111827);
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));
      const light = new THREE.DirectionalLight(0xffffff, 2);
      light.position.set(100, 200, 100);
      this.scene.add(light);
      this.controls = this.graphics.createControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.viewport!.nativeElement);
      this.resize();
      this.renderer.domElement.addEventListener('pointerdown', this.down);
      this.renderer.domElement.addEventListener('pointerup', this.pick);
      this.renderer.domElement.addEventListener('webglcontextlost', this.lost);
      this.animate();
      this.loader.load(
        new URL('data/models/marswalk-ai-relief.glb', this.document.baseURI).href,
        (gltf) => {
          if (this.dead) {
            this.disposeModel(gltf.scene);
            return;
          }
          try {
            const stats = modelMetrics(gltf.scene);
            this.metrics.set(stats);
            this.model = gltf.scene;
            this.scene.add(this.model);
            const box = new THREE.Box3().setFromObject(this.model);
            box.getCenter(this.center);
            this.radius = box.getSize(new THREE.Vector3()).length() / 2;
            this.reset();
            this.status.set(
              'AI-generated model loaded. Tap a triangle for model-only measurements.',
            );
          } catch {
            this.disposeModel(gltf.scene);
            this.status.set('The model could not be inspected. The 2D mission is unchanged.');
          }
        },
        undefined,
        () => {
          if (!this.dead)
            this.status.set(
              'Model failed to load. Close and reopen to retry. Prepare offline while connected for offline use.',
            );
        },
      );
    } catch {
      this.status.set('3D graphics are unavailable. The 2D mission remains available.');
      this.ngOnDestroy();
    }
  }
  private resize() {
    if (!this.viewport || !this.renderer) return;
    const { clientWidth: w, clientHeight: h } = this.viewport.nativeElement;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
  reset() {
    const half = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const angle = Math.min(half, Math.atan(Math.tan(half) * this.camera.aspect));
    this.camera.position
      .copy(this.center)
      .add(
        new THREE.Vector3(0, 0.8, 1)
          .normalize()
          .multiplyScalar((this.radius / Math.sin(angle)) * 1.15),
      );
    this.camera.up.set(0, 1, 0);
    this.aim();
  }
  top() {
    const half = THREE.MathUtils.degToRad(this.camera.fov / 2);
    this.camera.position
      .copy(this.center)
      .add(
        new THREE.Vector3(
          0,
          (this.radius / Math.sin(Math.min(half, Math.atan(Math.tan(half) * this.camera.aspect)))) *
            1.15,
          0,
        ),
      );
    this.camera.up.set(0, 0, -1);
    this.aim();
  }
  private aim() {
    this.controls?.target.copy(this.center);
    this.camera.lookAt(this.center);
    this.controls?.update();
  }
  private animate = () => {
    if (this.dead) return;
    this.frame = requestAnimationFrame(this.animate);
    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  };
  private down = (e: PointerEvent) => {
    this.pointerStart = { x: e.clientX, y: e.clientY };
  };
  private pick = (e: PointerEvent) => {
    if (
      !this.model ||
      !this.renderer ||
      Math.hypot(e.clientX - this.pointerStart.x, e.clientY - this.pointerStart.y) > 8
    )
      return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(
      new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera,
    );
    const hit = ray.intersectObject(this.model, true)[0];
    if (!hit?.face || !(hit.object instanceof THREE.Mesh)) {
      this.selected.set(null);
      return;
    }
    const p = hit.object.geometry.getAttribute('position');
    const v = (i: number) =>
      new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(hit.object.matrixWorld);
    const metric = triangleMetrics(v(hit.face.a), v(hit.face.b), v(hit.face.c));
    if (metric)
      this.selected.set({
        slope: metric.slope,
        height: hit.point.y - new THREE.Box3().setFromObject(this.model).min.y,
      });
  };
  private lost = (e: Event) => {
    e.preventDefault();
    this.status.set('3D graphics were interrupted. Close and reopen the viewer.');
    this.ngOnDestroy();
  };
  private disposeModel(root: THREE.Object3D) {
    const textures = new Set<THREE.Texture>();
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.geometry.dispose();
      for (const material of Array.isArray(o.material) ? o.material : [o.material]) {
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) textures.add(value);
        material.dispose();
      }
    });
    textures.forEach((t) => t.dispose());
  }
  ngOnDestroy() {
    this.dead = true;
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.controls?.dispose();
    const canvas = this.renderer?.domElement;
    canvas?.removeEventListener('pointerdown', this.down);
    canvas?.removeEventListener('pointerup', this.pick);
    canvas?.removeEventListener('webglcontextlost', this.lost);
    if (this.model) this.disposeModel(this.model);
    this.scene.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    canvas?.remove();
    this.renderer = undefined;
    this.model = undefined;
    this.controls = undefined;
    this.observer = undefined;
  }
}
