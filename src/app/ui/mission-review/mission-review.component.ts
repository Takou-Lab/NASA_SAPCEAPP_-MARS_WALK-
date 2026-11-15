import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { MissionService } from '../../core/mission.service';
import type { ScienceMarker } from '../../core/models';

export type MissionWorkflowTab = 'confidence' | 'planner' | 'notebook' | 'transfer';

/**
 * Compact, read-only mission decision summary and workflow action bar.
 * Derives all values from existing MissionService signals via computed().
 * Emits typed navigation requests without mutating route, mode, layers,
 * selected marker, observations, or browser storage.
 */
@Component({
  selector: 'app-mission-review',
  standalone: true,
  imports: [],
  templateUrl: './mission-review.component.html',
  styleUrl: './mission-review.component.scss',
})
export class MissionReviewComponent {
  readonly mission = inject(MissionService);

  @Output() readonly navigateTab = new EventEmitter<MissionWorkflowTab>();

  readonly route = this.mission.route;
  readonly assessment = this.mission.assessment;
  readonly observations = this.mission.observations;
  readonly image = this.mission.image;
  readonly dataStatus = this.mission.dataStatus;

  readonly hasStart = computed(() => this.route().start !== null);
  readonly hasDestination = computed(() => this.route().destination !== null);
  readonly hasBothEndpoints = computed(() => this.hasStart() && this.hasDestination());
  readonly waypointCount = computed(() => this.route().waypoints.length);

  readonly endpointStatusLabel = computed(() => {
    const start = this.hasStart();
    const dest = this.hasDestination();
    if (start && dest) {
      return 'Start & Destination set';
    }
    if (start && !dest) {
      return 'Start set · Destination missing';
    }
    if (!start && dest) {
      return 'Destination set · Start missing';
    }
    return 'Missing Start & Destination';
  });

  readonly distanceSummary = computed(() => {
    const assess = this.assessment();
    const cal = this.image()?.calibration;
    if (
      assess.distanceStatus === 'derived' &&
      assess.planarDistanceMeters !== null &&
      Number.isFinite(assess.planarDistanceMeters)
    ) {
      const meters = assess.planarDistanceMeters.toFixed(1);
      const scaleNote =
        cal?.verified && cal.metersPerPixel
          ? ` (${cal.metersPerPixel} m/px · ${cal.method ?? 'calibrated'})`
          : '';
      return `Derived planar: ${meters} m${scaleNote} · Terrain/slope: unavailable`;
    }
    return cal?.verified
      ? 'Planar distance: select both endpoints · Terrain/slope: unavailable'
      : 'Planar distance: unavailable (uncalibrated raster) · Terrain/slope: unavailable';
  });

  readonly selectedRecord = computed<ScienceMarker | null>(() => {
    const id = this.mission.selectedMarkerId();
    if (!id) {
      return null;
    }
    return this.mission.markers().find((m) => m.id === id) ?? null;
  });

  readonly selectedScienceLabel = computed(() => {
    const rec = this.selectedRecord();
    if (!rec) {
      return 'None selected';
    }
    switch (rec.positionStatus) {
      case 'verified':
        return `${rec.name} (Verified image position)`;
      case 'illustrative':
        return `${rec.name} (Illustrative pin — not exact tie-point)`;
      case 'unavailable':
        return `${rec.name} (Regional contextual record — not located on this image)`;
    }
  });

  readonly observationCount = computed(() => this.observations().length);

  readonly observationLabel = computed(() => {
    const count = this.observationCount();
    if (count === 0) {
      return '0 in session';
    }
    return `${count} in session (current/imported state; save or export to persist)`;
  });

  requestTab(tab: MissionWorkflowTab): void {
    this.navigateTab.emit(tab);
  }
}
