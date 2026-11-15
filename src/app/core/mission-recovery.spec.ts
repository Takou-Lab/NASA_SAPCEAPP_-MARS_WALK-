import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MissionService } from './mission.service';
import { testImage } from './fixtures.spec-helper';
const image = testImage();
const key = `marswalk:v1:${image.imageRef}`;
function fresh() {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  return { service: TestBed.inject(MissionService), http: TestBed.inject(HttpTestingController) };
}
async function finish(s: ReturnType<typeof fresh>, editBeforeScience?: () => void) {
  const p = s.service.initialize();
  s.http.expectOne((r) => r.url.endsWith('/data/manifest.json')).flush(image);
  await Promise.resolve();
  editBeforeScience?.();
  s.http.expectOne((r) => r.url.endsWith('/data/markers.json')).flush([]);
  await p;
  s.http.verify();
}
describe('mission startup recovery', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());
  it('restores exact saved route and observation into a fresh service automatically', async () => {
    const first = fresh();
    await finish(first);
    first.service.setMode('start');
    first.service.applyMapPoint({ x: 12.25, y: 33.75 });
    expect(first.service.addObservation('Keep exact saved field observation', null).ok).toBe(true);
    expect(first.service.saveRoute().ok).toBe(true);
    const saved = localStorage.getItem(key);
    const next = fresh();
    await finish(next);
    expect(next.service.route()).toEqual(first.service.route());
    expect(next.service.observations()).toEqual(first.service.observations());
    expect(next.service.recoveryMessage()).toContain('Restored saved route and 1');
    expect(localStorage.getItem(key)).toBe(saved);
  });
  it('preserves corrupt saved bytes and reports recovery failure rather than hiding it', async () => {
    localStorage.setItem(key, 'broken saved JSON');
    const s = fresh();
    await finish(s);
    expect(localStorage.getItem(key)).toBe('broken saved JSON');
    expect(s.service.recoveryMessage()).toContain('not deleted');
    expect(s.service.observations()).toHaveLength(0);
  });
  it('does not replace newer in-session edits during slow initialization', async () => {
    localStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        imageRef: image.imageRef,
        route: { start: { x: 1, y: 2 }, destination: null, waypoints: [] },
        observations: [],
      }),
    );
    const s = fresh();
    await finish(s, () => {
      s.service.setMode('start');
      s.service.applyMapPoint({ x: 40, y: 50 });
    });
    expect(s.service.route().start).toEqual({ x: 40, y: 50 });
    expect(s.service.recoveryMessage()).toBeNull();
  });
  it('makes blocked storage visible without failing image initialization', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const s = fresh();
    await finish(s);
    expect(s.service.dataStatus()).toBe('ready');
    expect(s.service.recoveryMessage()).toContain('storage may be blocked');
  });
});
