import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach } from 'vitest';
import { vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type {
  ImageManifest,
  LayerId,
  Mode,
  Observation,
  Route,
  ScienceMarker,
} from '../core/models';
import { imageBounds, MapComponent, toLeafletPoint } from './map.component';

const leaflet = vi.hoisted(() => {
  const handlers = new Map<string, (event: any) => void>();
  const mapLayers = new Set<any>();
  const mapInstance: any = {
    on: vi.fn((name: string, handler: (event: any) => void) => {
      handlers.set(name, handler);
    }),
    off: vi.fn((name: string) => {
      handlers.delete(name);
    }),
    addLayer: vi.fn((layer: any) => mapLayers.add(layer)),
    removeLayer: vi.fn((layer: any) => mapLayers.delete(layer)),
    setView: vi.fn(),
    fitBounds: vi.fn(),
    invalidateSize: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    remove: vi.fn(),
  };
  const makeGroup = () => {
    const layers = new Set<any>();
    const group: any = {
      layers,
      addTo: vi.fn((map: any) => {
        map.addLayer(group);
        return group;
      }),
      addLayer: vi.fn((layer: any) => layers.add(layer)),
      removeLayer: vi.fn((layer: any) => layers.delete(layer)),
    };
    return group;
  };
  const makeLayer = () => {
    const events = new Map<string, (event?: any) => void>();
    const layer: any = {
      events,
      callbacks: new Map<string, (event?: any) => void>(),
      addTo: vi.fn((target: any) => {
        target.addLayer(layer);
        return layer;
      }),
      remove: vi.fn(() => mapInstance.removeLayer(layer)),
      once: vi.fn((name: string, handler: (event?: any) => void) => {
        events.set(name, handler);
        return layer;
      }),
      on: vi.fn((name: string, handler: (event?: any) => void) => {
        events.set(name, handler);
        layer.callbacks.set(name, handler);
        return layer;
      }),
      off: vi.fn((name: string, handler: (event?: any) => void) => {
        if (events.get(name) === handler) events.delete(name);
        return layer;
      }),
      setLatLng: vi.fn(),
      setLatLngs: vi.fn(),
      setStyle: vi.fn(),
      getElement: vi.fn(() => ({
        naturalWidth: 2048,
        naturalHeight: 1042,
        decode: vi.fn(() => Promise.resolve()),
      })),
    };
    return layer;
  };
  const overlays: any[] = [];
  const groups: any[] = [];
  const polylines: any[] = [];
  const circles: any[] = [];
  return {
    handlers,
    mapLayers,
    mapInstance,
    overlays,
    groups,
    polylines,
    circles,
    map: vi.fn(() => mapInstance),
    layerGroup: vi.fn(() => {
      const group = makeGroup();
      groups.push(group);
      return group;
    }),
    polyline: vi.fn(() => {
      const layer = makeLayer();
      polylines.push(layer);
      return layer;
    }),
    circleMarker: vi.fn((point: unknown, options: unknown) => {
      const layer = makeLayer();
      layer.point = point;
      layer.options = options;
      circles.push(layer);
      return layer;
    }),
    imageOverlay: vi.fn((url: string, bounds: unknown, options: unknown) => {
      const layer = makeLayer();
      layer.url = url;
      layer.bounds = bounds;
      layer.options = options;
      layer.getElement.mockReturnValue({
        naturalWidth: (bounds as number[][])[1][1],
        naturalHeight: (bounds as number[][])[1][0],
        decode: vi.fn(() => Promise.resolve()),
      });
      overlays.push(layer);
      return layer;
    }),
    latLngBounds: vi.fn((points: unknown[]) => ({ points })),
    CRS: { Simple: {} },
    DomEvent: { stopPropagation: vi.fn() },
  };
});

vi.mock('leaflet', () => ({
  map: leaflet.map,
  layerGroup: leaflet.layerGroup,
  polyline: leaflet.polyline,
  circleMarker: leaflet.circleMarker,
  imageOverlay: leaflet.imageOverlay,
  latLngBounds: leaflet.latLngBounds,
  CRS: leaflet.CRS,
  DomEvent: leaflet.DomEvent,
}));

const image = (): ImageManifest => ({
  schemaVersion: 1,
  imageRef: 'fixture-image-v1',
  assetPath: 'data/imagery/fixture.jpg',
  width: 2048,
  height: 1042,
  coordinateSystem: 'image-pixels-bottom-left',
  source: { title: 'Test fixture', url: 'https://example.test/source', credit: 'Test only' },
  observationDate: null,
  coverageStatus: 'regional-context',
  limitations: ['Synthetic test fixture; not mission data.'],
  calibration: { verified: false, metersPerPixel: null, sourceUrl: null, method: null },
});

const marker = (imageRef: string): ScienceMarker => ({
  id: 'fixture-marker',
  name: 'Fixture marker',
  imageRef,
  position: { x: 35, y: 20 },
  positionStatus: 'illustrative',
  instrument: 'Test instrument',
  date: null,
  finding: 'Synthetic test finding.',
  evidenceType: 'simulated',
  source: { title: 'Test source', url: 'https://example.test/marker', credit: 'Test only' },
  limitations: ['Synthetic test record; not mission data.'],
});

describe('map coordinate helpers', () => {
  it('uses manifest width and height for CRS.Simple bounds', () => {
    expect(imageBounds(image())).toEqual([
      [0, 0],
      [1042, 2048],
    ]);
  });

  it('converts shared bottom-left points to Leaflet [y, x] order', () => {
    expect(toLeafletPoint({ x: 35, y: 20 })).toEqual([20, 35]);
  });
});

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ReturnType<typeof TestBed.createComponent<MapComponent>>;
  let state: {
    image: ReturnType<typeof signal<ImageManifest | null>>;
    dataStatus: ReturnType<typeof signal<'loading' | 'ready' | 'unavailable' | 'error'>>;
    route: ReturnType<typeof signal<Route>>;
    markers: ReturnType<typeof signal<readonly ScienceMarker[]>>;
    layers: ReturnType<typeof signal<Readonly<Record<LayerId, boolean>>>>;
    selectedMarkerId: ReturnType<typeof signal<string | null>>;
    mode: ReturnType<typeof signal<Mode>>;
    observations: ReturnType<typeof signal<readonly Observation[]>>;
  };
  let applyMapPoint: ReturnType<typeof vi.fn>;
  let selectMarker: ReturnType<typeof vi.fn>;
  let initializeMission: ReturnType<typeof vi.fn>;
  let resizeDisconnect: ReturnType<typeof vi.fn>;
  let originalResizeObserver: PropertyDescriptor | undefined;

  beforeEach(async () => {
    resizeDisconnect = vi.fn();
    originalResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver');
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: class {
        observe = vi.fn();
        disconnect = resizeDisconnect;
        constructor(_callback: ResizeObserverCallback) {}
      },
    });
    leaflet.handlers.clear();
    leaflet.mapLayers.clear();
    leaflet.overlays.length = 0;
    leaflet.groups.length = 0;
    leaflet.polylines.length = 0;
    leaflet.circles.length = 0;
    leaflet.mapInstance.on.mockClear();
    leaflet.mapInstance.off.mockClear();
    leaflet.mapInstance.addLayer.mockClear();
    leaflet.mapInstance.removeLayer.mockClear();
    leaflet.mapInstance.fitBounds.mockClear();
    leaflet.mapInstance.remove.mockClear();
    leaflet.map.mockClear();

    state = {
      image: signal<ImageManifest | null>(image()),
      dataStatus: signal<'loading' | 'ready' | 'unavailable' | 'error'>('ready'),
      route: signal<Route>({ start: null, destination: null, waypoints: [] }),
      markers: signal<readonly ScienceMarker[]>([]),
      layers: signal<Readonly<Record<LayerId, boolean>>>({
        imagery: true,
        markers: true,
        grid: false,
        coverage: true,
      }),
      selectedMarkerId: signal<string | null>(null),
      mode: signal<Mode>('inspect'),
      observations: signal<readonly Observation[]>([]),
    };
    applyMapPoint = vi.fn();
    selectMarker = vi.fn((id: string | null) => state.selectedMarkerId.set(id));
    initializeMission = vi.fn();
    const mission = {
      image: state.image.asReadonly(),
      dataStatus: state.dataStatus.asReadonly(),
      dataError: () => 'Test metadata error.',
      route: state.route.asReadonly(),
      markers: state.markers.asReadonly(),
      layers: state.layers.asReadonly(),
      selectedMarkerId: state.selectedMarkerId.asReadonly(),
      mode: state.mode.asReadonly(),
      observations: state.observations.asReadonly(),
      applyMapPoint,
      selectMarker,
      initialize: initializeMission,
      setLayer: vi.fn((id: string, visible: boolean) =>
        state.layers.update((layers) => ({ ...layers, [id]: visible })),
      ),
    };
    TestBed.configureTestingModule({ providers: [{ provide: MissionService, useValue: mission }] });
    await mountMap();
  });

  afterEach(() => {
    if (originalResizeObserver) {
      Object.defineProperty(window, 'ResizeObserver', originalResizeObserver);
    } else {
      Reflect.deleteProperty(window, 'ResizeObserver');
    }
  });

  async function triggerImageLoad(index = 0): Promise<void> {
    await leaflet.overlays[index]?.callbacks.get('load')?.();
  }

  async function mountMap(loadInitialImage = true): Promise<void> {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    if (loadInitialImage) {
      await triggerImageLoad();
      fixture.detectChanges();
      leaflet.mapInstance.fitBounds.mockClear();
    }
  }

  function triggerImageError(index = 0): void {
    leaflet.overlays[index]?.callbacks.get('error')?.();
  }

  it('dispatches a map click in the shared coordinate shape', () => {
    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).toHaveBeenCalledWith({ x: 35, y: 20 });
  });

  it.each(['loading', 'unavailable', 'error'] as const)(
    'does not dispatch clicks when mission data becomes %s before rendering',
    (status) => {
      state.dataStatus.set(status);
      leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
      expect(applyMapPoint).not.toHaveBeenCalled();
    },
  );

  it('blocks clicks until a replacement image has loaded, decoded and matched its manifest', async () => {
    state.image.set({ ...image(), imageRef: 'fixture-replacement' });
    fixture.detectChanges();
    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).not.toHaveBeenCalled();

    await triggerImageLoad(1);
    fixture.detectChanges();
    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).toHaveBeenCalledOnce();
    expect(applyMapPoint).toHaveBeenCalledWith({ x: 35, y: 20 });
  });

  it('does not dispatch clicks after an image-load failure', () => {
    state.image.set({ ...image(), imageRef: 'fixture-failed-image' });
    fixture.detectChanges();
    leaflet.overlays[1].events.get('error')?.();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('error');

    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).not.toHaveBeenCalled();
  });

  it('provides explicit zoom controls backed by the Leaflet map', () => {
    fixture.nativeElement.querySelector('[aria-label="Zoom in"]').click();
    fixture.nativeElement.querySelector('[aria-label="Zoom out"]').click();
    expect(leaflet.mapInstance.zoomIn).toHaveBeenCalledOnce();
    expect(leaflet.mapInstance.zoomOut).toHaveBeenCalledOnce();
  });

  it('resets the viewport to the active image without changing mission state', () => {
    const route = {
      start: { x: 10, y: 20 },
      waypoints: [{ x: 30, y: 40 }],
      destination: { x: 50, y: 60 },
    };
    const observations: Observation[] = [
      {
        id: 'observation-1',
        imageRef: image().imageRef,
        createdAt: '2026-11-14T00:00:00Z',
        text: 'Keep this note',
        position: null,
      },
    ];
    const selectedMarkerId = 'selected-record';
    const layers = { imagery: false, markers: true, grid: false, coverage: true } as const;
    state.route.set(route);
    state.mode.set('destination');
    state.observations.set(observations);
    state.selectedMarkerId.set(selectedMarkerId);
    state.layers.set(layers);
    fixture.detectChanges();

    const routeSnapshot = state.route();
    const modeSnapshot = state.mode();
    const observationsSnapshot = state.observations();
    const selectedSnapshot = state.selectedMarkerId();
    const layersSnapshot = state.layers();
    const buttons = fixture.nativeElement.querySelectorAll('.map-view-actions button');
    buttons[0].click();

    expect(leaflet.mapInstance.fitBounds).toHaveBeenNthCalledWith(
      1,
      [
        [0, 0],
        [1042, 2048],
      ],
      { padding: [32, 32] },
    );
    buttons[1].click();
    expect(leaflet.mapInstance.fitBounds).toHaveBeenLastCalledWith(
      {
        points: [
          [20, 10],
          [40, 30],
          [60, 50],
        ],
      },
      { padding: [32, 32], maxZoom: 2 },
    );
    expect(state.route()).toBe(routeSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);
  });

  it('disables both navigation actions until mission data and the image are ready', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.map-view-actions button');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);

    state.dataStatus.set('loading');
    fixture.detectChanges();
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);

    state.dataStatus.set('ready');
    state.route.set({ start: { x: 1, y: 1 }, waypoints: [], destination: { x: 2, y: 2 } });
    fixture.detectChanges();
    leaflet.overlays[0].events.get('error')?.();
    fixture.detectChanges();
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
  });

  it('disables Focus Route with fewer than two shared route points', () => {
    const button = fixture.nativeElement.querySelectorAll('.map-view-actions button')[1];
    expect(button.disabled).toBe(true);
    state.route.set({ start: { x: 4, y: 5 }, waypoints: [], destination: null });
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
    component.focusRoute();
    expect(leaflet.mapInstance.fitBounds).not.toHaveBeenCalled();
  });

  it('disables both actions when mission imagery is unavailable', () => {
    state.image.set(null);
    state.dataStatus.set('unavailable');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.map-view-actions button');
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
    component.resetView();
    component.focusRoute();
    expect(leaflet.mapInstance.fitBounds).not.toHaveBeenCalled();
  });

  it('focuses available route points in start, waypoint, destination order', () => {
    state.route.set({
      start: { x: 10, y: 20 },
      waypoints: [{ x: 30, y: 40 }],
      destination: { x: 50, y: 60 },
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('.map-view-actions button')[1].click();
    expect(leaflet.latLngBounds).toHaveBeenCalledWith([
      [20, 10],
      [40, 30],
      [60, 50],
    ]);
    expect(leaflet.mapInstance.fitBounds).toHaveBeenLastCalledWith(
      {
        points: [
          [20, 10],
          [40, 30],
          [60, 50],
        ],
      },
      { padding: [32, 32], maxZoom: 2 },
    );
  });

  it('caps zoom when focusing a route whose points coincide', () => {
    const point = { x: 25, y: 35 };
    state.route.set({ start: point, waypoints: [], destination: { ...point } });
    fixture.detectChanges();
    component.focusRoute();
    expect(leaflet.mapInstance.fitBounds).toHaveBeenLastCalledWith(
      {
        points: [
          [35, 25],
          [35, 25],
        ],
      },
      { padding: [32, 32], maxZoom: 2 },
    );
  });

  it('renders route line in start, waypoint, destination order', () => {
    state.route.set({
      start: { x: 1, y: 2 },
      waypoints: [
        { x: 3, y: 4 },
        { x: 5, y: 6 },
      ],
      destination: { x: 7, y: 8 },
    });
    fixture.detectChanges();
    expect(leaflet.polylines[0].setLatLngs).toHaveBeenLastCalledWith([
      [2, 1],
      [4, 3],
      [6, 5],
      [8, 7],
    ]);
  });

  it('selects a science marker without dispatching a map point', () => {
    state.markers.set([marker(image().imageRef)]);
    fixture.detectChanges();
    const renderedMarker = leaflet.circles.find(
      (layer: any) => layer.point?.[0] === 20 && layer.point?.[1] === 35,
    );
    renderedMarker.events.get('click')?.({ originalEvent: {} });
    expect(selectMarker).toHaveBeenCalledWith('fixture-marker');
    expect(applyMapPoint).not.toHaveBeenCalled();
    expect(leaflet.DomEvent.stopPropagation).toHaveBeenCalled();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Synthetic test finding.');
    expect(fixture.nativeElement.textContent).toContain('illustrative');
  });

  it('toggles imagery and markers independently through shared layer state', () => {
    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes[1].checked = false;
    checkboxes[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(state.layers().markers).toBe(false);
    expect(state.layers().imagery).toBe(true);
    expect(leaflet.mapInstance.removeLayer).toHaveBeenCalledWith(leaflet.groups[1]);
  });

  it('replaces the image overlay and uses the new manifest dimensions when imageRef changes', async () => {
    const firstOverlay = leaflet.overlays[0];
    const next = {
      ...image(),
      imageRef: 'fixture-image-v2',
      assetPath: 'data/imagery/second.jpg',
      width: 1000,
      height: 500,
    };
    state.image.set(next);
    fixture.detectChanges();
    expect(firstOverlay.remove).toHaveBeenCalled();
    expect(leaflet.overlays).toHaveLength(2);
    expect(leaflet.overlays[1].bounds).toEqual([
      [0, 0],
      [500, 1000],
    ]);
    expect(leaflet.overlays[1].options.pane).toBe('tilePane');
    await triggerImageLoad(1);
    expect(leaflet.mapInstance.fitBounds).toHaveBeenLastCalledWith(
      [
        [0, 0],
        [500, 1000],
      ],
      { padding: [8, 8] },
    );
  });

  it('shows image dimension errors after decoding when actual dimensions differ from the manifest', async () => {
    leaflet.overlays[0].getElement.mockReturnValue({
      naturalWidth: 1,
      naturalHeight: 1,
      decode: vi.fn(() => Promise.resolve()),
    });
    await triggerImageLoad();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('dimensions do not match its manifest');
    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).not.toHaveBeenCalled();
  });

  it('shows unavailable-data state and removes the previous overlay', () => {
    state.image.set(null);
    state.dataStatus.set('unavailable');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Imagery is unavailable');
    expect(leaflet.overlays[0].remove).toHaveBeenCalled();
  });

  it('retries successfully after the initial image load fails before any successful load', async () => {
    fixture.destroy();
    leaflet.handlers.clear();
    leaflet.mapLayers.clear();
    leaflet.overlays.length = 0;
    leaflet.groups.length = 0;
    leaflet.polylines.length = 0;
    leaflet.circles.length = 0;
    leaflet.mapInstance.on.mockClear();
    leaflet.mapInstance.off.mockClear();
    leaflet.mapInstance.addLayer.mockClear();
    leaflet.mapInstance.removeLayer.mockClear();
    leaflet.mapInstance.fitBounds.mockClear();
    leaflet.mapInstance.remove.mockClear();
    leaflet.map.mockClear();
    leaflet.imageOverlay.mockClear();
    leaflet.layerGroup.mockClear();
    leaflet.polyline.mockClear();
    leaflet.circleMarker.mockClear();

    const route: Route = {
      start: { x: 10, y: 20 },
      waypoints: [{ x: 30, y: 40 }],
      destination: { x: 50, y: 60 },
    };
    const scienceMarker = marker(image().imageRef);
    const notes: Observation[] = [
      {
        id: 'initial-retry-note',
        imageRef: image().imageRef,
        createdAt: '2026-11-14T00:00:00Z',
        text: 'Preserve this note after an initial image failure',
        position: null,
      },
    ];
    state.route.set(route);
    state.markers.set([scienceMarker]);
    state.mode.set('waypoint');
    state.observations.set(notes);
    state.selectedMarkerId.set(scienceMarker.id);
    state.layers.set({ imagery: false, markers: true, grid: false, coverage: true });
    const imageSnapshot = state.image();
    const routeSnapshot = state.route();
    const markersSnapshot = state.markers();
    const modeSnapshot = state.mode();
    const observationsSnapshot = state.observations();
    const selectedSnapshot = state.selectedMarkerId();
    const layersSnapshot = state.layers();

    await mountMap(false);
    expect(component.imageDisplayState()).toBe('loading');
    expect(leaflet.imageOverlay).toHaveBeenCalledOnce();

    const initialOverlay = leaflet.overlays[0];
    const initialLoad = initialOverlay.callbacks.get('load');
    const initialError = initialOverlay.callbacks.get('error');
    expect(initialLoad).toBeTypeOf('function');
    expect(initialError).toBeTypeOf('function');
    initialError?.();
    fixture.detectChanges();

    expect(component.imageDisplayState()).toBe('error');
    expect(component.canRetryImage()).toBe(true);
    expect(fixture.nativeElement.querySelector('.retry-image')).not.toBeNull();

    fixture.nativeElement.querySelector('.retry-image').click();
    fixture.detectChanges();
    expect(leaflet.overlays).toHaveLength(2);
    expect(leaflet.imageOverlay).toHaveBeenCalledTimes(2);
    expect(leaflet.map).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('loading');
    expect(state.image()).toBe(imageSnapshot);
    expect(state.route()).toBe(routeSnapshot);
    expect(state.markers()).toBe(markersSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);

    await initialLoad?.();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('loading');
    expect(leaflet.overlays[1].remove).not.toHaveBeenCalled();

    const retryOverlay = leaflet.overlays[1];
    const decodedImage = retryOverlay.getElement();
    await triggerImageLoad(1);
    fixture.detectChanges();

    expect(decodedImage.decode).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('ready');
    expect(leaflet.map).toHaveBeenCalledOnce();
    expect(leaflet.polylines).toHaveLength(1);
    expect(leaflet.polylines[0].setLatLngs).toHaveBeenLastCalledWith([
      [20, 10],
      [40, 30],
      [60, 50],
    ]);
    expect(leaflet.circles).toHaveLength(4);
    expect(leaflet.groups[0].layers.size).toBe(4);
    expect(leaflet.groups[1].layers.size).toBe(1);
    expect(state.image()).toBe(imageSnapshot);
    expect(state.route()).toBe(routeSnapshot);
    expect(state.markers()).toBe(markersSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);
  });

  it('blocks retry when metadata is not ready even while a valid manifest remains present', () => {
    const route: Route = {
      start: { x: 10, y: 20 },
      waypoints: [{ x: 30, y: 40 }],
      destination: { x: 50, y: 60 },
    };
    const scienceMarker = marker(image().imageRef);
    const notes: Observation[] = [
      {
        id: 'metadata-guard-note',
        imageRef: image().imageRef,
        createdAt: '2026-11-14T00:00:00Z',
        text: 'Preserve this note while metadata is not ready',
        position: null,
      },
    ];
    state.route.set(route);
    state.markers.set([scienceMarker]);
    state.mode.set('waypoint');
    state.observations.set(notes);
    state.selectedMarkerId.set(scienceMarker.id);
    state.layers.set({ imagery: false, markers: true, grid: false, coverage: true });
    const imageSnapshot = state.image();

    state.dataStatus.set('error');
    fixture.detectChanges();

    expect(state.image()).toBe(imageSnapshot);
    expect(state.image()).not.toBeNull();
    expect(component.canRetryImage()).toBe(false);
    expect(fixture.nativeElement.querySelector('.retry-image')).toBeNull();
    const overlayCalls = leaflet.imageOverlay.mock.calls.length;
    const routeSnapshot = state.route();
    const markersSnapshot = state.markers();
    const modeSnapshot = state.mode();
    const observationsSnapshot = state.observations();
    const selectedSnapshot = state.selectedMarkerId();
    const layersSnapshot = state.layers();

    component.retryImage();
    fixture.detectChanges();

    expect(leaflet.imageOverlay).toHaveBeenCalledTimes(overlayCalls);
    expect(leaflet.overlays).toHaveLength(1);
    expect(state.image()).toBe(imageSnapshot);
    expect(state.route()).toBe(routeSnapshot);
    expect(state.markers()).toBe(markersSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);
    expect(initializeMission).not.toHaveBeenCalled();
  });

  it('retries on the existing map and restores layers only after decoding and validation', async () => {
    const route: Route = {
      start: { x: 10, y: 20 },
      waypoints: [{ x: 30, y: 40 }],
      destination: { x: 50, y: 60 },
    };
    const scienceMarker = marker(image().imageRef);
    const notes: Observation[] = [
      {
        id: 'retry-note',
        imageRef: image().imageRef,
        createdAt: '2026-11-14T00:00:00Z',
        text: 'Preserve this note',
        position: null,
      },
    ];
    state.route.set(route);
    state.markers.set([scienceMarker]);
    state.mode.set('waypoint');
    state.observations.set(notes);
    state.selectedMarkerId.set(scienceMarker.id);
    state.layers.set({ imagery: false, markers: true, grid: false, coverage: true });
    fixture.detectChanges();

    const routeSnapshot = state.route();
    const markersSnapshot = state.markers();
    const modeSnapshot = state.mode();
    const observationsSnapshot = state.observations();
    const selectedSnapshot = state.selectedMarkerId();
    const layersSnapshot = state.layers();
    const originalImage = state.image()!;
    const originalOverlay = leaflet.overlays[0];
    const routeGroup = leaflet.groups[0];
    const markerGroup = leaflet.groups[1];

    triggerImageError();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('error');
    expect(component.canRetryImage()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('The image file could not be loaded.');

    const retryButton = fixture.nativeElement.querySelector('.retry-image') as HTMLButtonElement;
    expect(retryButton).not.toBeNull();
    expect(retryButton.type).toBe('button');
    expect(retryButton.textContent.trim()).toBe('Retry Image');
    retryButton.click();
    fixture.detectChanges();

    expect(leaflet.overlays).toHaveLength(2);
    expect(leaflet.map).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('loading');
    expect(component.canResetView()).toBe(false);
    expect(component.canFocusRoute()).toBe(false);
    expect(fixture.nativeElement.querySelector('.retry-image')).toBeNull();
    expect(leaflet.overlays[1].url).toBe(originalOverlay.url);
    expect(leaflet.overlays[1].bounds).toEqual(originalOverlay.bounds);
    expect(state.image()).toBe(originalImage);
    expect(state.route()).toBe(routeSnapshot);
    expect(state.markers()).toBe(markersSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);
    expect(initializeMission).not.toHaveBeenCalled();

    let finishDecode!: () => void;
    const decode = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishDecode = resolve;
        }),
    );
    leaflet.overlays[1].getElement.mockReturnValue({
      naturalWidth: originalImage.width,
      naturalHeight: originalImage.height,
      decode,
    });
    const loadPromise = triggerImageLoad(1);
    fixture.detectChanges();
    expect(decode).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('loading');
    expect(routeGroup.layers.size).toBe(1);
    expect(markerGroup.layers.size).toBe(0);

    finishDecode();
    await loadPromise;
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('ready');
    expect(component.canResetView()).toBe(true);
    expect(component.canFocusRoute()).toBe(true);
    expect(leaflet.map).toHaveBeenCalledOnce();
    expect(leaflet.polylines[0].setLatLngs).toHaveBeenLastCalledWith([
      [20, 10],
      [40, 30],
      [60, 50],
    ]);
    expect(routeGroup.layers.size).toBe(4); // one route line plus three route points
    expect(markerGroup.layers.size).toBe(1);
    expect(state.image()).toBe(originalImage);
    expect(state.route()).toBe(routeSnapshot);
    expect(state.markers()).toBe(markersSnapshot);
    expect(state.mode()).toBe(modeSnapshot);
    expect(state.observations()).toBe(observationsSnapshot);
    expect(state.selectedMarkerId()).toBe(selectedSnapshot);
    expect(state.layers()).toBe(layersSnapshot);
  });

  it('allows another explicit attempt after a repeated retry failure without looping', () => {
    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();
    triggerImageError(1);
    fixture.detectChanges();

    expect(component.imageDisplayState()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('The image file could not be loaded.');
    expect(fixture.nativeElement.querySelector('.retry-image')).not.toBeNull();
    expect(leaflet.overlays).toHaveLength(2);
    expect(initializeMission).not.toHaveBeenCalled();

    fixture.nativeElement.querySelector('.retry-image').click();
    expect(leaflet.overlays).toHaveLength(3);
    expect(component.imageDisplayState()).toBe('loading');
  });

  it('keeps a decode failure retryable and does not restore route or markers', async () => {
    state.route.set({ start: { x: 10, y: 20 }, waypoints: [], destination: { x: 30, y: 40 } });
    state.markers.set([marker(image().imageRef)]);
    fixture.detectChanges();
    const routeGroup = leaflet.groups[0];
    const markerGroup = leaflet.groups[1];

    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();
    leaflet.overlays[1].getElement.mockReturnValue({
      naturalWidth: image().width,
      naturalHeight: image().height,
      decode: vi.fn(() => Promise.reject(new Error('decode failed'))),
    });
    await triggerImageLoad(1);
    fixture.detectChanges();

    expect(component.imageDisplayState()).toBe('error');
    expect(fixture.nativeElement.querySelector('.retry-image')).not.toBeNull();
    expect(routeGroup.layers.size).toBe(1);
    expect(markerGroup.layers.size).toBe(0);
    expect(state.route().destination).toEqual({ x: 30, y: 40 });
    expect(state.markers()).toHaveLength(1);
  });

  it('ignores a pending decode when a newer image reference supersedes the retry', async () => {
    state.route.set({ start: { x: 10, y: 20 }, waypoints: [], destination: { x: 30, y: 40 } });
    fixture.detectChanges();
    const routeGroup = leaflet.groups[0];

    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();

    let finishDecode!: () => void;
    leaflet.overlays[1].getElement.mockReturnValue({
      naturalWidth: image().width,
      naturalHeight: image().height,
      decode: () =>
        new Promise<void>((resolve) => {
          finishDecode = resolve;
        }),
    });
    const staleDecode = triggerImageLoad(1);

    state.image.set({ ...image(), imageRef: 'superseding-image' });
    fixture.detectChanges();
    expect(leaflet.overlays).toHaveLength(3);
    expect(component.imageDisplayState()).toBe('loading');

    finishDecode();
    await staleDecode;
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('loading');
    expect(routeGroup.layers.size).toBe(1);
    expect(leaflet.overlays[2].remove).not.toHaveBeenCalled();

    await triggerImageLoad(2);
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('ready');
    expect(routeGroup.layers.size).toBe(3);
  });

  it('keeps a dimension mismatch in error state and offers another explicit retry', async () => {
    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();
    leaflet.overlays[1].getElement.mockReturnValue({
      naturalWidth: 1,
      naturalHeight: 1,
      decode: vi.fn(() => Promise.resolve()),
    });
    await triggerImageLoad(1);
    fixture.detectChanges();

    expect(component.imageDisplayState()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('dimensions do not match its manifest');
    expect(fixture.nativeElement.querySelector('.retry-image')).not.toBeNull();
    expect(component.canResetView()).toBe(false);
  });

  it('ignores stale load and error callbacks from a superseded overlay', async () => {
    const oldOverlay = leaflet.overlays[0];
    const oldLoad = oldOverlay.events.get('load');
    const oldError = oldOverlay.events.get('error');
    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();
    const retryOverlay = leaflet.overlays[1];

    oldLoad?.();
    oldError?.();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('loading');
    expect(retryOverlay.remove).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.retry-image')).toBeNull();

    await triggerImageLoad(1);
    fixture.detectChanges();
    oldError?.();
    fixture.detectChanges();
    expect(component.imageDisplayState()).toBe('ready');
  });

  it('blocks duplicate retry attempts and navigation while an image attempt is loading', () => {
    state.route.set({ start: { x: 10, y: 20 }, waypoints: [], destination: { x: 30, y: 40 } });
    fixture.detectChanges();
    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();

    component.retryImage();
    component.retryImage();
    fixture.detectChanges();
    expect(leaflet.overlays).toHaveLength(2);
    expect(component.canRetryImage()).toBe(false);
    expect(component.canResetView()).toBe(false);
    expect(component.canFocusRoute()).toBe(false);
    expect(fixture.nativeElement.querySelector('.retry-image')).toBeNull();

    leaflet.handlers.get('click')?.({ latlng: { lat: 25, lng: 25 } });
    expect(applyMapPoint).not.toHaveBeenCalled();
  });

  it.each(['unavailable', 'error'] as const)(
    'does not offer or start a retry when mission metadata is %s',
    (status) => {
      state.image.set(null);
      state.dataStatus.set(status);
      fixture.detectChanges();

      expect(component.canRetryImage()).toBe(false);
      expect(fixture.nativeElement.querySelector('.retry-image')).toBeNull();
      component.retryImage();
      expect(leaflet.overlays).toHaveLength(1);
      expect(initializeMission).not.toHaveBeenCalled();
    },
  );

  it('invalidates a pending retry when the component is destroyed', () => {
    triggerImageError();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.retry-image').click();
    const pendingOverlay = leaflet.overlays[1];
    const lateLoad = pendingOverlay.events.get('load');
    const lateError = pendingOverlay.events.get('error');

    fixture.destroy();
    lateLoad?.();
    lateError?.();

    expect(leaflet.mapInstance.remove).toHaveBeenCalledOnce();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
    expect(component.imageDisplayState()).toBe('loading');
  });

  it('removes map handlers and disposes of Leaflet when destroyed', () => {
    const click = leaflet.handlers.get('click');
    fixture.destroy();
    expect(leaflet.mapInstance.off).toHaveBeenCalledWith('click', click);
    expect(leaflet.mapInstance.remove).toHaveBeenCalledOnce();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
  });
});
