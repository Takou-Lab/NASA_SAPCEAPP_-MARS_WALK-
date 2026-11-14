import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach } from 'vitest';
import { vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import type { ImageManifest, LayerId, Route, ScienceMarker } from '../core/models';
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
        return layer;
      }),
      setLatLng: vi.fn(),
      setLatLngs: vi.fn(),
      setStyle: vi.fn(),
      getElement: vi.fn(() => ({ naturalWidth: 2048, naturalHeight: 1042 })),
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
      });
      overlays.push(layer);
      return layer;
    }),
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
  };
  let applyMapPoint: ReturnType<typeof vi.fn>;
  let selectMarker: ReturnType<typeof vi.fn>;
  let resizeDisconnect: ReturnType<typeof vi.fn>;
  let originalResizeObserver: PropertyDescriptor | undefined;

  beforeEach(() => {
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
    };
    applyMapPoint = vi.fn();
    selectMarker = vi.fn((id: string | null) => state.selectedMarkerId.set(id));
    const mission = {
      image: state.image.asReadonly(),
      dataStatus: state.dataStatus.asReadonly(),
      route: state.route.asReadonly(),
      markers: state.markers.asReadonly(),
      layers: state.layers.asReadonly(),
      selectedMarkerId: state.selectedMarkerId.asReadonly(),
      applyMapPoint,
      selectMarker,
      setLayer: vi.fn((id: string, visible: boolean) =>
        state.layers.update((layers) => ({ ...layers, [id]: visible })),
      ),
    };
    TestBed.configureTestingModule({ providers: [{ provide: MissionService, useValue: mission }] });
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    triggerImageLoad();
    fixture.detectChanges();
  });

  afterEach(() => {
    if (originalResizeObserver) {
      Object.defineProperty(window, 'ResizeObserver', originalResizeObserver);
    } else {
      Reflect.deleteProperty(window, 'ResizeObserver');
    }
  });

  function triggerImageLoad(index = 0): void {
    leaflet.overlays[index]?.events.get('load')?.();
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

  it('blocks clicks until a replacement image has loaded and matched its manifest', () => {
    state.image.set({ ...image(), imageRef: 'fixture-replacement' });
    fixture.detectChanges();
    leaflet.handlers.get('click')?.({ latlng: { lat: 20, lng: 35 } });
    expect(applyMapPoint).not.toHaveBeenCalled();

    triggerImageLoad(1);
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

  it('replaces the image overlay and uses the new manifest dimensions when imageRef changes', () => {
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
    triggerImageLoad(1);
    expect(leaflet.mapInstance.fitBounds).toHaveBeenLastCalledWith(
      [
        [0, 0],
        [500, 1000],
      ],
      { padding: [8, 8] },
    );
  });

  it('shows image decode errors when actual dimensions differ from the manifest', () => {
    leaflet.overlays[0].getElement.mockReturnValue({ naturalWidth: 1, naturalHeight: 1 });
    triggerImageLoad();
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

  it('removes map handlers and disposes of Leaflet when destroyed', () => {
    const click = leaflet.handlers.get('click');
    fixture.destroy();
    expect(leaflet.mapInstance.off).toHaveBeenCalledWith('click', click);
    expect(leaflet.mapInstance.remove).toHaveBeenCalledOnce();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
  });
});
