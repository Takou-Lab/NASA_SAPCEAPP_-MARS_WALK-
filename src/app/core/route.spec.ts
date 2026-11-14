import { assessRoute } from './route';
import { testImage } from './fixtures.spec-helper';
import { validManifest, validMarkers } from './validation';

describe('scientific and coordinate gates', () => {
  const route = { start: { x: 0, y: 0 }, destination: { x: 6, y: 8 }, waypoints: [{ x: 3, y: 4 }] };
  it('does not turn image pixels into meters without verified calibration', () => {
    expect(assessRoute(route, testImage()).planarDistanceMeters).toBeNull();
  });
  it('sums ordered segments with verified calibration without enabling terrain', () => {
    const image = testImage();
    image.calibration = {
      verified: true,
      metersPerPixel: 2,
      sourceUrl: 'https://example.org/calibration',
      method: 'Synthetic test calibration',
    };
    expect(assessRoute(route, image).planarDistanceMeters).toBe(20);
    expect(assessRoute(route, image).terrainStatus).toBe('unavailable');
    expect(assessRoute({ ...route, destination: null }, image).planarDistanceMeters).toBeNull();
  });
  it('rejects unsafe paths, nonfinite dimensions and invalid calibration', () => {
    expect(validManifest(testImage())).toBe(true);
    for (const path of [
      'https://example.org/a.png',
      '../image.png',
      'data/imagery/../image.png',
      '/image.png',
    ]) {
      expect(validManifest({ ...testImage(), assetPath: path })).toBe(false);
    }
    expect(validManifest({ ...testImage(), width: Infinity })).toBe(false);
    expect(
      validManifest({
        ...testImage(),
        calibration: { verified: true, metersPerPixel: -1, sourceUrl: null, method: null },
      }),
    ).toBe(false);
  });
  it('rejects mismatched marker references, duplicate IDs and falsely available positions', () => {
    const marker = {
      id: 'one',
      name: 'test',
      imageRef: testImage().imageRef,
      position: null,
      positionStatus: 'unavailable',
      instrument: null,
      date: null,
      finding: 'test only',
      evidenceType: 'simulated',
      source: testImage().source,
      limitations: [],
    };
    expect(validMarkers([marker], testImage())).toBe(true);
    expect(validMarkers([marker, marker], testImage())).toBe(false);
    expect(validMarkers([{ ...marker, imageRef: 'other' }], testImage())).toBe(false);
    expect(validMarkers([{ ...marker, positionStatus: 'verified' }], testImage())).toBe(false);
  });
});
