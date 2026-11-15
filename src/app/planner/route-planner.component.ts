import { Component, computed, inject, signal, Signal } from '@angular/core';
import { Assessment, ImageManifest, Mode, Point, Route } from '../core/models';
import { MissionService } from '../core/mission.service';
import { routePoints } from '../core/route';

@Component({
  selector: 'app-route-planner',
  standalone: true,
  templateUrl: './route-planner.component.html',
  styleUrl: './route-planner.component.scss',
})
export class RoutePlannerComponent {
  private missionService = inject(MissionService);

  readonly mode: Signal<Mode> = this.missionService.mode;
  readonly route: Signal<Route> = this.missionService.route;
  readonly canUndo: Signal<boolean> = this.missionService.canUndo;
  readonly assessment: Signal<Assessment> = this.missionService.assessment;
  readonly image: Signal<ImageManifest | null> = this.missionService.image;
  readonly dataStatus: Signal<'loading' | 'ready' | 'unavailable' | 'error'> = this.missionService.dataStatus;
  readonly dataError: Signal<string | null> = this.missionService.dataError;

  readonly storageFeedback = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  readonly nextActionHint: Signal<string> = computed(() => {
    if (this.dataStatus() !== 'ready') {
      return 'Wait for verified raster metadata before placing or loading route points.';
    }
    const r = this.route();
    if (!r.start) {
      return 'Next step: Select Start mode and click the map raster to set the EVA start point.';
    }
    if (!r.destination) {
      return 'Next step: Select Destination mode (or Waypoint) and click the map raster to complete the traverse.';
    }
    return 'Next step: Save Route locally for this raster or open Notebook to record field observations.';
  });

  readonly hasRoute = computed(() => {
    const r = this.route();
    return r.start !== null || r.destination !== null || r.waypoints.length > 0;
  });

  readonly orderedPoints = computed(() => {
    return routePoints(this.route());
  });

  readonly modeDescriptions: Record<Mode, string> = {
    inspect: 'Inspect mode: Click markers or explore imagery without modifying the route.',
    start: 'Start mode: Click anywhere on the map raster to set or move the mission start point.',
    destination: 'Destination mode: Click on the map raster to set or move the final destination.',
    waypoint: 'Waypoint mode: Click on the map raster to append intermediate waypoints.',
  };

  setMode(mode: Mode): void {
    this.missionService.setMode(mode);
  }

  undo(): void {
    this.missionService.undoRoute();
  }

  clear(): void {
    this.missionService.clearRoute();
    this.setFeedback('Route cleared. You can use Undo to restore it.', 'success');
  }

  save(): void {
    const res = this.missionService.saveRoute();
    if (res.ok) {
      this.setFeedback('Route saved locally for active raster.', 'success');
    } else {
      this.setFeedback(res.error ?? 'Failed to save route.', 'error');
    }
  }

  load(): void {
    const res = this.missionService.loadRoute();
    if (res.ok) {
      this.setFeedback('Route loaded successfully.', 'success');
    } else {
      this.setFeedback(res.error ?? 'Failed to load route.', 'error');
    }
  }

  private setFeedback(message: string, type: 'success' | 'error'): void {
    this.storageFeedback.set({ message, type });
    setTimeout(() => {
      if (this.storageFeedback()?.message === message) {
        this.storageFeedback.set(null);
      }
    }, 4000);
  }
}
