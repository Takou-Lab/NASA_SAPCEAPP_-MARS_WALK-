import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';
import type { ScienceMarker } from '../core/models';

export interface SafeBriefingRecord {
  readonly id: string;
  readonly name: string;
  readonly instrument: string | null;
  readonly date: string | null;
  readonly finding: string;
  readonly evidenceType: ScienceMarker['evidenceType'];
  readonly positionStatus: ScienceMarker['positionStatus'];
  readonly sourceTitle: string;
  readonly sourceCredit: string;
  readonly safeSourceUrl: string | null;
  readonly limitations: readonly string[];
}

/**
 * Standalone, read-only mission briefing component for Emma 2.
 * Presents the scientific question, MRO/HiRISE and Curiosity/MSL evidence,
 * explicit scientific/spatial limitations, workflow guidance, and a truthful
 * reactive structural checklist. Performs zero mutations, storage calls, or navigation.
 */
@Component({
  selector: 'app-mission-briefing',
  standalone: true,
  imports: [],
  templateUrl: './mission-briefing.component.html',
  styleUrl: './mission-briefing.component.scss',
})
export class MissionBriefingComponent {
  readonly mission = inject(MissionService);

  readonly title =
    "What evidence supports the interpretation that ancient groundwater helped form Mount Sharp's boxwork?";

  readonly dataStatus = computed(() => this.mission.dataStatus());
  readonly dataError = computed(() => this.mission.dataError());

  readonly imageInfo = computed(() => {
    const img = this.mission.image();
    if (!img) {
      return null;
    }
    return {
      imageRef: img.imageRef,
      title: img.source.title,
      credit: img.source.credit,
      safeUrl: this.toSafeExternalUrl(img.source.url),
      observationDate: img.observationDate,
      coverageStatus: img.coverageStatus,
      calibrationVerified: img.calibration.verified,
      metersPerPixel: img.calibration.metersPerPixel,
      limitations: img.limitations,
    };
  });

  readonly records = computed<readonly SafeBriefingRecord[]>(() =>
    this.mission.markers().map((marker) => ({
      id: marker.id,
      name: marker.name,
      instrument: marker.instrument,
      date: marker.date,
      finding: marker.finding,
      evidenceType: marker.evidenceType,
      positionStatus: marker.positionStatus,
      sourceTitle: marker.source.title,
      sourceCredit: marker.source.credit,
      safeSourceUrl: this.toSafeExternalUrl(marker.source.url),
      limitations: marker.limitations,
    })),
  );

  readonly hasStartAndDestination = computed(() => {
    const route = this.mission.route();
    return route.start !== null && route.destination !== null;
  });

  readonly selectedRecord = computed<SafeBriefingRecord | null>(() => {
    const selectedId = this.mission.selectedMarkerId();
    if (!selectedId) {
      return null;
    }
    return this.records().find((record) => record.id === selectedId) ?? null;
  });

  readonly hasSelectedRecord = computed(() => this.selectedRecord() !== null);

  readonly observationCount = computed(() => this.mission.observations().length);
  readonly hasObservation = computed(() => this.observationCount() > 0);

  /**
   * Truthful structural checklist over readonly signals.
   * Reflects current state presence only; never implies a safe or completed mission.
   */
  readonly checklist = computed(() => ({
    startAndDestination: this.hasStartAndDestination(),
    markerSelected: this.hasSelectedRecord(),
    observationPresent: this.hasObservation(),
  }));

  toSafeExternalUrl(rawUrl: string | null | undefined): string | null {
    if (!rawUrl) {
      return null;
    }
    try {
      const parsed = new URL(rawUrl.trim());
      return parsed.protocol === 'https:' ? parsed.toString() : null;
    } catch {
      return null;
    }
  }
}
