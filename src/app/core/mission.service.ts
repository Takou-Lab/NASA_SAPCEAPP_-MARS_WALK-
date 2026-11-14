import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import {
  Assessment,
  ImageManifest,
  LayerId,
  MissionExportData,
  Mode,
  Observation,
  Point,
  Route,
  ScienceMarker,
} from './models';
import {
  applyPointToRoute,
  calculateAssessment,
  cloneRoute,
  createEmptyRoute,
  isValidPoint,
} from './route-helpers';
import {
  buildMissionExportData,
  loadObservationsFromStorage,
  loadRouteFromStorage,
  saveObservationsToStorage,
  saveRouteToStorage,
  validateObservationText,
} from './storage-helpers';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private http = inject(HttpClient, { optional: true });

  // Internal writable signals
  private _image = signal<ImageManifest | null>(null);
  private _markers = signal<readonly ScienceMarker[]>([]);
  private _route = signal<Route>(createEmptyRoute());
  private _mode = signal<Mode>('inspect');
  private _layers = signal<Readonly<Record<LayerId, boolean>>>({
    imagery: true,
    markers: true,
    grid: false,
    coverage: false,
  });
  private _selectedMarkerId = signal<string | null>(null);
  private _observations = signal<readonly Observation[]>([]);
  private _undoStack = signal<Route[]>([]);
  private _dataStatus = signal<'loading' | 'ready' | 'unavailable' | 'error'>('loading');
  private _dataError = signal<string | null>(null);

  // Readonly public signals
  readonly image: Signal<ImageManifest | null> = this._image.asReadonly();
  readonly markers: Signal<readonly ScienceMarker[]> = this._markers.asReadonly();
  readonly route: Signal<Route> = this._route.asReadonly();
  readonly mode: Signal<Mode> = this._mode.asReadonly();
  readonly layers: Signal<Readonly<Record<LayerId, boolean>>> = this._layers.asReadonly();
  readonly selectedMarkerId: Signal<string | null> = this._selectedMarkerId.asReadonly();
  readonly observations: Signal<readonly Observation[]> = this._observations.asReadonly();
  readonly dataStatus: Signal<'loading' | 'ready' | 'unavailable' | 'error'> =
    this._dataStatus.asReadonly();
  readonly dataError: Signal<string | null> = this._dataError.asReadonly();

  readonly canUndo: Signal<boolean> = computed(() => this._undoStack().length > 0);

  readonly assessment: Signal<Assessment> = computed(() => {
    return calculateAssessment(this._route(), this._image());
  });

  constructor() {
    this.initData();
  }

  /**
   * Initializes data from public directory or marks as unavailable.
   */
  initData(): void {
    if (!this.http) {
      this._dataStatus.set('unavailable');
      this._dataError.set('HttpClient unavailable; running in offline/local state.');
      return;
    }

    this._dataStatus.set('loading');
    this._dataError.set(null);

    this.http.get<ImageManifest>('data/manifest.json').subscribe({
      next: (manifest) => {
        if (manifest && manifest.schemaVersion === 1) {
          this.setImageManifest(manifest);
          this.loadMarkersData();
        } else {
          this._dataStatus.set('error');
          this._dataError.set('Invalid manifest format.');
        }
      },
      error: () => {
        // Missing files produce unavailable/error states, not fake data
        this._dataStatus.set('unavailable');
        this._dataError.set('No manifest.json found at public/data/manifest.json');
      },
    });
  }

  private loadMarkersData(): void {
    if (!this.http) {
      return;
    }
    this.http.get<ScienceMarker[]>('data/markers.json').subscribe({
      next: (markers) => {
        if (Array.isArray(markers)) {
          this._markers.set(markers);
          this._dataStatus.set('ready');
        } else {
          this._markers.set([]);
          this._dataStatus.set('ready');
        }
      },
      error: () => {
        this._markers.set([]);
        this._dataStatus.set('ready');
      },
    });
  }

  /**
   * Sets active image manifest and syncs persisted observations.
   */
  setImageManifest(manifest: ImageManifest | null): void {
    this._image.set(manifest);
    if (manifest) {
      const stored = loadObservationsFromStorage(manifest.imageRef);
      if (stored.ok && stored.observations) {
        this._observations.set(stored.observations);
      } else {
        this._observations.set([]);
      }
    } else {
      this._observations.set([]);
    }
  }

  setMarkers(markers: readonly ScienceMarker[]): void {
    this._markers.set(markers);
  }

  setMode(mode: Mode): void {
    this._mode.set(mode);
  }

  setLayer(id: LayerId, visible: boolean): void {
    this._layers.update((current) => ({
      ...current,
      [id]: visible,
    }));
  }

  selectMarker(id: string | null): void {
    this._selectedMarkerId.set(id);
  }

  /**
   * Receives a point from map interactions and applies it based on current mode.
   */
  applyMapPoint(point: Point): void {
    if (!isValidPoint(point, this._image())) {
      return;
    }

    const currentMode = this._mode();
    if (currentMode === 'inspect') {
      return;
    }

    const currentRoute = this._route();
    // Push immutable snapshot to undo stack
    this._undoStack.update((stack) => [...stack, cloneRoute(currentRoute)]);

    const updatedRoute = applyPointToRoute(currentRoute, currentMode, point);
    this._route.set(updatedRoute);
  }

  /**
   * Restores the previous route snapshot from the undo stack.
   */
  undoRoute(): void {
    const stack = this._undoStack();
    if (stack.length === 0) {
      return;
    }

    const previousRoute = stack[stack.length - 1];
    this._undoStack.set(stack.slice(0, stack.length - 1));
    this._route.set(previousRoute);
  }

  /**
   * Resets the route to empty; pushes current route to undo stack so clear can be undone.
   */
  clearRoute(): void {
    const currentRoute = this._route();
    const isAlreadyEmpty =
      currentRoute.start === null &&
      currentRoute.destination === null &&
      currentRoute.waypoints.length === 0;

    if (isAlreadyEmpty) {
      return;
    }

    this._undoStack.update((stack) => [...stack, cloneRoute(currentRoute)]);
    this._route.set(createEmptyRoute());
  }

  /**
   * Persists route to localStorage for the active imageRef.
   */
  saveRoute(): { ok: boolean; error?: string } {
    const imageRef = this._image()?.imageRef ?? 'default';
    return saveRouteToStorage(this._route(), imageRef);
  }

  /**
   * Restores route from localStorage for the active imageRef and resets undo history.
   */
  loadRoute(): { ok: boolean; error?: string } {
    const imageRef = this._image()?.imageRef ?? 'default';
    const res = loadRouteFromStorage(imageRef);
    if (res.ok && res.route) {
      this._route.set(res.route);
      this._undoStack.set([]); // loading a valid route resets undo history
      return { ok: true };
    }
    return { ok: false, error: res.error ?? 'Failed to load route' };
  }

  /**
   * Adds an observation note with validation and persistence.
   */
  addObservation(text: string, position: Point | null): { ok: boolean; error?: string } {
    const val = validateObservationText(text);
    if (!val.valid) {
      return { ok: false, error: val.error };
    }

    if (position && !isValidPoint(position, this._image())) {
      return { ok: false, error: 'Invalid coordinate for observation note.' };
    }

    const imageRef = this._image()?.imageRef ?? 'default';
    const newObs: Observation = {
      id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      imageRef,
      createdAt: new Date().toISOString(),
      text: text.trim(),
      position: position ? { ...position } : null,
    };

    const updatedList = [newObs, ...this._observations()];

    // Attempt to persist
    const saveRes = saveObservationsToStorage(updatedList, imageRef);
    if (!saveRes.ok) {
      // Storage failed: do NOT mutate state; return error so draft text is kept intact in component
      return { ok: false, error: saveRes.error };
    }

    this._observations.set(updatedList);
    return { ok: true };
  }

  /**
   * Exports versioned mission JSON file (never pixel GeoJSON).
   */
  exportMission(): void {
    const exportData: MissionExportData = {
      ...buildMissionExportData(
        this._image(),
        this._route(),
        this._observations(),
        this._markers(),
      ),
      assessment: this.assessment(),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    if (typeof document !== 'undefined') {
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `marswalk_mission_${exportData.imageRef}_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
