import { describe, it, expect } from 'vitest';
import { DISPLAY_Y_OFFSET, getRasterCornerPositions, mapPointTo3D } from './transform';

describe('Viewer3D Coordinate Transforms', () => {
  const width = 1000;
  const height = 800;

  it('maps bottom-left (0,0) to (-width/2, offset, height/2)', () => {
    const pos = mapPointTo3D({ x: 0, y: 0 }, width, height);
    expect(pos.x).toBe(-500);
    expect(pos.y).toBe(DISPLAY_Y_OFFSET);
    expect(pos.z).toBe(400);
  });

  it('maps center (width/2, height/2) to (0, offset, 0)', () => {
    const pos = mapPointTo3D({ x: 500, y: 400 }, width, height);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(DISPLAY_Y_OFFSET);
    expect(pos.z).toBe(0);
  });

  it('maps top-right (width, height) to (width/2, offset, -height/2)', () => {
    const pos = mapPointTo3D({ x: 1000, y: 800 }, width, height);
    expect(pos.x).toBe(500);
    expect(pos.y).toBe(DISPLAY_Y_OFFSET);
    expect(pos.z).toBe(-400);
  });

  it('maps all four raster corners consistently', () => {
    const corners = getRasterCornerPositions(width, height);
    expect(corners.bottomLeft).toEqual({ x: -500, y: 0, z: 400 });
    expect(corners.bottomRight).toEqual({ x: 500, y: 0, z: 400 });
    expect(corners.topLeft).toEqual({ x: -500, y: 0, z: -400 });
    expect(corners.topRight).toEqual({ x: 500, y: 0, z: -400 });
  });

  it('preserves custom yOffset without treating it as real elevation', () => {
    const customOffset = 2.5;
    const pos = mapPointTo3D({ x: 100, y: 200 }, width, height, customOffset);
    expect(pos.y).toBe(customOffset);
  });
});

