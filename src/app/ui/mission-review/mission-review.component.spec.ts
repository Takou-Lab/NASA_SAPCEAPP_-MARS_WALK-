import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, beforeEach, it, vi } from 'vitest';
import { MissionService } from '../../core/mission.service';
import type {
  Assessment,
  ImageManifest,
  LayerId,
  Mode,
  Observation,
  Route,
  ScienceMarker,
} from '../../core/models';
import { MissionReviewComponent, type MissionWorkflowTab } from './mission-review.component';

const makeImage = (overrides: Partial<ImageManifest> = {}): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'hirise-mro-pia26306-boxwork-2048x1042-v1',
  assetPath: 'data/imagery/pia26306.jpg',
  width: 2048,
  height: 1042,
  coordinateSystem: 'image-pixels-bottom-left',
  source: {
    title: 'PIA26306: Boxwork on Mount Sharp',
    url: 'https://photojournal.jpl.nasa.gov/catalog/PIA26306',
    credit: 'NASA/JPL-Caltech/University of Arizona',
  },
  observationDate: '2006-12-10',
  coverageStatus: 'regional-context',
  limitations: ['No metric scale verified.'],
  calibration: {
    verified: false,
    metersPerPixel: null,
    sourceUrl: null,
    method: null,
  },
  ...overrides,
});

const makeMarker = (overrides: Partial<ScienceMarker> = {}): ScienceMarker => ({
  id: 'curiosity-mount-sharp-boxwork',
  name: 'Mount Sharp Boxwork Campaign',
  imageRef: 'hirise-mro-pia26306-boxwork-2048x1042-v1',
  position: null,
  positionStatus: 'unavailable',
  instrument: 'MAHLI / APXS / HiRISE',
  date: '2026-02-09',
  finding: 'Scientists interpret boxwork ridges as ancient groundwater-deposited minerals.',
  evidenceType: 'interpreted',
  source: {
    title: 'Curiosity Blog Sols 4804-4811',
    url: 'https://science.nasa.gov/blog/curiosity-blog-sols-4804-4811-kicking-off-the-final-phase-of-boxwork-exploration/',
    credit: 'NASA/JPL-Caltech',
  },
  limitations: ['Exact pixel tie-points are unavailable.'],
  ...overrides,
});

describe('MissionReviewComponent', () => {
  let fixture: ComponentFixture<MissionReviewComponent>;
  let component: MissionReviewComponent;

  let imageSig = signal<ImageManifest | null>(makeImage());
  let markersSig = signal<readonly ScienceMarker[]>([makeMarker()]);
  let routeSig = signal<Route>({ start: null, destination: null, waypoints: [] });
  let modeSig = signal<Mode>('inspect');
  let layersSig = signal<Readonly<Record<LayerId, boolean>>>({
    imagery: true,
    markers: true,
    grid: false,
    coverage: true,
  });
  let selectedMarkerIdSig = signal<string | null>(null);
  let observationsSig = signal<readonly Observation[]>([]);
  let assessmentSig = signal<Assessment>({
    planarDistanceMeters: null,
    distanceStatus: 'unavailable',
    terrainStatus: 'unavailable',
    warnings: ['Planar distance unavailable.'],
  });
  let dataStatusSig = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');

  let mockMission: Record<string, unknown>;

  beforeEach(async () => {
    imageSig = signal<ImageManifest | null>(makeImage());
    markersSig = signal<readonly ScienceMarker[]>([
      makeMarker(),
      makeMarker({
        id: 'verified-marker',
        name: 'Verified Outcrop',
        position: { x: 100, y: 200 },
        positionStatus: 'verified',
      }),
      makeMarker({
        id: 'illustrative-marker',
        name: 'Illustrative Contact',
        position: { x: 300, y: 400 },
        positionStatus: 'illustrative',
      }),
    ]);
    routeSig = signal<Route>({ start: null, destination: null, waypoints: [] });
    modeSig = signal<Mode>('inspect');
    selectedMarkerIdSig = signal<string | null>(null);
    observationsSig = signal<readonly Observation[]>([]);
    assessmentSig = signal<Assessment>({
      planarDistanceMeters: null,
      distanceStatus: 'unavailable',
      terrainStatus: 'unavailable',
      warnings: ['Planar distance unavailable.'],
    });
    dataStatusSig = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');

    mockMission = {
      image: imageSig.asReadonly(),
      markers: markersSig.asReadonly(),
      route: routeSig.asReadonly(),
      mode: modeSig.asReadonly(),
      layers: layersSig.asReadonly(),
      selectedMarkerId: selectedMarkerIdSig.asReadonly(),
      observations: observationsSig.asReadonly(),
      assessment: assessmentSig.asReadonly(),
      dataStatus: dataStatusSig.asReadonly(),
      setMode: vi.fn(),
      setLayer: vi.fn(),
      selectMarker: vi.fn(),
      applyMapPoint: vi.fn(),
      undoRoute: vi.fn(),
      clearRoute: vi.fn(),
      saveRoute: vi.fn(),
      loadRoute: vi.fn(),
      addObservation: vi.fn(),
      exportMission: vi.fn(),
      importMission: vi.fn(),
      initialize: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MissionReviewComponent],
      providers: [{ provide: MissionService, useValue: mockMission }],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('tracks missing, partial, and complete route endpoints plus waypoint count without claiming safety', () => {
    expect(component.endpointStatusLabel()).toBe('Missing Start & Destination');
    expect(component.waypointCount()).toBe(0);

    routeSig.set({ start: { x: 10, y: 20 }, destination: null, waypoints: [{ x: 15, y: 25 }] });
    fixture.detectChanges();
    expect(component.endpointStatusLabel()).toBe('Start set · Destination missing');
    expect(component.waypointCount()).toBe(1);

    routeSig.set({ start: null, destination: { x: 80, y: 90 }, waypoints: [] });
    fixture.detectChanges();
    expect(component.endpointStatusLabel()).toBe('Destination set · Start missing');

    routeSig.set({
      start: { x: 10, y: 20 },
      destination: { x: 80, y: 90 },
      waypoints: [
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ],
    });
    fixture.detectChanges();
    expect(component.endpointStatusLabel()).toBe('Start & Destination set');
    expect(component.waypointCount()).toBe(2);
    expect(fixture.nativeElement.textContent).not.toMatch(/mission complete|safe route/i);
  });

  it('distinguishes unavailable planar distance from derived zero and positive planar distance while keeping terrain unavailable', () => {
    expect(component.distanceSummary()).toContain('Planar distance: unavailable');
    expect(component.distanceSummary()).toContain('Terrain/slope: unavailable');

    imageSig.set(
      makeImage({
        calibration: {
          verified: true,
          metersPerPixel: 0.25,
          sourceUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA26306',
          method: 'PDS label scale',
        },
      }),
    );
    assessmentSig.set({
      planarDistanceMeters: 0,
      distanceStatus: 'derived',
      terrainStatus: 'unavailable',
      warnings: [],
    });
    fixture.detectChanges();
    expect(component.distanceSummary()).toContain('Derived planar: 0.0 m');
    expect(component.distanceSummary()).toContain('0.25 m/px');
    expect(component.distanceSummary()).toContain('Terrain/slope: unavailable');

    assessmentSig.set({
      planarDistanceMeters: 142.4,
      distanceStatus: 'derived',
      terrainStatus: 'unavailable',
      warnings: [],
    });
    fixture.detectChanges();
    expect(component.distanceSummary()).toContain('Derived planar: 142.4 m');
  });

  it('distinguishes verified, illustrative, and unlocated regional science records and resets when removed', () => {
    expect(component.selectedScienceLabel()).toBe('None selected');

    selectedMarkerIdSig.set('curiosity-mount-sharp-boxwork');
    fixture.detectChanges();
    expect(component.selectedScienceLabel()).toContain(
      'Mount Sharp Boxwork Campaign (Regional contextual record — not located on this image)',
    );

    selectedMarkerIdSig.set('illustrative-marker');
    fixture.detectChanges();
    expect(component.selectedScienceLabel()).toContain(
      'Illustrative Contact (Illustrative pin — not exact tie-point)',
    );

    selectedMarkerIdSig.set('verified-marker');
    fixture.detectChanges();
    expect(component.selectedScienceLabel()).toContain('Verified Outcrop (Verified image position)');

    // Remove the selected record from markers()
    markersSig.set([makeMarker()]);
    fixture.detectChanges();
    expect(component.selectedRecord()).toBeNull();
    expect(component.selectedScienceLabel()).toBe('None selected');
  });

  it('reports session/imported observation count honestly without implying saved or verified status', () => {
    expect(component.observationLabel()).toBe('0 in session');

    observationsSig.set([
      {
        id: 'obs-1',
        imageRef: 'hirise-mro-pia26306-boxwork-2048x1042-v1',
        createdAt: '2026-11-15T12:00:00Z',
        text: 'Imported note',
        position: null,
      },
    ]);
    fixture.detectChanges();
    expect(component.observationLabel()).toContain('1 in session (current/imported state');
  });

  it('emits typed navigation requests for all four workflow steps with zero mission or storage mutations', () => {
    const emitted: MissionWorkflowTab[] = [];
    component.navigateTab.subscribe((t) => emitted.push(t));

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    const buttons = fixture.nativeElement.querySelectorAll(
      '.workflow-btn',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(4);

    buttons.forEach((btn) => btn.click());
    expect(emitted).toEqual(['confidence', 'planner', 'notebook', 'transfer']);

    expect(mockMission['setMode']).not.toHaveBeenCalled();
    expect(mockMission['setLayer']).not.toHaveBeenCalled();
    expect(mockMission['selectMarker']).not.toHaveBeenCalled();
    expect(mockMission['applyMapPoint']).not.toHaveBeenCalled();
    expect(mockMission['saveRoute']).not.toHaveBeenCalled();
    expect(mockMission['clearRoute']).not.toHaveBeenCalled();
    expect(mockMission['exportMission']).not.toHaveBeenCalled();
    expect(mockMission['initialize']).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});
