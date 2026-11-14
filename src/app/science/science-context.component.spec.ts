import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type Mock, vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type { ImageManifest, Mode, Observation, Route, ScienceMarker } from '../core/models';
import { ScienceContextComponent } from './science-context.component';

const imageFixture = (): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'synthetic-image-v1',
  assetPath: 'data/imagery/synthetic.jpg',
  width: 2048,
  height: 1042,
  coordinateSystem: 'image-pixels-bottom-left',
  source: {
    title: 'Synthetic context mosaic',
    url: 'https://example.test/mosaic',
    credit: 'Synthetic Test Credit',
  },
  observationDate: null,
  coverageStatus: 'regional-context',
  limitations: ['Synthetic test fixture only.'],
  calibration: { verified: false, metersPerPixel: null, sourceUrl: null, method: null },
});

const makeRecord = (overrides: Partial<ScienceMarker> = {}): ScienceMarker => ({
  id: 'synthetic-rec-1',
  name: 'Synthetic Mineral Ridge',
  imageRef: 'synthetic-image-v1',
  position: null,
  positionStatus: 'unavailable',
  instrument: 'ChemCam',
  date: '2025-01-15',
  finding: 'Synthetic contextual finding describing mineral fractures.',
  evidenceType: 'measured',
  source: {
    title: 'Synthetic Science Note',
    url: 'https://example.test/science/rec-1',
    credit: 'Synthetic Science Team',
  },
  limitations: ['Contextual regional record without local pixel coordinates.'],
  ...overrides,
});

const threeUnlocatedRecords = (): ScienceMarker[] => [
  makeRecord({
    id: 'synthetic-rec-1',
    name: 'Synthetic Sulfate Zone',
    evidenceType: 'measured',
    instrument: 'APXS',
    date: '2024-06-01',
    finding: 'Synthetic elevated sulfate signature detected across fracture fill.',
    source: {
      title: 'Synthetic APXS Report',
      url: 'https://example.test/apxs',
      credit: 'Synthetic Lab A',
    },
    limitations: ['Point measurement outside high-res AOI.', 'No DEM elevation tie.'],
  }),
  makeRecord({
    id: 'synthetic-rec-2',
    name: 'Synthetic Boxwork Fracture Pattern',
    evidenceType: 'interpreted',
    instrument: 'HiRISE',
    date: '2023-11-20',
    finding: 'Synthetic polygonal ridge network interpreted as mineral-filled fractures.',
    source: {
      title: 'Synthetic Orbital Survey',
      url: 'https://example.test/orbital',
      credit: 'Synthetic Lab B',
    },
    limitations: ['Orbital resolution limits small-scale obstacle inference.'],
  }),
  makeRecord({
    id: 'synthetic-rec-3',
    name: 'Synthetic Clay Transition',
    evidenceType: 'derived',
    instrument: 'CRISM',
    date: '2022-08-10',
    finding: 'Synthetic spectral trend consistent with hydrated clay-bearing strata.',
    source: {
      title: 'Synthetic Spectral Summary',
      url: 'https://example.test/spectral',
      credit: 'Synthetic Lab C',
    },
    limitations: ['Derived regional average.'],
  }),
];

describe('ScienceContextComponent', () => {
  let component: ScienceContextComponent;
  let fixture: ReturnType<typeof TestBed.createComponent<ScienceContextComponent>>;
  let state: {
    image: ReturnType<typeof signal<ImageManifest | null>>;
    markers: ReturnType<typeof signal<readonly ScienceMarker[]>>;
    selectedMarkerId: ReturnType<typeof signal<string | null>>;
    dataStatus: ReturnType<typeof signal<'loading' | 'ready' | 'unavailable' | 'error'>>;
    dataError: ReturnType<typeof signal<string | null>>;
    route: ReturnType<typeof signal<Route>>;
    mode: ReturnType<typeof signal<Mode>>;
    observations: ReturnType<typeof signal<readonly Observation[]>>;
  };
  let selectMarker: Mock<(id: string | null) => void>;
  let initialize: Mock<() => Promise<void>>;
  let missionMock: Partial<MissionService>;

  beforeEach(() => {
    state = {
      image: signal<ImageManifest | null>(imageFixture()),
      markers: signal<readonly ScienceMarker[]>(threeUnlocatedRecords()),
      selectedMarkerId: signal<string | null>(null),
      dataStatus: signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready'),
      dataError: signal<string | null>(null),
      route: signal<Route>({
        start: { x: 10, y: 20 },
        destination: { x: 200, y: 300 },
        waypoints: [{ x: 100, y: 150 }],
      }),
      mode: signal<Mode>('waypoint'),
      observations: signal<readonly Observation[]>([
        {
          id: 'obs-1',
          imageRef: 'synthetic-image-v1',
          createdAt: '2026-01-01T00:00:00.000Z',
          text: 'Synthetic field note.',
          position: null,
        },
      ]),
    };

    selectMarker = vi.fn<(id: string | null) => void>((id) => state.selectedMarkerId.set(id));
    initialize = vi.fn<() => Promise<void>>(async () => undefined);

    missionMock = {
      image: state.image.asReadonly(),
      markers: state.markers.asReadonly(),
      selectedMarkerId: state.selectedMarkerId.asReadonly(),
      dataStatus: state.dataStatus.asReadonly(),
      dataError: state.dataError.asReadonly(),
      route: state.route.asReadonly(),
      mode: state.mode.asReadonly(),
      observations: state.observations.asReadonly(),
      selectMarker,
      initialize,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MissionService, useValue: missionMock }],
    });

    fixture = TestBed.createComponent(ScienceContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders three unlocated records as selectable native buttons with aria-pressed="false"', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'ul.science-record-list button.science-record-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons).toHaveLength(3);
    expect(initialize).not.toHaveBeenCalled();

    buttons.forEach((button) => {
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('aria-pressed')).toBe('false');
      expect(button.textContent).toContain('Contextual (unlocated)');
    });

    expect(buttons[0].textContent).toContain('Synthetic Sulfate Zone');
    expect(buttons[0].textContent).toContain('measured');
    expect(buttons[1].textContent).toContain('Synthetic Boxwork Fracture Pattern');
    expect(buttons[1].textContent).toContain('interpreted');
    expect(buttons[2].textContent).toContain('Synthetic Clay Transition');
    expect(buttons[2].textContent).toContain('derived');
  });

  it('selects a record, displays complete details and limitations, and clears selection', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button.science-record-button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[0].click();
    fixture.detectChanges();

    expect(selectMarker).toHaveBeenCalledWith('synthetic-rec-1');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].classList.contains('selected')).toBe(true);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

    const details = fixture.nativeElement.querySelector(
      'article.science-record-details',
    ) as HTMLElement;
    expect(details).not.toBeNull();
    expect(details.getAttribute('aria-live')).toBe('polite');
    expect(details.textContent).toContain('Synthetic Sulfate Zone');
    expect(details.textContent).toContain(
      'Synthetic elevated sulfate signature detected across fracture fill.',
    );
    expect(details.textContent).toContain('measured');
    expect(details.textContent).toContain('APXS');
    expect(details.textContent).toContain('2024-06-01');
    expect(details.textContent).toContain(
      'Unavailable on this image (contextual record — no map pin)',
    );
    expect(details.textContent).toContain('Synthetic Lab A');
    expect(details.textContent).toContain('External source link requires network connectivity.');
    expect(details.textContent).toContain('Point measurement outside high-res AOI.');
    expect(details.textContent).toContain('No DEM elevation tie.');

    const link = details.querySelector('a') as HTMLAnchorElement;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://example.test/apxs');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent?.trim()).toBe('Synthetic APXS Report');

    const clearBtn = details.querySelector('button.clear-selection-button') as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();
    expect(clearBtn.getAttribute('type')).toBe('button');

    clearBtn.click();
    fixture.detectChanges();

    expect(selectMarker).toHaveBeenLastCalledWith(null);
    expect(fixture.nativeElement.querySelector('article.science-record-details')).toBeNull();

    const noSelection = fixture.nativeElement.querySelector(
      'p.science-no-selection',
    ) as HTMLElement;
    expect(noSelection).not.toBeNull();
    expect(noSelection.getAttribute('role')).toBe('status');
    expect(noSelection.textContent).toContain(
      'Select a science record to view its finding, source, instrument attribution, and limitations.',
    );
  });

  it('leaves route(), mode(), observations(), and image() untouched when selecting and clearing', () => {
    const initialRoute = structuredClone(missionMock.route!());
    const initialMode = missionMock.mode!();
    const initialObservations = structuredClone(missionMock.observations!());
    const initialImageRef = missionMock.image!()?.imageRef;

    const buttons = fixture.nativeElement.querySelectorAll(
      'button.science-record-button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector(
      'button.clear-selection-button',
    ) as HTMLButtonElement;
    clearBtn.click();
    fixture.detectChanges();

    expect(missionMock.route!()).toEqual(initialRoute);
    expect(missionMock.mode!()).toBe(initialMode);
    expect(missionMock.observations!()).toEqual(initialObservations);
    expect(missionMock.image!()?.imageRef).toBe(initialImageRef);
  });

  it('displays "Unavailable" when instrument and date are null', () => {
    state.markers.set([
      makeRecord({
        id: 'synthetic-nulls',
        instrument: null,
        date: null,
      }),
    ]);
    state.selectedMarkerId.set('synthetic-nulls');
    fixture.detectChanges();

    const rows = Array.from(
      fixture.nativeElement.querySelectorAll('.metadata-row') as NodeListOf<HTMLElement>,
    );
    const instrumentRow = rows.find(
      (r) => r.querySelector('dt')?.textContent?.trim() === 'Instrument',
    );
    const dateRow = rows.find(
      (r) => r.querySelector('dt')?.textContent?.trim() === 'Observation date',
    );

    expect(instrumentRow?.querySelector('dd')?.textContent?.trim()).toBe('Unavailable');
    expect(dateRow?.querySelector('dd')?.textContent?.trim()).toBe('Unavailable');
  });

  it('renders safely across loading, unavailable, error, ready+dataError, empty list, and removed selected ID states', () => {
    state.dataStatus.set('loading');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.science-state')?.getAttribute('role')).toBe(
      'status',
    );
    expect(fixture.nativeElement.querySelector('ul.science-record-list')).toBeNull();

    state.dataStatus.set('unavailable');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.science-state')?.textContent).toContain(
      'unavailable',
    );

    state.dataStatus.set('error');
    state.dataError.set('Synthetic manifest validation failure.');
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('.science-state-error') as HTMLElement;
    expect(errorEl.getAttribute('role')).toBe('alert');
    expect(errorEl.textContent).toContain('Synthetic manifest validation failure.');

    state.dataStatus.set('ready');
    state.dataError.set('Synthetic science records warning.');
    state.markers.set([]);
    fixture.detectChanges();
    const readyBanner = fixture.nativeElement.querySelector('.science-banner-error') as HTMLElement;
    expect(readyBanner.getAttribute('role')).toBe('alert');
    expect(readyBanner.textContent).toContain('Synthetic science records warning.');
    expect(fixture.nativeElement.querySelector('.science-empty')?.getAttribute('role')).toBe(
      'status',
    );

    state.dataError.set(null);
    state.markers.set(threeUnlocatedRecords());
    state.selectedMarkerId.set('non-existent-id');
    fixture.detectChanges();
    expect(component.selectedRecord()).toBeNull();
    expect(fixture.nativeElement.querySelector('article.science-record-details')).toBeNull();
    expect(fixture.nativeElement.querySelector('p.science-no-selection')?.textContent).toContain(
      'Select a science record to view its finding',
    );
  });

  it('renders long strings and HTML-like payloads as literal plain text without injected elements, and verifies button attributes', () => {
    const xssPayload = '<script>alert("xss")</script><b>tag</b>';
    const longText = `LongUnbreakableTitle_${'A'.repeat(160)}_${xssPayload}`;

    state.markers.set([
      makeRecord({
        id: 'xss-rec',
        name: longText,
        finding: `Finding_${'B'.repeat(180)}_${xssPayload}`,
        limitations: [`Limitation_${xssPayload}`],
        source: {
          title: `Source_${xssPayload}`,
          url: 'javascript:alert("xss")',
          credit: `Credit_${xssPayload}`,
        },
      }),
    ]);
    state.selectedMarkerId.set('xss-rec');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('script')).toHaveLength(0);
    expect(root.querySelectorAll('b')).toHaveLength(0);
    expect(root.querySelector('a')).toBeNull();

    expect(root.textContent).toContain(longText);
    expect(root.textContent).toContain(`Finding_${'B'.repeat(180)}_${xssPayload}`);
    expect(root.textContent).toContain(`Limitation_${xssPayload}`);
    expect(root.textContent).toContain(`Source_${xssPayload}`);
    expect(root.textContent).toContain(`Credit_${xssPayload}`);

    const allButtons = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[];
    expect(allButtons.length).toBeGreaterThan(0);
    allButtons.forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button');
    });

    const recordButtons = Array.from(
      root.querySelectorAll('button.science-record-button'),
    ) as HTMLButtonElement[];
    recordButtons.forEach((btn) => {
      expect(btn.hasAttribute('aria-pressed')).toBe(true);
    });
  });

  it('formats illustrative, verified, and fallback position statuses and filters non-https URLs', () => {
    const illustrative = makeRecord({
      positionStatus: 'illustrative',
      position: { x: 120, y: 340 },
    });
    const verified = makeRecord({
      positionStatus: 'verified',
      position: { x: 45, y: 90 },
    });
    const unavailable = makeRecord({
      positionStatus: 'unavailable',
      position: null,
    });
    const unknownStatus = {
      ...makeRecord({ position: { x: 1, y: 2 } }),
      positionStatus: 'unknown' as unknown as ScienceMarker['positionStatus'],
    };

    expect(component.formatPositionStatus(illustrative)).toBe('Illustrative (120, 340 px)');
    expect(component.formatPositionStatus(verified)).toBe('Verified (45, 90 px)');
    expect(component.formatPositionStatus(unavailable)).toBe(
      'Unavailable on this image (contextual record — no map pin)',
    );
    expect(component.formatPositionStatus(unknownStatus)).toBe('Unavailable on this image');

    expect(component.safeExternalUrl('https://mars.nasa.gov/example')).toBe(
      'https://mars.nasa.gov/example',
    );
    expect(component.safeExternalUrl('http://mars.nasa.gov/example')).toBeNull();
    expect(component.safeExternalUrl('javascript:alert(1)')).toBeNull();
  });
});
