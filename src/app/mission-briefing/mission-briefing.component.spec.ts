import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type { ImageManifest, Observation, Route, ScienceMarker } from '../core/models';
import { MissionBriefingComponent } from './mission-briefing.component';

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

describe('MissionBriefingComponent', () => {
  let fixture: ComponentFixture<MissionBriefingComponent>;
  let component: MissionBriefingComponent;

  let imageSig = signal<ImageManifest | null>(makeImage());
  let markersSig = signal<readonly ScienceMarker[]>([makeMarker()]);
  let routeSig = signal<Route>({ start: null, destination: null, waypoints: [] });
  let selectedMarkerIdSig = signal<string | null>(null);
  let observationsSig = signal<readonly Observation[]>([]);
  let dataStatusSig = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');
  let dataErrorSig = signal<string | null>(null);

  let mockMission: Record<string, unknown>;

  beforeEach(async () => {
    imageSig = signal<ImageManifest | null>(makeImage());
    markersSig = signal<readonly ScienceMarker[]>([
      makeMarker(),
      makeMarker({
        id: 'curiosity-vera-rubin-ridge-hematite',
        name: 'Vera Rubin Ridge Hematite Context',
        evidenceType: 'derived',
      }),
    ]);
    routeSig = signal<Route>({ start: null, destination: null, waypoints: [] });
    selectedMarkerIdSig = signal<string | null>(null);
    observationsSig = signal<readonly Observation[]>([]);
    dataStatusSig = signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready');
    dataErrorSig = signal<string | null>(null);

    mockMission = {
      image: imageSig.asReadonly(),
      markers: markersSig.asReadonly(),
      route: routeSig.asReadonly(),
      selectedMarkerId: selectedMarkerIdSig.asReadonly(),
      observations: observationsSig.asReadonly(),
      dataStatus: dataStatusSig.asReadonly(),
      dataError: dataErrorSig.asReadonly(),
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
    };

    await TestBed.configureTestingModule({
      imports: [MissionBriefingComponent],
      providers: [{ provide: MissionService, useValue: mockMission }],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionBriefingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the boxwork mission question, MRO/Curiosity sources, and explicit spatial limits', () => {
    const text = fixture.nativeElement.textContent ?? '';
    expect(text).toContain(
      "What evidence supports the interpretation that ancient groundwater helped form Mount Sharp's boxwork?",
    );
    expect(text).toContain('PIA26306: Boxwork on Mount Sharp');
    expect(text).toContain('curiosity-mount-sharp-boxwork');
    expect(text).toContain('Vera Rubin Ridge');
    expect(text).toContain('No verified metric scale');
  });

  it('tracks route transitions truthfully only when both start and destination exist', () => {
    expect(component.checklist().startAndDestination).toBe(false);

    routeSig.set({ start: { x: 100, y: 120 }, destination: null, waypoints: [] });
    fixture.detectChanges();
    expect(component.checklist().startAndDestination).toBe(false);

    routeSig.set({
      start: { x: 100, y: 120 },
      destination: { x: 400, y: 500 },
      waypoints: [{ x: 250, y: 300 }],
    });
    fixture.detectChanges();
    expect(component.checklist().startAndDestination).toBe(true);
  });

  it('reflects record selection and resets if the selected record is removed from markers()', () => {
    expect(component.checklist().markerSelected).toBe(false);

    selectedMarkerIdSig.set('curiosity-mount-sharp-boxwork');
    fixture.detectChanges();
    expect(component.checklist().markerSelected).toBe(true);

    markersSig.set([makeMarker({ id: 'other-record' })]);
    fixture.detectChanges();
    expect(component.checklist().markerSelected).toBe(false);
  });

  it('reports observation presence without claiming scientific verification or completion', () => {
    expect(component.checklist().observationPresent).toBe(false);

    observationsSig.set([
      {
        id: 'obs-1',
        imageRef: 'hirise-mro-pia26306-boxwork-2048x1042-v1',
        createdAt: '2026-11-15T12:00:00.000Z',
        text: 'Imported or existing observation note',
        position: null,
      },
    ]);
    fixture.detectChanges();
    expect(component.checklist().observationPresent).toBe(true);
    const text = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('may include preexisting or imported notes');
    expect(text).toContain('do not confirm that a mission has been saved');
  });

  it('explains loading, error, missing-image, and empty-record states without inventing readiness', () => {
    dataStatusSig.set('loading');
    imageSig.set(null);
    markersSig.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading mission imagery metadata');
    expect(fixture.nativeElement.textContent).toContain('No active MRO/HiRISE image source');
    expect(fixture.nativeElement.textContent).toContain('No contextual science records');

    dataStatusSig.set('error');
    dataErrorSig.set('Manifest HTTP 500');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Manifest HTTP 500');
  });

  it('permits only safe HTTPS source links and performs zero mission or storage mutations', () => {
    imageSig.set(
      makeImage({
        source: {
          title: 'Unsafe Link',
          url: 'javascript:alert(1)',
          credit: 'Test',
        },
      }),
    );
    fixture.detectChanges();
    expect(component.imageInfo()?.safeUrl).toBeNull();
    const anchors = fixture.nativeElement.querySelectorAll('a');
    for (const a of Array.from(anchors) as HTMLAnchorElement[]) {
      expect(a.getAttribute('href')?.startsWith('https://')).toBe(true);
    }

    expect(mockMission['setMode']).not.toHaveBeenCalled();
    expect(mockMission['selectMarker']).not.toHaveBeenCalled();
    expect(mockMission['saveRoute']).not.toHaveBeenCalled();
    expect(mockMission['addObservation']).not.toHaveBeenCalled();
  });
});
