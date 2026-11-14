import { Component, computed, inject, signal } from '@angular/core';
import { Mode, Point, Route } from '../core/models';
import { MissionService } from '../core/mission.service';
import { getOrderedRoutePoints } from '../core/route-helpers';

@Component({
  selector: 'app-route-planner',
  standalone: true,
  templateUrl: './route-planner.component.html',
  styleUrl: './route-planner.component.scss',
})
export class RoutePlannerComponent {
  private missionService = inject(MissionService);

  readonly mode = this.missionService.mode;
  readonly route = this.missionService.route;
  readonly canUndo = this.missionService.canUndo;
  readonly assessment = this.missionService.assessment;
  readonly image = this.missionService.image;

  readonly storageFeedback = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  readonly hasRoute = computed(() => {
    const r = this.route();
    return r.start !== null || r.destination !== null || r.waypoints.length > 0;
  });

  readonly orderedPoints = computed(() => {
    return getOrderedRoutePoints(this.route());
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
