import { Assessment, ImageManifest, Mode, Point, Route } from './models';

/**
 * Checks whether a point has finite coordinates within raster boundaries if an image is provided.
 */
export function isValidPoint(point: unknown, image?: ImageManifest | null): point is Point {
  if (!point || typeof point !== 'object') {
    return false;
  }
  const p = point as { x?: unknown; y?: unknown };
  if (typeof p.x !== 'number' || typeof p.y !== 'number') {
    return false;
  }
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
    return false;
  }
  if (p.x < 0 || p.y < 0) {
    return false;
  }
  if (image) {
    if (p.x > image.width || p.y > image.height) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a deep copy of a Route.
 */
export function cloneRoute(route: Route): Route {
  return {
    start: route.start ? { ...route.start } : null,
    destination: route.destination ? { ...route.destination } : null,
    waypoints: route.waypoints.map((wp) => ({ ...wp })),
  };
}

/**
 * Pure function to apply a point to a route depending on the active mode.
 */
export function applyPointToRoute(currentRoute: Route, mode: Mode, point: Point): Route {
  if (mode === 'inspect') {
    return currentRoute;
  }

  const newRoute = cloneRoute(currentRoute);

  switch (mode) {
    case 'start':
      newRoute.start = { ...point };
      break;
    case 'destination':
      newRoute.destination = { ...point };
      break;
    case 'waypoint':
      newRoute.waypoints.push({ ...point });
      break;
  }

  return newRoute;
}

/**
 * Returns ordered array of points: start, waypoints in sequence, destination.
 */
export function getOrderedRoutePoints(route: Route): Point[] {
  const points: Point[] = [];
  if (route.start) {
    points.push({ ...route.start });
  }
  for (const wp of route.waypoints) {
    points.push({ ...wp });
  }
  if (route.destination) {
    points.push({ ...route.destination });
  }
  return points;
}

/**
 * Verifies whether calibration scale and metadata meet scientific standards.
 */
export function isCalibrationVerified(manifest: ImageManifest | null): boolean {
  if (!manifest || !manifest.calibration) {
    return false;
  }
  const { verified, metersPerPixel, sourceUrl, method } = manifest.calibration;
  if (!verified) {
    return false;
  }
  if (typeof metersPerPixel !== 'number' || !Number.isFinite(metersPerPixel) || metersPerPixel <= 0) {
    return false;
  }
  if (typeof sourceUrl !== 'string' || !sourceUrl.startsWith('https://')) {
    return false;
  }
  if (typeof method !== 'string' || method.trim().length === 0) {
    return false;
  }
  return true;
}

/**
 * Derives route assessment including planar distance and explicit limitations.
 * Never calculates terrain metrics or assigns a SAFE status.
 */
export function calculateAssessment(route: Route, manifest: ImageManifest | null): Assessment {
  const warnings: string[] = [
    'Terrain elevation data unavailable: 3D slopes, vertical relief, and surface roughness cannot be evaluated.',
    'Planar distance (if derived) measures 2D raster distance only and does not account for rover traversal obstacles.',
  ];

  if (manifest?.limitations && manifest.limitations.length > 0) {
    for (const lim of manifest.limitations) {
      if (!warnings.includes(lim)) {
        warnings.push(lim);
      }
    }
  }

  const hasEndpoints = route.start !== null && route.destination !== null;
  if (!hasEndpoints) {
    warnings.push('Incomplete route endpoints: both start and destination are required for distance estimation.');
    return {
      planarDistanceMeters: null,
      distanceStatus: 'unavailable',
      terrainStatus: 'unavailable',
      warnings,
    };
  }

  const calibrationValid = isCalibrationVerified(manifest);
  if (!calibrationValid) {
    warnings.push('Metric calibration unverified or absent: planar distance is unavailable.');
    return {
      planarDistanceMeters: null,
      distanceStatus: 'unavailable',
      terrainStatus: 'unavailable',
      warnings,
    };
  }

  const orderedPoints = getOrderedRoutePoints(route);
  let totalPixelDistance = 0;
  for (let i = 0; i < orderedPoints.length - 1; i++) {
    const p1 = orderedPoints[i];
    const p2 = orderedPoints[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    totalPixelDistance += Math.sqrt(dx * dx + dy * dy);
  }

  const metersPerPixel = manifest!.calibration.metersPerPixel!;
  const planarDistanceMeters = Math.round(totalPixelDistance * metersPerPixel * 100) / 100;

  return {
    planarDistanceMeters,
    distanceStatus: 'derived',
    terrainStatus: 'unavailable',
    warnings,
  };
}

export function createEmptyRoute(): Route {
  return {
    start: null,
    destination: null,
    waypoints: [],
  };
}
