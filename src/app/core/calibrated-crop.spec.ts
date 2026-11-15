import { describe, it, expect } from 'vitest';
import manifest from '../../../public/data/manifest.json';
import { validManifest, validEnvelope } from './validation';
import { assessRoute } from './route';
import type { ImageManifest } from './models';
const image = manifest as ImageManifest;
describe('active georeferenced crop contract', () => {
  it('validates square projected pixel scale and derives known planar lengths, including zero', () => {
    expect(validManifest(manifest)).toBe(true);
    expect(image.width).toBe(2048);
    expect(image.height).toBe(2048);
    expect(image.calibration.metersPerPixel).toBe(0.25);
    const a = assessRoute(
      { start: { x: 0, y: 0 }, destination: { x: 2048, y: 0 }, waypoints: [] },
      image,
    );
    expect(a.planarDistanceMeters).toBe(512);
    expect(a.terrainStatus).toBe('unavailable');
    expect(
      assessRoute({ start: { x: 0, y: 0 }, destination: { x: 300, y: 400 }, waypoints: [] }, image)
        .planarDistanceMeters,
    ).toBe(125);
    expect(
      assessRoute({ start: { x: 10, y: 10 }, destination: { x: 10, y: 10 }, waypoints: [] }, image)
        .planarDistanceMeters,
    ).toBe(0);
  });
  it('rejects legacy-image missions instead of silently moving their coordinates', () => {
    expect(
      validEnvelope(
        {
          schemaVersion: 1,
          imageRef: 'hirise-mro-pia26306-boxwork-2048x1042-v1',
          route: { start: { x: 10, y: 10 }, destination: null, waypoints: [] },
          observations: [],
        },
        image,
      ),
    ).toBe(false);
  });
});
