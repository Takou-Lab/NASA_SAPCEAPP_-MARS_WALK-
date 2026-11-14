import { ImageManifest } from './models';
/** Synthetic test fixture only; not a scientific source or application asset. */
export const testImage = (): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'synthetic-test-only',
  assetPath: 'data/imagery/test.png',
  width: 100,
  height: 80,
  coordinateSystem: 'image-pixels-bottom-left',
  source: { title: 'Synthetic test fixture', url: 'https://example.org/test', credit: 'Test only' },
  observationDate: null,
  coverageStatus: 'regional-context',
  limitations: ['Synthetic test data'],
  calibration: { verified: false, metersPerPixel: null, sourceUrl: null, method: null },
});
