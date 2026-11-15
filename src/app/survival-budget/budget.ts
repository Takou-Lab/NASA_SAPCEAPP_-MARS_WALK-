export interface BudgetInputs {
  speedKmh: number | null;
  availableMinutes: number | null;
  taskMinutes: number | null;
  reserveMinutes: number | null;
}
export function calculateBudget(distanceMeters: number | null, inputs: BudgetInputs) {
  if (distanceMeters === null || !Number.isFinite(distanceMeters) || distanceMeters < 0)
    return {
      ok: false as const,
      reason: 'Set both route endpoints and use a calibrated image to calculate the time scenario.',
    };
  const { speedKmh, availableMinutes, taskMinutes, reserveMinutes } = inputs;
  if (
    speedKmh === null ||
    !Number.isFinite(speedKmh) ||
    speedKmh <= 0 ||
    availableMinutes === null ||
    !Number.isFinite(availableMinutes) ||
    availableMinutes <= 0 ||
    taskMinutes === null ||
    !Number.isFinite(taskMinutes) ||
    taskMinutes < 0 ||
    reserveMinutes === null ||
    !Number.isFinite(reserveMinutes) ||
    reserveMinutes < 0
  )
    return {
      ok: false as const,
      reason:
        'Enter a positive walking speed and available time; enter zero or more minutes for tasks and reserve.',
    };
  const oneWayMinutes = (distanceMeters / (speedKmh * 1000)) * 60;
  const roundTripMeters = distanceMeters * 2;
  const travelMinutes = oneWayMinutes * 2;
  const plannedMinutes = travelMinutes + taskMinutes;
  const marginMinutes = availableMinutes - reserveMinutes - plannedMinutes;
  const maxOutwardMeters = Math.max(
    0,
    (((availableMinutes - taskMinutes - reserveMinutes) / 2) * speedKmh * 1000) / 60,
  );
  if (
    ![
      oneWayMinutes,
      roundTripMeters,
      travelMinutes,
      plannedMinutes,
      marginMinutes,
      maxOutwardMeters,
    ].every(Number.isFinite)
  )
    return {
      ok: false as const,
      reason: 'These inputs exceed the calculation range. Use smaller finite values.',
    };
  return {
    ok: true as const,
    oneWayMeters: distanceMeters,
    roundTripMeters,
    oneWayMinutes,
    travelMinutes,
    plannedMinutes,
    marginMinutes,
    maxOutwardMeters,
    fits: marginMinutes >= 0,
  };
}
export function validInputs(value: unknown): value is BudgetInputs {
  if (!value || typeof value !== 'object') return false;
  const v = value as BudgetInputs;
  return calculateBudget(0, v).ok;
}
