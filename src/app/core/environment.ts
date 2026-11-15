/** Environmental context is historical and separate from image/route assessment. */
export interface EnvironmentalReading {
  readonly quantity: 'pressure' | 'air-temperature' | 'ground-temperature' | 'humidity' | 'uv';
  readonly unit: 'Pa' | 'K' | '%' | 'W/m²';
  readonly value: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly sampleCount: number;
  readonly sol: number;
  readonly startUtc: string;
  readonly endUtc: string;
  readonly sourceUrl: string;
  readonly qualityNote: string;
}
export interface EnvironmentalContext {
  readonly schemaVersion: 1;
  readonly reviewStatus: 'pending' | 'limited' | 'accepted';
  readonly scope: 'historical-rover-context';
  readonly instrument: 'REMS';
  readonly sourceUrl: string;
  readonly reviewNote: string;
  readonly readings: readonly EnvironmentalReading[];
}
const units = {
  pressure: 'Pa',
  'air-temperature': 'K',
  'ground-temperature': 'K',
  humidity: '%',
  uv: 'W/m²',
} as const;
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= 2000;
export function environmentalSource(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  try {
    const u = new URL(v);
    return (
      u.protocol === 'https:' &&
      !u.username &&
      !u.password &&
      (u.hostname === 'atmos.nmsu.edu' || u.hostname === 'pds-atmospheres.nmsu.edu')
    );
  } catch {
    return false;
  }
}
const time = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(v) &&
  Number.isFinite(Date.parse(v));
export function validEnvironmentalContext(v: unknown): v is EnvironmentalContext {
  if (
    !record(v) ||
    v['schemaVersion'] !== 1 ||
    v['scope'] !== 'historical-rover-context' ||
    v['instrument'] !== 'REMS' ||
    !environmentalSource(v['sourceUrl']) ||
    !text(v['reviewNote']) ||
    !Array.isArray(v['readings']) ||
    v['readings'].length > 1000
  )
    return false;
  // Pending source review can never ship numerical measurements through this contract.
  if (v['reviewStatus'] === 'pending') return v['readings'].length === 0;
  if (!['accepted', 'limited'].includes(v['reviewStatus'] as string) || !v['readings'].length)
    return false;
  const seen = new Set<string>();
  return v['readings'].every((r: unknown) => {
    if (
      !record(r) ||
      typeof r['quantity'] !== 'string' ||
      !Object.hasOwn(units, r['quantity']) ||
      units[r['quantity'] as keyof typeof units] !== r['unit']
    )
      return false;
    const value = r['value'],
      minimum = r['minimum'],
      maximum = r['maximum'];
    if (
      typeof value !== 'number' ||
      typeof minimum !== 'number' ||
      typeof maximum !== 'number' ||
      ![value, minimum, maximum].every(Number.isFinite) ||
      minimum < 0 ||
      minimum > value ||
      value > maximum ||
      (r['quantity'] === 'humidity' && maximum > 100)
    )
      return false;
    if (
      typeof r['sampleCount'] !== 'number' ||
      !Number.isSafeInteger(r['sampleCount']) ||
      r['sampleCount'] <= 0 ||
      typeof r['sol'] !== 'number' ||
      !Number.isSafeInteger(r['sol']) ||
      r['sol'] < 0 ||
      !time(r['startUtc']) ||
      !time(r['endUtc']) ||
      Date.parse(r['startUtc']) > Date.parse(r['endUtc']) ||
      !environmentalSource(r['sourceUrl']) ||
      !text(r['qualityNote'])
    )
      return false;
    const key = `${r['quantity']}:${r['sol']}:${r['startUtc']}:${r['endUtc']}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
