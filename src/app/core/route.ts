import { Assessment, ImageManifest, Route } from './models';
import { https } from './validation';
export const emptyRoute = (): Route => ({ start: null, destination: null, waypoints: [] });
export const routePoints = (r: Route) => [
  ...(r.start ? [r.start] : []),
  ...r.waypoints,
  ...(r.destination ? [r.destination] : []),
];
export function assessRoute(r: Route, image: ImageManifest | null): Assessment {
  const warnings = [
    'No verified terrain model: elevation, slope and terrain distance are unavailable.',
    'Missing hazard information does not establish route safety.',
  ];
  let distance: number | null = null;
  if (!image) warnings.push('No verified image manifest is loaded.');
  else {
    warnings.push(...image.limitations);
    if (image.coverageStatus !== 'verified-aoi')
      warnings.push('Exact exploration-area coverage is unverified.');
    const c = image.calibration;
    if (!r.start || !r.destination)
      warnings.push('Select both route endpoints to assess distance.');
    else if (
      c.verified &&
      c.metersPerPixel !== null &&
      Number.isFinite(c.metersPerPixel) &&
      c.metersPerPixel > 0 &&
      https(c.sourceUrl) &&
      c.method?.trim()
    ) {
      const points = routePoints(r);
      distance =
        points
          .slice(1)
          .reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0) *
        c.metersPerPixel;
      if (!Number.isFinite(distance)) distance = null;
    } else
      warnings.push('Metric scale for this prepared image is unverified; distance unavailable.');
  }
  return {
    planarDistanceMeters: distance,
    distanceStatus: distance === null ? 'unavailable' : 'derived',
    terrainStatus: 'unavailable',
    warnings,
  };
}
