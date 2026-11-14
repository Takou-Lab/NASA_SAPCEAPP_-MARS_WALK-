export interface Point {
  x: number;
  y: number;
}

export type Mode = 'inspect' | 'start' | 'destination' | 'waypoint';

export type LayerId = 'imagery' | 'markers' | 'grid' | 'coverage';

export interface Route {
  start: Point | null;
  destination: Point | null;
  waypoints: Point[];
}

export interface Source {
  title: string;
  url: string; // validated HTTPS URL
  credit: string;
}

export interface ImageManifest {
  schemaVersion: 1;
  imageRef: string; // changes when raster or coordinate interpretation changes
  assetPath: string; // local path relative to the deployed app base
  width: number;
  height: number;
  coordinateSystem: 'image-pixels-bottom-left';
  source: Source;
  observationDate: string | null;
  coverageStatus: 'regional-context' | 'verified-aoi';
  limitations: string[];
  calibration: {
    verified: boolean;
    metersPerPixel: number | null;
    sourceUrl: string | null;
    method: string | null;
  };
}

export interface ScienceMarker {
  id: string;
  name: string;
  imageRef: string;
  position: Point | null;
  positionStatus: 'verified' | 'illustrative' | 'unavailable';
  instrument: string | null;
  date: string | null;
  finding: string;
  evidenceType: 'measured' | 'derived' | 'interpreted' | 'simulated';
  source: Source;
  limitations: string[];
}

export interface Observation {
  id: string;
  imageRef: string;
  createdAt: string; // ISO timestamp
  text: string;
  position: Point | null;
}

export interface Assessment {
  planarDistanceMeters: number | null;
  distanceStatus: 'unavailable' | 'derived';
  terrainStatus: 'unavailable'; // v1 has no validated DEM contract
  warnings: string[];
}

export interface StoredRouteRecord {
  schemaVersion: 1;
  imageRef: string;
  savedAt: string;
  route: Route;
}

export interface StoredObservationsRecord {
  schemaVersion: 1;
  imageRef: string;
  savedAt: string;
  observations: Observation[];
}

export interface MissionExportData {
  schemaVersion: 1;
  appName: 'MARSWALK';
  exportedAt: string;
  imageRef: string;
  imageManifest: ImageManifest | null;
  route: Route;
  assessment: Assessment;
  observations: Observation[];
  markers: ScienceMarker[];
}
