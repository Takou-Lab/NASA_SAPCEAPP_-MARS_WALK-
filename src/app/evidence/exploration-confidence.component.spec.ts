import { computed, type Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type { Assessment, ImageManifest, LayerId, Mode, Observation, Route } from '../core/models';
import { assessRoute } from '../core/route';
import { ExplorationConfidenceComponent } from './exploration-confidence.component';

const makeImage = (overrides: Partial<ImageManifest> = {}): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'synthetic-image-v1',
  assetPath: 'data/imagery/synthetic.jpg',
  width: 2048,
  height: 1042,
  coordinateSystem: 'image-pixels-bottom-left',
  source: {
    title: 'Synthetic Orbital Context',
    url: 'https://example.test/source',
    credit: 'Synthetic Test Credit',
  },
  observationDate: '2025-01-15',
  coverageStatus: 'regional-context',
  limitations: ['Synthetic regional imagery limitation.'],
  calibration: {
    verified: false,
    metersPerPixel: null,
    sourceUrl: null,
    method: null,
  },
  ...overrides,
});

describe('ExplorationConfidenceComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ExplorationConfidenceComponent>>;
  let state: {
    dataStatus: ReturnType<typeof signal<'loading' | 'ready' | 'unavailable' | 'error'>>;
    dataError: ReturnType<typeof signal<string | null>>;
    image: ReturnType<typeof signal<ImageManifest | null>>;
    route: ReturnType<typeof signal<Route>>;
    mode: ReturnType<typeof signal<Mode>>;
    layers: ReturnType<typeof signal<Readonly<Record<LayerId, boolean>>>>;
    selectedMarkerId: ReturnType<typeof signal<string | null>>;
    observations: ReturnType<typeof signal<readonly Observation[]>>;
    assessmentOverride: ReturnType<typeof signal<Assessment | null>>;
    assessment: Signal<Assessment>;
  };
  let initialize: Mock<() => Promise<void>>;
  let setMode: Mock<(mode: Mode) => void>;
  let setLayer: Mock<(id: LayerId, visible: boolean) => void>;
  let selectMarker: Mock<(id: string | null) => void>;
  let applyMapPoint: Mock;
  let undoRoute: Mock;
  let clearRoute: Mock<() => void>;
  let saveRoute: Mock;
  let loadRoute: Mock;
  let addObservation: Mock;
  let importMission: Mock;
  let exportMission: Mock;
  let missionMock: Partial<MissionService>;

  beforeEach(() => {
    const dataStatus = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');
    const dataError = signal<string | null>(null);
    const image = signal<ImageManifest | null>(makeImage());
    const route = signal<Route>({ start: null, destination: null, waypoints: [] });
    const mode = signal<Mode>('inspect');
    const layers = signal<Readonly<Record<LayerId, boolean>>>({
      imagery: true,
      markers: true,
      grid: false,
      coverage: true,
    });
    const selectedMarkerId = signal<string | null>('synthetic-rec-1');
    const observations = signal<readonly Observation[]>([
      {
        id: 'obs-1',
        imageRef: 'synthetic-image-v1',
        createdAt: '2026-01-01T00:00:00.000Z',
        text: 'Synthetic note',
        position: null,
      },
    ]);
    const assessmentOverride = signal<Assessment | null>(null);
    const assessment = computed(() => assessmentOverride() ?? assessRoute(route(), image()));

    state = {
      dataStatus,
      dataError,
      image,
      route,
      mode,
      layers,
      selectedMarkerId,
      observations,
      assessmentOverride,
      assessment,
    };

    initialize = vi.fn(async () => undefined);
    setMode = vi.fn();
    setLayer = vi.fn();
    selectMarker = vi.fn();
    applyMapPoint = vi.fn();
    undoRoute = vi.fn();
    clearRoute = vi.fn();
    saveRoute = vi.fn(() => ({ ok: true }));
    loadRoute = vi.fn(() => ({ ok: true }));
    addObservation = vi.fn(() => ({ ok: true }));
    importMission = vi.fn(() => ({ ok: true }));
    exportMission = vi.fn();

    missionMock = {
      dataStatus: dataStatus.asReadonly(),
      dataError: dataError.asReadonly(),
      image: image.asReadonly(),
      route: route.asReadonly(),
      mode: mode.asReadonly(),
      layers: layers.asReadonly(),
      selectedMarkerId: selectedMarkerId.asReadonly(),
      observations: observations.asReadonly(),
      assessment,
      initialize,
      setMode,
      setLayer,
      selectMarker,
      applyMapPoint,
      undoRoute,
      clearRoute,
      saveRoute,
      loadRoute,
      addObservation,
      importMission,
      exportMission,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MissionService, useValue: missionMock }],
    });

    fixture = TestBed.createComponent(ExplorationConfidenceComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('always displays Visual review only, safety disclaimer, and offline/PWA boundary across data states', () => {
    const root = fixture.nativeElement as HTMLElement;

    state.dataStatus.set('loading');
    fixture.detectChanges();
    expect(root.textContent).toContain('Visual review only');
    expect(root.textContent).toContain('Missing hazard or terrain information does not establish');
    expect(root.textContent).toContain('offline cache completeness or PWA installation readiness');
    expect(root.querySelector('.confidence-state')?.getAttribute('role')).toBe('status');

    state.dataStatus.set('unavailable');
    state.dataError.set('Image data has not been supplied.');
    fixture.detectChanges();
    expect(root.querySelector('.confidence-state')?.getAttribute('role')).toBe('status');
    expect(root.textContent).toContain('Image data has not been supplied.');
    expect(root.textContent).toContain('Visual review only');

    state.dataStatus.set('error');
    state.dataError.set('Manifest failed validation.');
    fixture.detectChanges();
    const errorEl = root.querySelector('.confidence-state-error') as HTMLElement;
    expect(errorEl.getAttribute('role')).toBe('alert');
    expect(errorEl.textContent).toContain('Manifest failed validation.');

    state.dataStatus.set('ready');
    state.dataError.set('Science records could not be loaded.');
    state.image.set(null);
    fixture.detectChanges();
    const banner = root.querySelector('.confidence-banner-error') as HTMLElement;
    expect(banner.getAttribute('role')).toBe('alert');
    expect(banner.textContent).toContain('Science records could not be loaded.');
    expect(root.textContent).toContain('Missing image manifest');
  });

  it('reacts to route and assessment updates from incomplete to complete uncalibrated route', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Not set');
    expect(root.textContent).toContain('Incomplete endpoints');
    expect(root.textContent).toContain('Metric distance unavailable');
    expect(root.textContent).toContain('Waypoints');
    expect(root.textContent).toContain('0');

    state.route.set({
      start: { x: 0, y: 0 },
      destination: null,
      waypoints: [{ x: 15, y: 25 }],
    });
    fixture.detectChanges();
    expect(root.textContent).toContain('Set (0, 0 px)');
    expect(root.textContent).toContain('Not set');
    expect(root.textContent).toContain('Incomplete endpoints');
    expect(root.textContent).toContain('1');

    state.route.set({
      start: { x: 10, y: 20 },
      destination: { x: 100, y: 200 },
      waypoints: [
        { x: 40, y: 50 },
        { x: 70, y: 80 },
      ],
    });
    fixture.detectChanges();
    expect(root.textContent).toContain('Set (10, 20 px)');
    expect(root.textContent).toContain('Set (100, 200 px)');
    expect(root.textContent).toContain('Complete endpoints');
    expect(root.textContent).toContain('2');
    expect(root.textContent).toContain('Metric distance unavailable');
  });

  it('accepts derived 0 m and positive calibrated planar distance while keeping terrain unavailable', () => {
    const root = fixture.nativeElement as HTMLElement;
    state.image.set(
      makeImage({
        calibration: {
          verified: true,
          metersPerPixel: 2,
          sourceUrl: 'https://example.test/calibration',
          method: 'Synthetic tie-point calibration',
        },
      }),
    );

    // Identical start and destination yields valid 0 m derived planar distance
    state.route.set({
      start: { x: 50, y: 60 },
      destination: { x: 50, y: 60 },
      waypoints: [],
    });
    fixture.detectChanges();
    expect(root.textContent).toContain('0 m');
    expect(root.textContent).toContain('Derived from verified image-plane metric calibration');
    expect(root.textContent).toContain('not terrain-following distance');
    expect(root.textContent).not.toContain('Metric distance unavailable');

    // Positive calibrated route (3-4-5 triangles: 5 + 5 px * 2 m/px = 20 m)
    state.route.set({
      start: { x: 0, y: 0 },
      waypoints: [{ x: 3, y: 4 }],
      destination: { x: 6, y: 8 },
    });
    fixture.detectChanges();
    expect(root.textContent).toContain('20 m');
    expect(root.textContent).toContain('(2 m/pixel)');
    expect(root.textContent).toContain(
      'Elevation, slope, and terrain-following distance are unavailable',
    );
    expect(root.textContent).toContain('display offsets and image brightness are not elevation');
  });

  it('handles null or nonfinite distance as unavailable even if status were mismatched', () => {
    const root = fixture.nativeElement as HTMLElement;
    state.assessmentOverride.set({
      planarDistanceMeters: null,
      distanceStatus: 'derived',
      terrainStatus: 'unavailable',
      warnings: [
        'No verified terrain model: elevation, slope and terrain distance are unavailable.',
      ],
    });
    fixture.detectChanges();
    expect(root.textContent).toContain('Metric distance unavailable');
  });

  it('distinguishes verified-aoi from regional-context and deduplicates identical warnings', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Regional context (regional-context)');
    expect(root.textContent).toContain('Exact exploration-area overlap is unverified');

    state.image.set(
      makeImage({
        coverageStatus: 'verified-aoi',
        limitations: [
          'Missing hazard information does not establish route safety.',
          'Custom image limitation.',
          'Custom image limitation.',
        ],
      }),
    );
    fixture.detectChanges();

    expect(root.textContent).toContain('Verified AOI (verified-aoi)');
    expect(root.textContent).toContain('Manifest records verified exploration-area overlap');

    const warningItems = Array.from(
      root.querySelectorAll('ul.confidence-warnings li') as NodeListOf<HTMLLIElement>,
    ).map((li) => li.textContent?.trim());

    expect(
      warningItems.filter(
        (w) => w === 'Missing hazard information does not establish route safety.',
      ),
    ).toHaveLength(1);
    expect(warningItems.filter((w) => w === 'Custom image limitation.')).toHaveLength(1);
    expect(warningItems).toContain('Custom image limitation.');
  });

  it('never outputs safety scores, percentages, or SAFE classification, and renders HTML-like text safely', () => {
    const xssPayload = '<script>alert("xss")</script><b>unsafe</b>';
    state.image.set(
      makeImage({
        coverageStatus: 'verified-aoi',
        limitations: [xssPayload],
        calibration: {
          verified: true,
          metersPerPixel: 1,
          sourceUrl: 'https://example.test/cal',
          method: 'Synthetic test',
        },
      }),
    );
    state.route.set({
      start: { x: 1, y: 1 },
      destination: { x: 4, y: 5 },
      waypoints: [],
    });
    state.dataError.set(`Banner_${xssPayload}`);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const text = root.textContent ?? '';
    expect(text).not.toContain('SAFE');
    expect(text).not.toMatch(/\d+\s*%/);
    expect(text).not.toMatch(/safety\s+score/i);

    expect(root.querySelectorAll('script')).toHaveLength(0);
    expect(root.querySelectorAll('b')).toHaveLength(0);
    expect(text).toContain(xssPayload);
    expect(text).toContain(`Banner_${xssPayload}`);
  });

  it('guides endpoint selection and recovery without rounding stored coordinates', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[aria-label="Next mission step"]')?.textContent).toContain(
      'Set your route endpoints',
    );
    const details = root.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    state.route.set({ start: { x: 1333.9385, y: 415.7699 }, destination: null, waypoints: [] });
    fixture.detectChanges();
    expect(root.textContent).toContain('Set (1334, 416 px)');
    expect(root.querySelector('[aria-label="Next mission step"]')?.textContent).toContain(
      'Set Destination',
    );
    expect(state.route().start).toEqual({ x: 1333.9385, y: 415.7699 });
    state.route.set({ ...state.route(), destination: { x: 138.1754, y: 105.5831 } });
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Next mission step"]')?.textContent).toContain(
      'Route drawn — measurements unavailable',
    );
    expect(root.querySelector('[aria-label="Next mission step"]')?.textContent).toContain(
      'Load Route',
    );
    details.open = true;
    details.dispatchEvent(new Event('toggle'));
    expect(root.querySelectorAll('.confidence-warnings li').length).toBeGreaterThan(0);
    expect(state.route().destination).toEqual({ x: 138.1754, y: 105.5831 });
  });

  it('remains strictly readonly without calling initialize, mutators, or localStorage', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const initialRoute = structuredClone(state.route());
    const initialMode = state.mode();
    const initialLayers = structuredClone(state.layers());
    const initialSelected = state.selectedMarkerId();
    const initialObservations = structuredClone(state.observations());
    const initialImage = structuredClone(state.image());

    state.route.set({ start: { x: 5, y: 5 }, destination: { x: 8, y: 9 }, waypoints: [] });
    fixture.detectChanges();

    expect(initialize).not.toHaveBeenCalled();
    expect(setMode).not.toHaveBeenCalled();
    expect(setLayer).not.toHaveBeenCalled();
    expect(selectMarker).not.toHaveBeenCalled();
    expect(applyMapPoint).not.toHaveBeenCalled();
    expect(undoRoute).not.toHaveBeenCalled();
    expect(clearRoute).not.toHaveBeenCalled();
    expect(saveRoute).not.toHaveBeenCalled();
    expect(loadRoute).not.toHaveBeenCalled();
    expect(addObservation).not.toHaveBeenCalled();
    expect(importMission).not.toHaveBeenCalled();
    expect(exportMission).not.toHaveBeenCalled();
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    expect(state.mode()).toBe(initialMode);
    expect(state.layers()).toEqual(initialLayers);
    expect(state.selectedMarkerId()).toBe(initialSelected);
    expect(state.observations()).toEqual(initialObservations);
    expect(state.image()).toEqual(initialImage);
    expect(initialRoute.start).toBeNull();
  });
});
