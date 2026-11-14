import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from './mission.service';
import { ImageManifest } from './models';

describe('MissionService', () => {
  let service: MissionService;

  const mockManifest: ImageManifest = {
    schemaVersion: 1,
    imageRef: 'mission_spec_ref',
    assetPath: 'data/imagery/gale.png',
    width: 800,
    height: 600,
    coordinateSystem: 'image-pixels-bottom-left',
    source: {
      title: 'Mount Sharp Boxwork',
      url: 'https://mars.nasa.gov/test',
      credit: 'NASA/JPL-Caltech',
    },
    observationDate: '2024-05-10',
    coverageStatus: 'verified-aoi',
    limitations: ['2D visible spectrum only'],
    calibration: {
      verified: true,
      metersPerPixel: 0.5,
      sourceUrl: 'https://mars.nasa.gov/calibration',
      method: 'Spacecraft telemetry triangulation',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MissionService],
    });
    service = TestBed.inject(MissionService);
    service.setImageManifest(mockManifest);
  });

  it('starts in inspect mode with empty route and disabled undo', () => {
    expect(service.mode()).toBe('inspect');
    expect(service.route().start).toBeNull();
    expect(service.route().destination).toBeNull();
    expect(service.route().waypoints).toHaveLength(0);
    expect(service.canUndo()).toBe(false);
  });

  it('does not alter route when point clicked in inspect mode', () => {
    service.setMode('inspect');
    service.applyMapPoint({ x: 100, y: 150 });
    expect(service.route().start).toBeNull();
    expect(service.canUndo()).toBe(false);
  });

  it('applies points according to active mode and supports undo', () => {
    // 1. Set start
    service.setMode('start');
    service.applyMapPoint({ x: 50, y: 50 });
    expect(service.route().start).toEqual({ x: 50, y: 50 });
    expect(service.canUndo()).toBe(true);

    // 2. Set waypoint
    service.setMode('waypoint');
    service.applyMapPoint({ x: 100, y: 150 });
    expect(service.route().waypoints).toEqual([{ x: 100, y: 150 }]);

    // 3. Set destination
    service.setMode('destination');
    service.applyMapPoint({ x: 200, y: 250 });
    expect(service.route().destination).toEqual({ x: 200, y: 250 });

    // 4. Undo destination
    service.undoRoute();
    expect(service.route().destination).toBeNull();
    expect(service.route().waypoints).toEqual([{ x: 100, y: 150 }]);

    // 5. Undo waypoint
    service.undoRoute();
    expect(service.route().waypoints).toHaveLength(0);
    expect(service.route().start).toEqual({ x: 50, y: 50 });

    // 6. Undo start
    service.undoRoute();
    expect(service.route().start).toBeNull();
    expect(service.canUndo()).toBe(false);
  });

  it('clearRoute empties the route but allows undo to restore it', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 20, y: 30 });
    service.setMode('destination');
    service.applyMapPoint({ x: 200, y: 300 });

    expect(service.route().start).not.toBeNull();
    expect(service.route().destination).not.toBeNull();

    service.clearRoute();
    expect(service.route().start).toBeNull();
    expect(service.route().destination).toBeNull();
    expect(service.canUndo()).toBe(true);

    // Undo clear restores both endpoints
    service.undoRoute();
    expect(service.route().start).toEqual({ x: 20, y: 30 });
    expect(service.route().destination).toEqual({ x: 200, y: 300 });
  });

  it('validates observations and rejects whitespace-only entries', () => {
    const invalidRes = service.addObservation('   ', null);
    expect(invalidRes.ok).toBe(false);
    expect(invalidRes.error).toBeDefined();

    const validRes = service.addObservation('Layered sulphate veins observed', null);
    expect(validRes.ok).toBe(true);
    expect(service.observations()).toHaveLength(1);
    expect(service.observations()[0].text).toBe('Layered sulphate veins observed');
  });

  it('calculates assessment derived planar distance when endpoints exist', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 0, y: 0 });
    service.setMode('destination');
    service.applyMapPoint({ x: 100, y: 0 });

    const assessment = service.assessment();
    expect(assessment.distanceStatus).toBe('derived');
    // 100 px * 0.5 m/px = 50 meters
    expect(assessment.planarDistanceMeters).toBe(50);
    expect(assessment.terrainStatus).toBe('unavailable');
  });
});
