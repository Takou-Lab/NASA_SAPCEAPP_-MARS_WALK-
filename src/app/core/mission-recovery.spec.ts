import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { MissionService } from './mission.service';
import { testImage } from './fixtures.spec-helper';
import { ImageManifest } from './models';

/*
 * Mission recovery across a fresh app session (Takou release QA, Package 2).
 *
 * Every "session" below is a brand-new TestBed and MissionService that shares only
 * localStorage with the previous one. That models closing the whole browser/app process
 * and reopening the same origin and profile. Data is the synthetic test fixture only.
 *
 * Tests named "REPRODUCES DATA LOSS" assert the CURRENT unsafe behaviour so that the
 * reproduction is executable. They are expected to fail once mission.service.ts is fixed;
 * replace each with the expected behaviour written in its comment. See
 * docs/qa/TAKOU_RELEASE.md and docs/qa/TAKOU_RELEASE_BLOCKERS.md (B1).
 */

const KEY = `marswalk:v1:${testImage().imageRef}`;
const START = { x: 10, y: 20 };
const WAYPOINT = { x: 30, y: 40 };
const DESTINATION = { x: 90, y: 70 };

async function openSession(image: ImageManifest = testImage()): Promise<MissionService> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  const service = TestBed.inject(MissionService);
  const http = TestBed.inject(HttpTestingController);
  const ready = service.initialize();
  http.expectOne((r) => r.url.endsWith('/data/manifest.json')).flush(image);
  await Promise.resolve();
  http.expectOne((r) => r.url.endsWith('/data/markers.json')).flush([]);
  await ready;
  http.verify();
  return service;
}

function drawRoute(service: MissionService): void {
  service.setMode('start');
  service.applyMapPoint(START);
  service.setMode('waypoint');
  service.applyMapPoint(WAYPOINT);
  service.setMode('destination');
  service.applyMapPoint(DESTINATION);
  service.setMode('inspect');
}

function stored(): { imageRef: string; route: unknown; observations: { text: string }[] } {
  return JSON.parse(localStorage.getItem(KEY) ?? 'null');
}

async function exportPayload(service: MissionService) {
  let blob: Blob | undefined;
  vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
    blob = value as Blob;
    return 'blob:mission-recovery-test';
  });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  service.exportMission();
  return JSON.parse(await blob!.text());
}

const texts = (service: MissionService) => service.observations().map((n) => n.text);

describe('Mission recovery across a fresh app session', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('restores the exact saved route and observation only after explicit Load Route', async () => {
    const first = await openSession();
    drawRoute(first);
    const note = `TAKOU-RECOVERY-${crypto.randomUUID()}`;
    expect(first.addObservation(note, START)).toEqual({ ok: true });
    expect(first.saveRoute()).toEqual({ ok: true });
    const savedRoute = structuredClone(first.route());
    const savedNotes = structuredClone(first.observations());
    const before = await exportPayload(first);
    expect(before.observations).toEqual(savedNotes);
    const raw = localStorage.getItem(KEY);

    const second = await openSession();
    expect(second).not.toBe(first);
    // Startup display: nothing is restored automatically and storage is untouched.
    expect(second.route()).toEqual({ start: null, destination: null, waypoints: [] });
    expect(second.observations()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBe(raw);

    // Explicit recovery: the exact saved mission comes back, including ids and timestamps.
    expect(second.loadRoute()).toEqual({ ok: true });
    expect(second.route()).toEqual(savedRoute);
    expect(second.observations()).toEqual(savedNotes);
    expect(second.canUndo()).toBe(false);

    const after = await exportPayload(second);
    expect(after.imageRef).toBe(before.imageRef);
    expect(after.route).toEqual(before.route);
    expect(after.observations).toEqual(before.observations);
  });

  it('persists a successfully saved note (and the current route) without pressing Save Route', async () => {
    const first = await openSession();
    first.setMode('start');
    first.applyMapPoint(START);
    expect(first.addObservation('Saved without Save Route', null).ok).toBe(true);

    const second = await openSession();
    expect(second.loadRoute().ok).toBe(true);
    expect(texts(second)).toEqual(['Saved without Save Route']);
    expect(second.route().start).toEqual(START);
  });

  it('keeps the previously saved mission when a later note save fails', async () => {
    const first = await openSession();
    expect(first.addObservation('Saved before failure', null).ok).toBe(true);
    const raw = localStorage.getItem(KEY);
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    const failed = first.addObservation('Not saved', null);
    expect(failed.ok).toBe(false);
    expect(failed.error).toContain('Keep your draft');
    expect(texts(first)).toEqual(['Saved before failure']);
    setItem.mockRestore();
    expect(localStorage.getItem(KEY)).toBe(raw);

    const second = await openSession();
    expect(second.loadRoute().ok).toBe(true);
    expect(texts(second)).toEqual(['Saved before failure']);
  });

  it('REPRODUCES DATA LOSS: a note saved after restart but before Load Route replaces earlier notes', async () => {
    const first = await openSession();
    drawRoute(first);
    expect(first.addObservation('Earlier note A', null).ok).toBe(true);
    expect(first.saveRoute().ok).toBe(true);

    const second = await openSession();
    // User sees an empty Notebook, writes a new note and gets a success message.
    expect(second.addObservation('New note B', null)).toEqual({ ok: true });

    const third = await openSession();
    expect(third.loadRoute().ok).toBe(true);
    // CURRENT: note A and the saved route are gone.
    // EXPECTED after a fix: texts include 'Earlier note A' and the saved route is kept.
    expect(texts(third)).toEqual(['New note B']);
    expect(third.route()).toEqual({ start: null, destination: null, waypoints: [] });
  });

  it('REPRODUCES DATA LOSS: Save Route after restart but before Load Route erases saved notes', async () => {
    const first = await openSession();
    drawRoute(first);
    expect(first.addObservation('Earlier note A', null).ok).toBe(true);

    const second = await openSession();
    second.setMode('start');
    second.applyMapPoint({ x: 5, y: 5 });
    expect(second.saveRoute()).toEqual({ ok: true });

    const third = await openSession();
    expect(third.loadRoute().ok).toBe(true);
    // CURRENT: the saved observation list is now empty.
    // EXPECTED after a fix: 'Earlier note A' is still recoverable.
    expect(texts(third)).toEqual([]);
    expect(third.route().start).toEqual({ x: 5, y: 5 });
  });

  it('reports a corrupt saved record without changing state or deleting the stored bytes', async () => {
    localStorage.setItem(KEY, '{"schemaVersion":1,"imageRef":');
    const session = await openSession();
    session.setMode('start');
    session.applyMapPoint(START);
    const route = session.route();
    const result = session.loadRoute();
    expect(result.ok).toBe(false);
    expect(result.error).toContain('could not be read');
    expect(session.route()).toBe(route);
    expect(session.observations()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBe('{"schemaVersion":1,"imageRef":');
  });

  it('REPRODUCES DATA LOSS: a note saved after a failed load overwrites the unreadable record', async () => {
    const unreadable = JSON.stringify({
      schemaVersion: 1,
      imageRef: testImage().imageRef,
      route: { start: { x: 999, y: 0 }, destination: null, waypoints: [] },
      observations: [
        {
          id: 'kept-for-manual-recovery',
          imageRef: testImage().imageRef,
          createdAt: '2026-11-15T00:00:00Z',
          text: 'Hand-recoverable note',
          position: null,
        },
      ],
    });
    localStorage.setItem(KEY, unreadable);
    const session = await openSession();
    expect(session.loadRoute().ok).toBe(false);
    expect(localStorage.getItem(KEY)).toBe(unreadable);

    expect(session.addObservation('New note', null).ok).toBe(true);
    // CURRENT: the invalid record (which still held a readable note) is overwritten.
    // EXPECTED after a fix: the unreadable record is kept aside or the save is refused.
    expect(stored().observations.map((n) => n.text)).toEqual(['New note']);
  });

  it('reports unavailable storage on load and save without publishing unsaved notes', async () => {
    const session = await openSession();
    drawRoute(session);
    const route = session.route();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    const load = session.loadRoute();
    expect(load.ok).toBe(false);
    expect(load.error).toContain('Existing state is unchanged');
    expect(session.route()).toBe(route);
    const save = session.saveRoute();
    expect(save.ok).toBe(false);
    expect(save.error).toContain('Export your mission');
    expect(session.addObservation('Unsaved note', null).ok).toBe(false);
    expect(session.observations()).toEqual([]);
  });

  it('keeps missions for a different image reference separate and untouched', async () => {
    const first = await openSession();
    expect(first.addObservation('Belongs to the synthetic image', null).ok).toBe(true);
    const raw = localStorage.getItem(KEY);

    const other = await openSession({ ...testImage(), imageRef: 'synthetic-test-only-v2' });
    const result = other.loadRoute();
    expect(result).toEqual({ ok: false, error: 'No saved mission for this image.' });
    expect(other.observations()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBe(raw);
  });
});
