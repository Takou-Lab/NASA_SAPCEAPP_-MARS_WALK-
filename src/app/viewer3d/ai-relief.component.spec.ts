import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { AiReliefComponent, RELIEF_LOADER } from './ai-relief.component';
import { VIEWER_GRAPHICS } from './viewer3d.graphics';
const loader = vi.hoisted(() => ({
  done: null as null | ((value: { scene: THREE.Group }) => void),
  fail: null as null | (() => void),
}));
describe('AI relief lifecycle', () => {
  let renderer: {
    domElement: HTMLCanvasElement;
    setSize: ReturnType<typeof vi.fn>;
    setPixelRatio: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    forceContextLoss: ReturnType<typeof vi.fn>;
  };
  beforeEach(() => {
    loader.done = null;
    loader.fail = null;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 42),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    renderer = {
      domElement: document.createElement('canvas'),
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [AiReliefComponent],
      providers: [
        {
          provide: RELIEF_LOADER,
          useValue: {
            load: (
              _url: string,
              done: typeof loader.done,
              _progress: unknown,
              fail: typeof loader.fail,
            ) => {
              loader.done = done;
              loader.fail = fail;
            },
          },
        },
        {
          provide: VIEWER_GRAPHICS,
          useValue: {
            createRenderer: () => renderer,
            createControls: () => ({
              target: new THREE.Vector3(),
              update: vi.fn(),
              dispose: vi.fn(),
            }),
          },
        },
      ],
    });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });
  function surface() {
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(2, 2);
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    group.add(mesh);
    return { group, geometry };
  }
  it('publishes model-only measurements and disposes geometry on close', () => {
    const fixture = TestBed.createComponent(AiReliefComponent);
    fixture.detectChanges();
    const { group, geometry } = surface();
    const dispose = vi.spyOn(geometry, 'dispose');
    loader.done!({ scene: group });
    fixture.detectChanges();
    expect(fixture.componentInstance.metrics()!.meanSlope).toBeCloseTo(0);
    expect(fixture.nativeElement.textContent).toContain('not measured terrain');
    expect(fixture.nativeElement.textContent).toContain('model units');
    fixture.destroy();
    expect(dispose).toHaveBeenCalledOnce();
    expect(renderer.dispose).toHaveBeenCalledOnce();
  });
  it('disposes a late model without publishing it after teardown', () => {
    const fixture = TestBed.createComponent(AiReliefComponent);
    fixture.detectChanges();
    fixture.destroy();
    const { group, geometry } = surface();
    const dispose = vi.spyOn(geometry, 'dispose');
    loader.done!({ scene: group });
    expect(dispose).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.metrics()).toBeNull();
  });
  it('reports a load failure with recovery instructions', () => {
    const fixture = TestBed.createComponent(AiReliefComponent);
    fixture.detectChanges();
    loader.fail!();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Close and reopen to retry');
  });
});
