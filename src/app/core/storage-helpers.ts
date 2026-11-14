import {
  ImageManifest,
  MissionExportData,
  Observation,
  Route,
  ScienceMarker,
  StoredObservationsRecord,
  StoredRouteRecord,
} from './models';
import { cloneRoute, isValidPoint } from './route-helpers';

const ROUTE_STORAGE_KEY_PREFIX = 'marswalk_route_v1_';
const OBS_STORAGE_KEY_PREFIX = 'marswalk_obs_v1_';

export function getRouteStorageKey(imageRef: string): string {
  return `${ROUTE_STORAGE_KEY_PREFIX}${imageRef}`;
}

export function getObsStorageKey(imageRef: string): string {
  return `${OBS_STORAGE_KEY_PREFIX}${imageRef}`;
}

export function validateStoredRoute(data: unknown, expectedImageRef: string): Route | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const record = data as Partial<StoredRouteRecord>;
  if (record.schemaVersion !== 1 || record.imageRef !== expectedImageRef) {
    return null;
  }
  if (!record.route || typeof record.route !== 'object') {
    return null;
  }
  const rawRoute = record.route;
  const start = rawRoute.start && isValidPoint(rawRoute.start) ? { ...rawRoute.start } : null;
  const destination =
    rawRoute.destination && isValidPoint(rawRoute.destination) ? { ...rawRoute.destination } : null;
  const waypoints: { x: number; y: number }[] = [];
  if (Array.isArray(rawRoute.waypoints)) {
    for (const wp of rawRoute.waypoints) {
      if (isValidPoint(wp)) {
        waypoints.push({ ...wp });
      }
    }
  }

  return { start, destination, waypoints };
}

export function saveRouteToStorage(
  route: Route,
  imageRef: string,
  storage: Storage = localStorage,
): { ok: boolean; error?: string } {
  try {
    const record: StoredRouteRecord = {
      schemaVersion: 1,
      imageRef,
      savedAt: new Date().toISOString(),
      route: cloneRoute(route),
    };
    storage.setItem(getRouteStorageKey(imageRef), JSON.stringify(record));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: `Storage failure: ${err instanceof Error ? err.message : 'Unable to access local storage'}`,
    };
  }
}

export function loadRouteFromStorage(
  imageRef: string,
  storage: Storage = localStorage,
): { ok: boolean; route?: Route; error?: string } {
  try {
    const raw = storage.getItem(getRouteStorageKey(imageRef));
    if (!raw) {
      return { ok: false, error: 'No saved route found for the active image reference.' };
    }
    const parsed = JSON.parse(raw);
    const validRoute = validateStoredRoute(parsed, imageRef);
    if (!validRoute) {
      return {
        ok: false,
        error: 'Saved route is invalid, corrupted, or belongs to a different image reference.',
      };
    }
    return { ok: true, route: validRoute };
  } catch (err) {
    return {
      ok: false,
      error: `Failed to load route: ${err instanceof Error ? err.message : 'Invalid data format'}`,
    };
  }
}

export function validateObservationText(text: string): { valid: boolean; error?: string } {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return { valid: false, error: 'Observation text cannot be empty or whitespace only.' };
  }
  return { valid: true };
}

export function saveObservationsToStorage(
  observations: Observation[],
  imageRef: string,
  storage: Storage = localStorage,
): { ok: boolean; error?: string } {
  try {
    const record: StoredObservationsRecord = {
      schemaVersion: 1,
      imageRef,
      savedAt: new Date().toISOString(),
      observations,
    };
    storage.setItem(getObsStorageKey(imageRef), JSON.stringify(record));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: `Storage failure: ${err instanceof Error ? err.message : 'Unable to access local storage'}`,
    };
  }
}

export function loadObservationsFromStorage(
  imageRef: string,
  storage: Storage = localStorage,
): { ok: boolean; observations?: Observation[]; error?: string } {
  try {
    const raw = storage.getItem(getObsStorageKey(imageRef));
    if (!raw) {
      return { ok: true, observations: [] };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== 1 || parsed.imageRef !== imageRef) {
      return {
        ok: false,
        error: 'Saved observations belong to a different image reference or schema version.',
      };
    }
    if (!Array.isArray(parsed.observations)) {
      return { ok: false, error: 'Corrupt observations format.' };
    }
    const validList: Observation[] = [];
    for (const obs of parsed.observations) {
      if (
        obs &&
        typeof obs.id === 'string' &&
        typeof obs.text === 'string' &&
        typeof obs.createdAt === 'string'
      ) {
        validList.push({
          id: obs.id,
          imageRef: obs.imageRef || imageRef,
          createdAt: obs.createdAt,
          text: obs.text,
          position: obs.position && isValidPoint(obs.position) ? obs.position : null,
        });
      }
    }
    return { ok: true, observations: validList };
  } catch (err) {
    return {
      ok: false,
      error: `Failed to load observations: ${err instanceof Error ? err.message : 'Parse error'}`,
    };
  }
}

export function buildMissionExportData(
  manifest: ImageManifest | null,
  route: Route,
  observations: readonly Observation[],
  markers: readonly ScienceMarker[],
): MissionExportData {
  return {
    schemaVersion: 1,
    appName: 'MARSWALK',
    exportedAt: new Date().toISOString(),
    imageRef: manifest ? manifest.imageRef : 'none',
    imageManifest: manifest,
    route: cloneRoute(route),
    assessment: {
      planarDistanceMeters: null,
      distanceStatus: 'unavailable',
      terrainStatus: 'unavailable',
      warnings: [],
    },
    observations: [...observations],
    markers: [...markers],
  };
}
