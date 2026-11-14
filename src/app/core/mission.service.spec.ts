import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { MissionService } from './mission.service';
import { testImage } from './fixtures.spec-helper';

describe('MissionService', () => {
  let service: MissionService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MissionService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });
  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });
  async function load(markers: object[] = []) {
    const promise = service.initialize();
    http.expectOne((r) => r.url.endsWith('/data/manifest.json')).flush(testImage());
    await Promise.resolve();
    http.expectOne((r) => r.url.endsWith('/data/markers.json')).flush(markers);
    await promise;
  }
  it('loads once and exposes readonly immutable mission records', async () => {
    await load();
    await service.initialize();
    expect(service.dataStatus()).toBe('ready');
    expect(Object.isFrozen(service.image())).toBe(true);
    expect(service.assessment().planarDistanceMeters).toBeNull();
  });
  it('handles missing image data without crashing or fabricating a manifest', async () => {
    const p = service.initialize();
    http
      .expectOne((r) => r.url.endsWith('/data/manifest.json'))
      .flush('', { status: 404, statusText: 'Not Found' });
    await p;
    expect(service.dataStatus()).toBe('unavailable');
    expect(service.image()).toBeNull();
    expect(service.saveRoute().ok).toBe(false);
  });
  it('rejects an invalid manifest', async () => {
    const p = service.initialize();
    http
      .expectOne((r) => r.url.endsWith('/data/manifest.json'))
      .flush({ ...testImage(), width: -1 });
    await p;
    expect(service.dataStatus()).toBe('error');
    expect(service.image()).toBeNull();
  });
  it('keeps usable imagery when science records fail validation', async () => {
    await load([{ id: 'bad' }]);
    expect(service.dataStatus()).toBe('ready');
    expect(service.markers()).toEqual([]);
    expect(service.dataError()).toContain('validated');
  });
  it('ignores inspect mode and invalid points, replaces endpoints and supports undo/clear', async () => {
    await load();
    service.applyMapPoint({ x: 1, y: 2 });
    expect(service.route().start).toBeNull();
    service.setMode('start');
    service.applyMapPoint({ x: Infinity, y: 0 });
    service.applyMapPoint({ x: 101, y: 0 });
    expect(service.canUndo()).toBe(false);
    service.applyMapPoint({ x: 1, y: 2 });
    service.applyMapPoint({ x: 3, y: 4 });
    service.undoRoute();
    expect(service.route().start).toEqual({ x: 1, y: 2 });
    service.setMode('waypoint');
    service.applyMapPoint({ x: 5, y: 6 });
    service.setMode('destination');
    service.applyMapPoint({ x: 10, y: 20 });
    service.clearRoute();
    expect(service.route().start).toBeNull();
    service.undoRoute();
    expect(service.route().waypoints).toEqual([{ x: 5, y: 6 }]);
    expect(service.route().destination).toEqual({ x: 10, y: 20 });
  });
  it('round trips valid route and notes and resets undo on load', async () => {
    await load();
    service.setMode('start');
    service.applyMapPoint({ x: 1, y: 2 });
    expect(service.addObservation(' A note ', null).ok).toBe(true);
    service.clearRoute();
    expect(service.loadRoute().ok).toBe(true);
    expect(service.route().start).toEqual({ x: 1, y: 2 });
    expect(service.observations()[0].text).toBe('A note');
    expect(service.canUndo()).toBe(false);
  });
  it('rejects malformed, mismatched and out-of-bounds stored records without changing state', async () => {
    await load();
    const key = 'marswalk:v1:synthetic-test-only';
    for (const raw of [
      '{',
      JSON.stringify({ schemaVersion: 1, imageRef: 'other' }),
      JSON.stringify({
        schemaVersion: 1,
        imageRef: testImage().imageRef,
        route: { start: { x: 999, y: 0 }, destination: null, waypoints: [] },
        observations: [],
      }),
    ]) {
      localStorage.setItem(key, raw);
      expect(service.loadRoute().ok).toBe(false);
      expect(service.route().start).toBeNull();
    }
  });
  it('reports failed storage and does not publish an unsaved observation', async () => {
    await load();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full');
    });
    expect(service.saveRoute().ok).toBe(false);
    expect(service.addObservation('draft', null).ok).toBe(false);
    expect(service.observations()).toEqual([]);
  });
  it('rejects blank observations and invalid positions', async () => {
    await load();
    expect(service.addObservation('  ', null).ok).toBe(false);
    expect(service.addObservation('text', { x: -1, y: 0 }).ok).toBe(false);
  });
  it('exports versioned mission JSON with provenance and limitations', async () => {
    await load();
    let blob: Blob | undefined;
    vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
      blob = value as Blob;
      return 'blob:test';
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    service.exportMission();
    const result = JSON.parse(await blob!.text());
    expect(result.schemaVersion).toBe(1);
    expect(result.imageRef).toBe(testImage().imageRef);
    expect(result.image.source).toEqual(testImage().source);
    expect(result.assessment.terrainStatus).toBe('unavailable');
    expect(result.type).toBeUndefined();
  });
});
