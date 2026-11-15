import { describe, expect, it } from 'vitest';
import { validEnvironmentalContext } from './environment';
const pending = {
  schemaVersion: 1,
  scope: 'historical-rover-context',
  instrument: 'REMS',
  sourceUrl: 'https://atmos.nmsu.edu/PDS/',
  reviewStatus: 'pending',
  reviewNote: 'Sources awaiting review',
  readings: [],
};
const reading = {
  quantity: 'pressure',
  unit: 'Pa',
  value: 0,
  minimum: 0,
  maximum: 1,
  sampleCount: 2,
  sol: 3900,
  startUtc: '2023-07-26T00:00:00Z',
  endUtc: '2023-07-27T00:00:00Z',
  sourceUrl: 'https://atmos.nmsu.edu/PDS/product.TAB',
  qualityNote: 'Synthetic test only; not NASA observations',
};
const accepted = { ...pending, reviewStatus: 'accepted', readings: [reading] };
describe('environmental source gate', () => {
  it('allows pending metadata without measurements and retains legitimate zero', () => {
    expect(validEnvironmentalContext(pending)).toBe(true);
    expect(validEnvironmentalContext(accepted)).toBe(true);
    expect(validEnvironmentalContext({ ...accepted, reviewStatus: 'limited' })).toBe(true);
    expect(validEnvironmentalContext({ ...pending, readings: [reading] })).toBe(false);
  });
  it.each([NaN, Infinity, -Infinity, -999])('rejects invalid measured values %s', (value) => {
    expect(validEnvironmentalContext({ ...accepted, readings: [{ ...reading, value }] })).toBe(
      false,
    );
  });
  it('rejects wrong units, source protocols/hosts, reversed intervals, empty counts and duplicates', () => {
    for (const change of [
      { unit: 'K' },
      { sourceUrl: 'javascript:alert(1)' },
      { sourceUrl: 'https://attacker.test/' },
      { startUtc: '2024-01-01T00:00:00Z' },
      { sampleCount: 0 },
      { minimum: 2 },
      { sol: -1 },
    ]) {
      expect(
        validEnvironmentalContext({ ...accepted, readings: [{ ...reading, ...change }] }),
      ).toBe(false);
    }
    expect(validEnvironmentalContext({ ...accepted, readings: [reading, reading] })).toBe(false);
    expect(validEnvironmentalContext({ ...accepted, readings: [] })).toBe(false);
    expect(validEnvironmentalContext({ ...pending, reviewStatus: 'verified-by-ai' })).toBe(false);
  });
});
