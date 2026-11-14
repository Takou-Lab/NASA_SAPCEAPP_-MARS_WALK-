import * as THREE from 'three';
import { Point } from '../core/models';

/**
 * Height offset (in scene units) used solely to lift vector graphics
 * above the flat ground plane to prevent visual z-fighting artifacts.
 *
 * CRITICAL RULE: This is strictly a display offset and must NEVER be
 * interpreted, reported, or calculated as real terrain elevation.
 */
export const DISPLAY_Y_OFFSET = 1.0;

/**
 * Transforms a 2D image-pixel coordinate to a 3D Three.js scene position.
 *
 * 2D Contract: Origin (0,0) is at bottom-left of raster:
 *   - x increases right: [0, width]
 *   - y increases up: [0, height]
 *
 * Three.js Scene: Centered at (0, 0, 0):
 *   - X = x - width / 2
 *   - Y = yOffset (display offset, not elevation)
 *   - Z = height / 2 - y
 */
export function mapPointTo3D(
  point: Point,
  imageWidth: number,
  imageHeight: number,
  yOffset: number = DISPLAY_Y_OFFSET
): THREE.Vector3 {
  return new THREE.Vector3(
    point.x - imageWidth / 2,
    yOffset,
    imageHeight / 2 - point.y
  );
}

/**
 * Returns the four bounding box corners of the raster in 3D scene space.
 * Used to verify texture mapping and border alignment.
 */
export function getRasterCornerPositions(width: number, height: number): {
  bottomLeft: THREE.Vector3;
  bottomRight: THREE.Vector3;
  topLeft: THREE.Vector3;
  topRight: THREE.Vector3;
} {
  return {
    bottomLeft: mapPointTo3D({ x: 0, y: 0 }, width, height, 0),
    bottomRight: mapPointTo3D({ x: width, y: 0 }, width, height, 0),
    topLeft: mapPointTo3D({ x: 0, y: height }, width, height, 0),
    topRight: mapPointTo3D({ x: width, y: height }, width, height, 0),
  };
}

