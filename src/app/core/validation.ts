import { ImageManifest, Point, Route, ScienceMarker, Source, Observation } from './models';

const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const nullableText = (v: unknown) => v === null || text(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(text);
export function https(v: unknown): v is string {
  if (!text(v)) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' && !u.username && !u.password;
  } catch {
    return false;
  }
}
function source(v: unknown): v is Source {
  return record(v) && text(v['title']) && https(v['url']) && text(v['credit']);
}
export function validPoint(v: unknown, image: ImageManifest): v is Point {
  return (
    record(v) &&
    typeof v['x'] === 'number' &&
    Number.isFinite(v['x']) &&
    v['x'] >= 0 &&
    v['x'] <= image.width &&
    typeof v['y'] === 'number' &&
    Number.isFinite(v['y']) &&
    v['y'] >= 0 &&
    v['y'] <= image.height
  );
}
export function validRoute(v: unknown, image: ImageManifest): v is Route {
  return (
    record(v) &&
    (v['start'] === null || validPoint(v['start'], image)) &&
    (v['destination'] === null || validPoint(v['destination'], image)) &&
    Array.isArray(v['waypoints']) &&
    v['waypoints'].every((p) => validPoint(p, image))
  );
}
export function validManifest(v: unknown): v is ImageManifest {
  if (
    !record(v) ||
    v['schemaVersion'] !== 1 ||
    !text(v['imageRef']) ||
    !source(v['source']) ||
    !nullableText(v['observationDate']) ||
    !strings(v['limitations']) ||
    !['regional-context', 'verified-aoi'].includes(String(v['coverageStatus'])) ||
    v['coordinateSystem'] !== 'image-pixels-bottom-left' ||
    typeof v['width'] !== 'number' ||
    !Number.isInteger(v['width']) ||
    v['width'] <= 0 ||
    typeof v['height'] !== 'number' ||
    !Number.isInteger(v['height']) ||
    v['height'] <= 0
  )
    return false;
  const path = v['assetPath'];
  if (
    !text(path) ||
    !/^data\/imagery\/[a-zA-Z0-9_./-]+$/.test(path) ||
    path.split('/').some((p) => p === '..' || p === '.' || !p)
  )
    return false;
  const c = v['calibration'];
  if (!record(c) || typeof c['verified'] !== 'boolean') return false;
  if (!c['verified'])
    return c['metersPerPixel'] === null && c['sourceUrl'] === null && c['method'] === null;
  return (
    typeof c['metersPerPixel'] === 'number' &&
    Number.isFinite(c['metersPerPixel']) &&
    c['metersPerPixel'] > 0 &&
    https(c['sourceUrl']) &&
    text(c['method'])
  );
}
export function validMarkers(v: unknown, image: ImageManifest): v is ScienceMarker[] {
  const ids = new Set<string>();
  return (
    Array.isArray(v) &&
    v.every((m) => {
      if (
        !record(m) ||
        !text(m['id']) ||
        ids.has(m['id']) ||
        !text(m['name']) ||
        m['imageRef'] !== image.imageRef ||
        !nullableText(m['instrument']) ||
        !nullableText(m['date']) ||
        !text(m['finding']) ||
        !source(m['source']) ||
        !strings(m['limitations']) ||
        !['measured', 'derived', 'interpreted', 'simulated'].includes(String(m['evidenceType']))
      )
        return false;
      ids.add(m['id']);
      return m['positionStatus'] === 'unavailable'
        ? m['position'] === null
        : ['verified', 'illustrative'].includes(String(m['positionStatus'])) &&
            validPoint(m['position'], image);
    })
  );
}
export function validObservations(v: unknown, image: ImageManifest): v is Observation[] {
  const ids = new Set<string>();
  return (
    Array.isArray(v) &&
    v.every((n) => {
      if (
        !record(n) ||
        !text(n['id']) ||
        ids.has(n['id']) ||
        n['imageRef'] !== image.imageRef ||
        !text(n['text']) ||
        typeof n['createdAt'] !== 'string' ||
        !Number.isFinite(Date.parse(n['createdAt'])) ||
        !(n['position'] === null || validPoint(n['position'], image))
      )
        return false;
      ids.add(n['id']);
      return true;
    })
  );
}
export function validEnvelope(
  v: unknown,
  image: ImageManifest,
): v is { schemaVersion: 1; imageRef: string; route: Route; observations: Observation[] } {
  return (
    record(v) &&
    v['schemaVersion'] === 1 &&
    v['imageRef'] === image.imageRef &&
    validRoute(v['route'], image) &&
    validObservations(v['observations'], image)
  );
}
