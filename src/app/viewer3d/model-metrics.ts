import * as THREE from 'three';

/** Inclination of a model triangle to its model XZ plane, independent of winding. */
export function triangleMetrics(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  const normal = b.clone().sub(a).cross(c.clone().sub(a));
  const length = normal.length();
  if (!Number.isFinite(length) || length === 0) return null;
  return {
    area: length / 2,
    slope: THREE.MathUtils.radToDeg(Math.acos(Math.min(1, Math.abs(normal.y) / length))),
  };
}

export function modelMetrics(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  let triangles = 0,
    area = 0,
    weightedSlope = 0,
    maxSlope = 0;
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const positions = object.geometry.getAttribute('position');
    const index = object.geometry.index;
    for (let i = 0; i + 2 < (index?.count ?? positions.count); i += 3) {
      const vertex = (n: number, target: THREE.Vector3) =>
        target
          .fromBufferAttribute(positions, index ? index.getX(n) : n)
          .applyMatrix4(object.matrixWorld);
      const metric = triangleMetrics(vertex(i, a), vertex(i + 1, b), vertex(i + 2, c));
      if (!metric) continue;
      triangles++;
      area += metric.area;
      weightedSlope += metric.slope * metric.area;
      maxSlope = Math.max(maxSlope, metric.slope);
    }
  });
  if (!triangles) throw new Error('Model has no valid surface triangles');
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  return {
    triangles,
    area,
    meanSlope: weightedSlope / area,
    maxSlope,
    heightRange: size.y,
    width: size.x,
    depth: size.z,
  };
}
