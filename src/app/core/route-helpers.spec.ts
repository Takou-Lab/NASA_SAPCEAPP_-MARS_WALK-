import { describe, expect, it } from 'vitest';
import { ImageManifest, Route } from './models';
import {
  applyPointToRoute,
  calculateAssessment,
  cloneRoute,
  createEmptyRoute,
  getOrderedRoutePoints,
  isCalibrationVerified,
  isValidPoint,
} from './route-helpers';

describe('route-helpers', () => {
  const sampleManifest: ImageManifest = {
    schemaVersion: 1,
    imageRef: 'gale_ctx_test_v1',
    assetPath: 'data/imagery/test.png',
    width: 1000,
    height: 800,
    coordinateSystem: 'image-pixels-bottom-left',
    source: {
      title: 'HiRISE Gale Crater',
      url: 'https://hirise.lpl.arizona.edu/test',
      credit: 'NASA/JPL/University of Arizona',
    },
    observationDate: '2024-01-01',
    coverageStatus: 'verified-aoi',
    limitations: ['Visual context only'],
    calibration: {
      verified: true,
      metersPerPixel: 0.25,
      sourceUrl: 'https://hirise.lpl.arizona.edu/calibration',
      method: 'Camera focal length and spacecraft altitude geometry',
    },
  };

  describe('isValidPoint', () => {
    it('accepts valid finite points within bounds', () => {
      expect(isValidPoint({ x: 0, y: 0 }, sampleManifest)).toBe(true);
      expect(isValidPoint({ x: 500, y: 400 }, sampleManifest)).toBe(true);
      expect(isValidPoint({ x: 1000, y: 800 }, sampleManifest)).toBe(true);
    });

    it('rejects points exceeding image bounds or negative coordinates', () => {
      expect(isValidPoint({ x: -1, y: 100 }, sampleManifest)).toBe(false);
      expect(isValidPoint({ x: 100, y: -1 }, sampleManifest)).toBe(false);
      expect(isValidPoint({ x: 1001, y: 400 }, sampleManifest)).toBe(false);
      expect(isValidPoint({ x: 500, y: 801 }, sampleManifest)).toBe(false);
    });

    it('rejects nonfinite values and invalid objects', () => {
      expect(isValidPoint({ x: NaN, y: 100 })).toBe(false);
      expect(isValidPoint({ x: 100, y: Infinity })).toBe(false);
      expect(isValidPoint(null)).toBe(false);
      expect(isValidPoint('not a point')).toBe(false);
    });
  });

  describe('applyPointToRoute', () => {
    it('does not modify route in inspect mode', () => {
      const initial = createEmptyRoute();
      const updated = applyPointToRoute(initial, 'inspect', { x: 100, y: 200 });
      expect(updated).toEqual(initial);
      expect(updated.start).toBeNull();
    });

    it('sets start in start mode', () => {
      const initial = createEmptyRoute();
      const updated = applyPointToRoute(initial, 'start', { x: 10, y: 20 });
      expect(updated.start).toEqual({ x: 10, y: 20 });
      expect(updated.destination).toBeNull();
      expect(updated.waypoints).toHaveLength(0);
    });

    it('sets destination in destination mode', () => {
      const initial = createEmptyRoute();
      const updated = applyPointToRoute(initial, 'destination', { x: 90, y: 80 });
      expect(updated.destination).toEqual({ x: 90, y: 80 });
      expect(updated.start).toBeNull();
    });

    it('appends waypoints in waypoint mode', () => {
      let route = createEmptyRoute();
      route = applyPointToRoute(route, 'waypoint', { x: 30, y: 40 });
      route = applyPointToRoute(route, 'waypoint', { x: 50, y: 60 });
      expect(route.waypoints).toEqual([
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ]);
    });
  });

  describe('getOrderedRoutePoints', () => {
    it('orders start, then waypoints, then destination', () => {
      const route: Route = {
        start: { x: 0, y: 0 },
        destination: { x: 100, y: 100 },
        waypoints: [
          { x: 20, y: 20 },
          { x: 50, y: 50 },
        ],
      };
      const ordered = getOrderedRoutePoints(route);
      expect(ordered).toEqual([
        { x: 0, y: 0 },
        { x: 20, y: 20 },
        { x: 50, y: 50 },
        { x: 100, y: 100 },
      ]);
    });
  });

  describe('calculateAssessment', () => {
    it('reports distance as unavailable when start or destination is missing', () => {
      const routeWithoutDest: Route = {
        start: { x: 0, y: 0 },
        destination: null,
        waypoints: [{ x: 50, y: 50 }],
      };
      const assessment = calculateAssessment(routeWithoutDest, sampleManifest);
      expect(assessment.distanceStatus).toBe('unavailable');
      expect(assessment.planarDistanceMeters).toBeNull();
      expect(assessment.terrainStatus).toBe('unavailable');
      expect(assessment.warnings.some((w) => w.includes('Incomplete route endpoints'))).toBe(true);
    });

    it('reports distance as unavailable when calibration is not verified', () => {
      const uncalibratedManifest: ImageManifest = {
        ...sampleManifest,
        calibration: {
          verified: false,
          metersPerPixel: null,
          sourceUrl: null,
          method: null,
        },
      };
      const route: Route = {
        start: { x: 0, y: 0 },
        destination: { x: 100, y: 0 },
        waypoints: [],
      };
      const assessment = calculateAssessment(route, uncalibratedManifest);
      expect(assessment.distanceStatus).toBe('unavailable');
      expect(assessment.planarDistanceMeters).toBeNull();
      expect(assessment.warnings.some((w) => w.includes('calibration unverified'))).toBe(true);
    });

    it('derives accurate planar distance when endpoints and verified calibration exist', () => {
      // 100 pixels horizontal with scale 0.25 meters/pixel = 25 meters
      const route: Route = {
        start: { x: 0, y: 0 },
        destination: { x: 100, y: 0 },
        waypoints: [],
      };
      const assessment = calculateAssessment(route, sampleManifest);
      expect(assessment.distanceStatus).toBe('derived');
      expect(assessment.planarDistanceMeters).toBe(25);
      expect(assessment.terrainStatus).toBe('unavailable');
      expect(assessment.warnings.some((w) => w.includes('Terrain elevation data unavailable'))).toBe(
        true,
      );
    });

    it('sums multi-segment distances correctly with waypoints', () => {
      // (0,0) -> (30, 40) is 50 px
      // (30,40) -> (30, 80) is 40 px
      // total = 90 px * 0.25 = 22.5 m
      const route: Route = {
        start: { x: 0, y: 0 },
        destination: { x: 30, y: 80 },
        waypoints: [{ x: 30, y: 40 }],
      };
      const assessment = calculateAssessment(route, sampleManifest);
      expect(assessment.distanceStatus).toBe('derived');
      expect(assessment.planarDistanceMeters).toBe(22.5);
    });
  });
});
