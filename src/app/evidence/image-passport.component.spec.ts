import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type {
  ImageManifest,
  LayerId,
  Mode,
  Observation,
  Route,
  ScienceMarker,
} from '../core/models';
import { ImagePassportComponent } from './image-passport.component';

const makeImage = (overrides: Partial<ImageManifest> = {}): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'synthetic-boxwork-2048x1042-v1',
  assetPath: 'data/imagery/synthetic.jpg',
  width: 2048,
  height: 1042,
  coordinateSystem: 'image-pixels-bottom-left',
  source: {
    title: 'Synthetic Orbital Context Release',
    url: 'https://example.test/catalog/synthetic',
    credit: 'Synthetic Space Lab',
  },
  observationDate: '2024-05-12',
  coverageStatus: 'regional-context',
  limitations: ['Synthetic regional limitation one.', 'Synthetic elevation limitation two.'],
  calibration: {
    verified: false,
    metersPerPixel: null,
    sourceUrl: null,
    method: null,
  },
  ...overrides,
});

describe('ImagePassportComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ImagePassportComponent>>;
  let state: {
    image: ReturnType<typeof signal<ImageManifest | null>>;
    dataStatus: ReturnType<typeof signal<'loading' | 'ready' | 'unavailable' | 'error'>>;
    dataError: ReturnType<typeof signal<string | null>>;
    route: ReturnType<typeof signal<Route>>;
    mode: ReturnType<typeof signal<Mode>>;
    layers: ReturnType<typeof signal<Readonly<Record<LayerId, boolean>>>>;
    selectedMarkerId: ReturnType<typeof signal<string | null>>;
    observations: ReturnType<typeof signal<readonly Observation[]>>;
    markers: ReturnType<typeof signal<readonly ScienceMarker[]>>;
  };
  let initialize: Mock<() => Promise<void>>;
  let setMode: Mock;
  let setLayer: Mock;
  let selectMarker: Mock;
  let applyMapPoint: Mock;
  let undoRoute: Mock;
  let clearRoute: Mock;
  let saveRoute: Mock;
  let loadRoute: Mock;
  let addObservation: Mock;
  let importMission: Mock;
  let exportMission: Mock;
  let missionMock: Partial<MissionService>;

  beforeEach(() => {
    const image = signal<ImageManifest | null>(makeImage());
    const dataStatus = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');
    const dataError = signal<string | null>(null);
    const route = signal<Route>({ start: { x: 1, y: 2 }, destination: null, waypoints: [] });
    const mode = signal<Mode>('inspect');
    const layers = signal<Readonly<Record<LayerId, boolean>>>({
      imagery: true,
      markers: true,
      grid: false,
      coverage: true,
    });
    const selectedMarkerId = signal<string | null>(null);
    const observations = signal<readonly Observation[]>([]);
    const markers = signal<readonly ScienceMarker[]>([]);

    state = {
      image,
      dataStatus,
      dataError,
      route,
      mode,
      layers,
      selectedMarkerId,
      observations,
      markers,
    };

    initialize = vi.fn(async () => undefined);
    setMode = vi.fn();
    setLayer = vi.fn();
    selectMarker = vi.fn();
    applyMapPoint = vi.fn();
    undoRoute = vi.fn();
    clearRoute = vi.fn();
    saveRoute = vi.fn();
    loadRoute = vi.fn();
    addObservation = vi.fn();
    importMission = vi.fn();
    exportMission = vi.fn();

    missionMock = {
      image: image.asReadonly(),
      dataStatus: dataStatus.asReadonly(),
      dataError: dataError.asReadonly(),
      route: route.asReadonly(),
      mode: mode.asReadonly(),
      layers: layers.asReadonly(),
      selectedMarkerId: selectedMarkerId.asReadonly(),
      observations: observations.asReadonly(),
      markers: markers.asReadonly(),
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

    fixture = TestBed.createComponent(ImagePassportComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all actual ImageManifest fields, Pixel dimensions wording, terrain boundary, and limitations', () => {
    const root = fixture.nativeElement as HTMLElement;
    const text = root.textContent ?? '';

    expect(text).toContain('Manifest metadata provenance only');
    expect(text).toContain('does not prove map raster display');
    expect(text).toContain('offline cache completeness, or PWA installation readiness');

    const link = root.querySelector('a.external-link') as HTMLAnchorElement;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://example.test/catalog/synthetic');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent?.trim()).toBe('Synthetic Orbital Context Release');

    expect(text).toContain('Synthetic Space Lab');
    expect(text).toContain('External source pages require network connectivity.');
    expect(text).toContain('synthetic-boxwork-2048x1042-v1');
    expect(text).toContain('Pixel dimensions');
    expect(text).toContain('2048 × 1042 pixels');
    expect(text).toContain('do not establish metric scale or spatial resolution');
    expect(text).toContain('image-pixels-bottom-left');
    expect(text).toContain('Image pixels, bottom-left origin');
    expect(text).toContain('2024-05-12');
    expect(text).toContain('regional-context');
    expect(text).toContain('does not establish exact boxwork-AOI overlap, north-up orientation');
    expect(text).toContain('Unverified / unavailable');
    expect(text).toContain(
      'A verified terrain product is not supplied by the current image manifest contract',
    );
    expect(text).toContain('Never treat image brightness as surface elevation');

    const limitations = Array.from(
      root.querySelectorAll('ul.limitations-list li') as NodeListOf<HTMLLIElement>,
    ).map((li) => li.textContent?.trim());
    expect(limitations).toEqual([
      'Synthetic regional limitation one.',
      'Synthetic elevation limitation two.',
    ]);
  });

  it('handles loading, unavailable, error, ready+dataError, and image === null states', () => {
    const root = fixture.nativeElement as HTMLElement;

    state.dataStatus.set('loading');
    fixture.detectChanges();
    expect(root.querySelector('.passport-state')?.getAttribute('role')).toBe('status');
    expect(root.querySelector('article.passport-card')).toBeNull();

    state.dataStatus.set('unavailable');
    state.dataError.set('Image data has not been supplied.');
    fixture.detectChanges();
    expect(root.querySelector('.passport-state')?.getAttribute('role')).toBe('status');
    expect(root.textContent).toContain('Image data has not been supplied.');

    state.dataStatus.set('error');
    state.dataError.set('Invalid image manifest.');
    fixture.detectChanges();
    const errorEl = root.querySelector('.passport-state-error') as HTMLElement;
    expect(errorEl.getAttribute('role')).toBe('alert');
    expect(errorEl.textContent).toContain('Invalid image manifest.');

    state.dataStatus.set('ready');
    state.dataError.set('Science records warning.');
    state.image.set(null);
    fixture.detectChanges();
    expect(root.querySelector('.passport-banner-error')?.getAttribute('role')).toBe('alert');
    expect(root.querySelector('.passport-empty')?.getAttribute('role')).toBe('status');
    expect(root.textContent).toContain('No verified image manifest is currently loaded.');
  });

  it('renders null observationDate as Unavailable, empty limitations fallback, and verified-aoi coverage', () => {
    state.image.set(
      makeImage({
        observationDate: null,
        coverageStatus: 'verified-aoi',
        limitations: [],
      }),
    );
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const rows = Array.from(root.querySelectorAll('.metadata-row') as NodeListOf<HTMLElement>);
    const dateRow = rows.find(
      (r) => r.querySelector('dt')?.textContent?.trim() === 'Observation date',
    );
    expect(dateRow?.querySelector('dd')?.textContent?.trim()).toBe('Unavailable');

    expect(root.textContent).toContain('Verified AOI (verified-aoi)');
    expect(root.textContent).toContain('No limitations recorded.');
    expect(root.querySelector('ul.limitations-list')).toBeNull();
  });

  it('renders verified calibration details and falls back safely for null method or unsafe calibration URL', () => {
    state.image.set(
      makeImage({
        calibration: {
          verified: true,
          metersPerPixel: 0.25,
          method: 'Synthetic ground control tie',
          sourceUrl: 'https://example.test/calibration-report',
        },
      }),
    );
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('0.25 m/pixel');
    expect(root.textContent).toContain('Method: Synthetic ground control tie');
    const links = Array.from(root.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
    const calLink = links.find(
      (a) => a.getAttribute('href') === 'https://example.test/calibration-report',
    );
    expect(calLink).toBeDefined();
    expect(calLink?.getAttribute('target')).toBe('_blank');
    expect(calLink?.getAttribute('rel')).toBe('noopener noreferrer');

    state.image.set(
      makeImage({
        calibration: {
          verified: true,
          metersPerPixel: 0.5,
          method: null,
          sourceUrl: 'http://insecure.example.test/calibration',
        },
      }),
    );
    fixture.detectChanges();

    expect(root.textContent).toContain('0.5 m/pixel');
    expect(root.textContent).toContain('Method: Unavailable');
    expect(root.textContent).toContain('http://insecure.example.test/calibration');
    const afterLinks = Array.from(root.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
    expect(afterLinks.some((a) => a.getAttribute('href')?.includes('insecure.example.test'))).toBe(
      false,
    );
  });

  it('renders unsafe source.url and HTML-like payloads safely as plain text without invented v2 or byte fields', () => {
    const xssPayload = '<script>alert("xss")</script><b>tag</b>';
    state.image.set(
      makeImage({
        imageRef: `Ref_${xssPayload}`,
        source: {
          title: `Title_${xssPayload}`,
          url: 'javascript:alert(1)',
          credit: `Credit_${xssPayload}`,
        },
        limitations: [`Limit_${xssPayload}`],
        calibration: {
          verified: true,
          metersPerPixel: 1,
          method: `Method_${xssPayload}`,
          sourceUrl: 'https://user:pass@example.test/secret',
        },
      }),
    );
    state.dataError.set(`Error_${xssPayload}`);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('script')).toHaveLength(0);
    expect(root.querySelectorAll('b')).toHaveLength(0);
    expect(root.querySelectorAll('a')).toHaveLength(0);

    const text = root.textContent ?? '';
    expect(text).toContain(`Ref_${xssPayload}`);
    expect(text).toContain(`Title_${xssPayload}`);
    expect(text).toContain(`Credit_${xssPayload}`);
    expect(text).toContain(`Limit_${xssPayload}`);
    expect(text).toContain(`Method_${xssPayload}`);
    expect(text).toContain(`Error_${xssPayload}`);

    // Verify no hardcoded byte totals, hashes, processing lineage, or proposed v2 fields
    expect(text).not.toContain('524,472');
    expect(text).not.toContain('524472');
    expect(text).not.toContain('523,272');
    expect(text).not.toContain('SHA-256');
    expect(text).not.toContain('packageBytes');
    expect(text).not.toContain('catalogIdentifiers');
    expect(text).not.toContain('footprintCenter');
    expect(text).not.toContain('nominalMasterResolution');
  });

  it('remains strictly readonly without calling initialize, mutators, or localStorage', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const initialRoute = structuredClone(state.route());
    const initialMode = state.mode();
    const initialLayers = structuredClone(state.layers());
    const initialSelected = state.selectedMarkerId();
    const initialObservations = structuredClone(state.observations());

    state.image.set(makeImage({ coverageStatus: 'verified-aoi' }));
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

    expect(state.route()).toEqual(initialRoute);
    expect(state.mode()).toBe(initialMode);
    expect(state.layers()).toEqual(initialLayers);
    expect(state.selectedMarkerId()).toBe(initialSelected);
    expect(state.observations()).toEqual(initialObservations);
  });
});
