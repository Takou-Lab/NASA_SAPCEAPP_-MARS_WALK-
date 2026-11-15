import { InjectionToken } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ViewerRenderer = Pick<
  THREE.WebGLRenderer,
  'domElement' | 'setSize' | 'setPixelRatio' | 'render' | 'dispose' | 'forceContextLoss'
>;
export type ViewerControls = Pick<
  OrbitControls,
  'target' | 'enableDamping' | 'dampingFactor' | 'update' | 'dispose'
>;

/** Graphics boundary allows lifecycle/failure tests without a simulated GPU. */
export interface ViewerGraphics {
  createRenderer(): ViewerRenderer;
  createControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement): ViewerControls;
  loadTexture(
    url: string,
    complete: (texture: THREE.Texture) => void,
    fail: () => void,
  ): THREE.Texture;
}
export const VIEWER_GRAPHICS = new InjectionToken<ViewerGraphics>('Viewer graphics', {
  providedIn: 'root',
  factory: () => ({
    createRenderer: () => new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' }),
    createControls: (camera, canvas) => new OrbitControls(camera, canvas),
    loadTexture: (url, complete, fail) =>
      new THREE.TextureLoader().load(url, complete, undefined, fail),
  }),
});
