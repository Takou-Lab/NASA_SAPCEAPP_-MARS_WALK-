import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { MissionService } from '../core/mission.service';
import { testImage } from '../core/fixtures.spec-helper';
import { ImageManifest, Route, ScienceMarker } from '../core/models';
import { VIEWER_GRAPHICS, ViewerGraphics } from './viewer3d.graphics';
import { Viewer3dComponent } from './viewer3d.component';

type PendingLoad = {
  url: string;
  texture: THREE.Texture;
  complete: (texture: THREE.Texture) => void;
  fail: () => void;
};
const graphics = {
  failRenderer: false,
  loads: [] as PendingLoad[],
  renderers: [] as {
    domElement: HTMLCanvasElement;
    dispose: ReturnType<typeof vi.fn>;
    forceContextLoss: ReturnType<typeof vi.fn>;
  }[],
};
const graphicsFactory: ViewerGraphics = {
  createRenderer: () => {
    if (graphics.failRenderer) throw new Error('WebGL2 unavailable');
    const renderer = {
      domElement: document.createElement('canvas'),
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    };
    graphics.renderers.push(renderer);
    return renderer;
  },
  createControls: () => ({
    target: new THREE.Vector3(),
    enableDamping: false,
    dampingFactor: 0,
    update: vi.fn(),
    dispose: vi.fn(),
  }),
  loadTexture: (url, complete, fail) => {
    const texture = new THREE.Texture();
    graphics.loads.push({ url, texture, complete, fail });
    return texture;
  },
};

type View = {
  camera: THREE.PerspectiveCamera;
  terrainMesh?: THREE.Mesh;
  practiceGrid?: THREE.Group;
  scene?: THREE.Scene;
  routeGroup: THREE.Group;
  markersGroup: THREE.Group;
};

describe('Viewer3dComponent', () => {
  const image = signal<ImageManifest | null>(null);
  const route = signal<Route>({ start: null, destination: null, waypoints: [] });
  const markers = signal<readonly ScienceMarker[]>([]);
  let fixture: ReturnType<typeof TestBed.createComponent<Viewer3dComponent>>;
  let component: Viewer3dComponent;
  let view: View;
  const resizeDisconnect = vi.fn();

  beforeEach(() => {
    graphics.failRenderer = false;
    graphics.loads.length = 0;
    graphics.renderers.length = 0;
    image.set(testImage());
    route.set({ start: null, destination: null, waypoints: [] });
    markers.set([]);
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 42),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = resizeDisconnect;
      },
    );
    resizeDisconnect.mockClear();
    TestBed.configureTestingModule({
      imports: [Viewer3dComponent],
      providers: [
        { provide: VIEWER_GRAPHICS, useValue: graphicsFactory },
        {
          provide: MissionService,
          useValue: {
            image: image.asReadonly(),
            route: route.asReadonly(),
            markers: markers.asReadonly(),
            selectedMarkerId: signal<string | null>(null).asReadonly(),
            selectMarker: vi.fn(),
          },
        },
      ],
    });
  });
  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  function mount() {
    fixture = TestBed.createComponent(Viewer3dComponent);
    component = fixture.componentInstance;
    view = component as unknown as View;
    fixture.detectChanges();
  }
  function complete(
    index = graphics.loads.length - 1,
    width = image()!.width,
    height = image()!.height,
  ) {
    const load = graphics.loads[index];
    load.texture.image = { naturalWidth: width, naturalHeight: height };
    load.complete(load.texture);
    fixture.detectChanges();
  }

  it('instantiates and displays prototype, terrain limits and truthful VR status', () => {
    mount();
    expect(component).toBeTruthy();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Prototype: 3D training view');
    expect(text).toContain('No verified terrain; elevation unavailable');
    expect(text).toContain('Vertical Exaggeration');
    expect(text).toContain('Immersive VR is not implemented');
    expect(text).not.toContain('Martian North');
    expect(fixture.nativeElement.querySelector('.btn-vr')).toBeNull();
  });
  it('provides presets and reset without claiming a geographic heading', () => {
    mount();
    const text = fixture.nativeElement.querySelector('.controls-toolbar').textContent;
    for (const label of ['Rehearsal View', 'Top-Down (Map)', 'Low Oblique', 'Reset View'])
      expect(text).toContain(label);
    expect(fixture.nativeElement.querySelector('.compass-widget')).toBeNull();
  });
  it('loads the base-relative image once, keeps overlays absent until dimensions match', () => {
    mount();
    expect(graphics.loads).toHaveLength(1);
    expect(graphics.loads[0].url).toBe(new URL(image()!.assetPath, document.baseURI).href);
    expect(component.imageDisplayState()).toBe('loading');
    route.set({ start: { x: 10, y: 20 }, destination: null, waypoints: [] });
    fixture.detectChanges();
    expect(view.routeGroup.children).toHaveLength(0);
    complete();
    expect(component.imageDisplayState()).toBe('ready');
    expect(view.routeGroup.children).toHaveLength(2);
  });
  it('preserves the camera and loaded texture when route or science records change', () => {
    mount();
    complete();
    component.setViewPreset('oblique');
    const camera = view.camera.position.clone();
    const plane = view.terrainMesh;
    const texture = graphics.loads[0].texture;
    const disposed = vi.spyOn(texture, 'dispose');
    route.set({ start: { x: 5, y: 10 }, destination: { x: 50, y: 60 }, waypoints: [] });
    markers.set([]);
    fixture.detectChanges();
    expect(view.camera.position).toEqual(camera);
    expect(view.terrainMesh).toBe(plane);
    expect(graphics.loads).toHaveLength(1);
    expect(disposed).not.toHaveBeenCalled();
    expect(view.routeGroup.children).toHaveLength(5);
  });
  it('disposes the replaced plane, material and texture before loading a new image', () => {
    mount();
    complete();
    const geometry = vi.spyOn(view.terrainMesh!.geometry, 'dispose');
    const material = vi.spyOn(view.terrainMesh!.material as THREE.Material, 'dispose');
    const texture = vi.spyOn(graphics.loads[0].texture, 'dispose');
    image.set({ ...testImage(), imageRef: 'replacement' });
    fixture.detectChanges();
    expect(geometry).toHaveBeenCalledOnce();
    expect(material).toHaveBeenCalledOnce();
    expect(texture).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('loading');
    expect(view.terrainMesh).toBeUndefined();
  });
  it('ignores late success and failure from an obsolete image request', () => {
    mount();
    const old = graphics.loads[0];
    const dispose = vi.spyOn(old.texture, 'dispose');
    image.set({ ...testImage(), imageRef: 'replacement' });
    fixture.detectChanges();
    complete(0);
    old.fail();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('loading');
    expect(view.terrainMesh).toBeUndefined();
    expect(dispose).toHaveBeenCalledOnce();
    complete(1);
    expect(component.imageDisplayState()).toBe('ready');
  });
  it('rejects mismatched dimensions and releases the unusable texture', () => {
    mount();
    const disposed = vi.spyOn(graphics.loads[0].texture, 'dispose');
    complete(0, 1, 1);
    expect(component.imageDisplayState()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('dimensions do not match');
    expect(view.terrainMesh).toBeUndefined();
    expect(view.routeGroup.children).toHaveLength(0);
    expect(disposed).toHaveBeenCalledOnce();
  });
  it('shows image failure and keeps image-specific overlays and coordinates unavailable', () => {
    mount();
    route.set({ start: { x: 10, y: 20 }, destination: null, waypoints: [] });
    graphics.loads[0].fail();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('image could not be loaded');
    expect(fixture.nativeElement.textContent).toContain('Image coordinates unavailable');
    expect(view.routeGroup.children).toHaveLength(0);
    expect(image()).toEqual(testImage());
  });
  it('labels practice mode and releases removed grid/axes descendants', () => {
    image.set(null);
    mount();
    expect(component.imageDisplayState()).toBe('waiting');
    expect(fixture.nativeElement.textContent).toContain('Practice grid only (illustrative)');
    const grid = view.practiceGrid!.children[0] as THREE.LineSegments;
    const axes = view.practiceGrid!.children[1] as THREE.LineSegments;
    const gridDispose = vi.spyOn(grid.geometry, 'dispose');
    const axesDispose = vi.spyOn(axes.geometry, 'dispose');
    image.set(testImage());
    fixture.detectChanges();
    expect(gridDispose).toHaveBeenCalledOnce();
    expect(axesDispose).toHaveBeenCalledOnce();
  });
  it('shows graphics fallback and cleans a partial renderer initialization', () => {
    graphics.failRenderer = true;
    mount();
    expect(component.webglAvailable()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('WebGL2 may be unavailable');
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull();
    expect(view.scene).toBeUndefined();
    expect(graphics.loads).toHaveLength(0);
  });
  it('handles context loss locally with visible recovery instructions', () => {
    mount();
    complete();
    const renderer = graphics.renderers[0];
    renderer.domElement.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    fixture.detectChanges();
    expect(component.webglAvailable()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Close and reopen this viewer');
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(image()).toEqual(testImage());
  });
  it('renders only positioned, compatible records after imagery is ready', () => {
    mount();
    complete();
    const base = {
      id: 'valid',
      imageRef: image()!.imageRef,
      position: { x: 10, y: 20 },
      positionStatus: 'illustrative',
    } as ScienceMarker;
    markers.set([
      base,
      { ...base, id: 'no-position', position: null, positionStatus: 'unavailable' },
      { ...base, id: 'wrong-image', imageRef: 'other' },
      { ...base, id: 'outside', position: { x: -1, y: 2 } },
    ]);
    fixture.detectChanges();
    expect(view.markersGroup.children).toHaveLength(1);
  });
  it('does not color a destination-only route as a start point', () => {
    mount();
    complete();
    route.set({ start: null, destination: { x: 20, y: 30 }, waypoints: [] });
    fixture.detectChanges();
    const node = view.routeGroup.children[0] as THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshStandardMaterial
    >;
    expect(node.material.color.getHex()).toBe(0xef4444);
  });
  it('releases loaded/pending textures and lifecycle resources on teardown, ignoring late callbacks', () => {
    mount();
    complete();
    const first = vi.spyOn(graphics.loads[0].texture, 'dispose');
    image.set({ ...testImage(), imageRef: 'replacement' });
    fixture.detectChanges();
    const pending = graphics.loads[1];
    const dispose = vi.spyOn(pending.texture, 'dispose');
    fixture.destroy();
    pending.complete(pending.texture);
    pending.fail();
    expect(first).toHaveBeenCalledOnce();
    expect(dispose).toHaveBeenCalledOnce();
    expect(graphics.renderers[0].dispose).toHaveBeenCalledOnce();
    expect(graphics.renderers[0].forceContextLoss).toHaveBeenCalledOnce();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(view.scene).toBeUndefined();
  });
});
