import { describe, expect, it } from 'vitest';
import { calculateBudget, validInputs } from './budget';
const inputs = { speedKmh: 1, availableMinutes: 120, taskMinutes: 20, reserveMinutes: 30 };
describe('out-and-back scenario arithmetic', () => {
  it('accounts for the full drawn route twice and protects the entered reserve', () => {
    const r = calculateBudget(500, inputs);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.roundTripMeters).toBe(1000);
    expect(r.travelMinutes).toBe(60);
    expect(r.plannedMinutes).toBe(80);
    expect(r.marginMinutes).toBe(10);
    expect(r.maxOutwardMeters).toBeCloseTo(583.333333);
    expect(r.fits).toBe(true);
  });
  it('reports an exceeded budget instead of clamping a deficit away', () => {
    const r = calculateBudget(1000, inputs);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.marginMinutes).toBe(-50);
      expect(r.fits).toBe(false);
    }
  });
  it('accepts an exactly exhausted scenario margin', () => {
    const r = calculateBudget(500, { ...inputs, availableMinutes: 110 });
    expect(r.ok && r.marginMinutes).toBe(0);
    expect(r.ok && r.fits).toBe(true);
  });
  it('accepts derived zero distance but still includes tasks and reserve', () => {
    const r = calculateBudget(0, inputs);
    expect(r.ok && r.travelMinutes).toBe(0);
    expect(r.ok && r.marginMinutes).toBe(70);
  });
  it('does not manufacture distance from missing calibration or endpoints', () => {
    expect(calculateBudget(null, inputs).ok).toBe(false);
  });
  it('handles tasks/reserve already exceeding time even for zero travel', () => {
    const r = calculateBudget(0, { ...inputs, availableMinutes: 10 });
    expect(r.ok && r.marginMinutes).toBe(-40);
    expect(r.ok && r.maxOutwardMeters).toBe(0);
  });
  it('rejects blank, nonfinite, negative and zero speed/time inputs', () => {
    for (const bad of [null, NaN, Infinity, -1, 0]) {
      expect(calculateBudget(500, { ...inputs, speedKmh: bad }).ok).toBe(false);
      expect(calculateBudget(500, { ...inputs, availableMinutes: bad }).ok).toBe(false);
    }
    for (const bad of [null, NaN, Infinity, -1]) {
      expect(calculateBudget(500, { ...inputs, taskMinutes: bad }).ok).toBe(false);
      expect(calculateBudget(500, { ...inputs, reserveMinutes: bad }).ok).toBe(false);
    }
    expect(calculateBudget(-1, inputs).ok).toBe(false);
    expect(calculateBudget(Infinity, inputs).ok).toBe(false);
  });
  it('rejects arithmetic overflow and malformed persisted assumptions', () => {
    expect(calculateBudget(Number.MAX_VALUE, { ...inputs, speedKmh: Number.MIN_VALUE }).ok).toBe(
      false,
    );
    expect(validInputs({})).toBe(false);
    expect(validInputs(null)).toBe(false);
    expect(validInputs(inputs)).toBe(true);
  });
});
