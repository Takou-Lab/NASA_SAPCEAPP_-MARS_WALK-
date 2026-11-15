import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { modelMetrics, triangleMetrics } from './model-metrics';
describe('illustrative mesh metrics', () => {
  it('computes flat, 45 degree and vertical inclination independent of winding', () => {
    const a = new THREE.Vector3(0, 0, 0),
      b = new THREE.Vector3(1, 0, 0);
    expect(triangleMetrics(a, b, new THREE.Vector3(0, 0, 1))!.slope).toBeCloseTo(0);
    expect(triangleMetrics(a, b, new THREE.Vector3(0, 1, 1))!.slope).toBeCloseTo(45);
    expect(triangleMetrics(b, a, new THREE.Vector3(0, 1, 1))!.slope).toBeCloseTo(45);
    expect(triangleMetrics(a, b, new THREE.Vector3(0, 1, 0))!.slope).toBeCloseTo(90);
    expect(triangleMetrics(a, a, a)).toBeNull();
  });
  it('uses world geometry including nonuniform scale and reports model units', () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 1], 3),
    );
    const mesh = new THREE.Mesh(geometry);
    mesh.scale.set(2, 2, 1);
    mesh.position.y = 50;
    const m = modelMetrics(mesh);
    expect(m.triangles).toBe(1);
    expect(m.meanSlope).toBeCloseTo((Math.atan(2) * 180) / Math.PI);
    expect(m.heightRange).toBe(2);
    expect(m.width).toBe(2);
    expect(m.area).toBeCloseTo(Math.sqrt(5));
  });
  it('rejects a model without a usable surface', () => {
    expect(() => modelMetrics(new THREE.Group())).toThrow();
  });
});
