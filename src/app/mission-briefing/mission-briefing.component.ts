import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';

/**
 * Read‑only mission briefing for Emma 2.
 * Presents the scientific question, evidence, limits and a truthful checklist.
 * No mutations, storage or navigation actions are performed here.
 */
@Component({
  selector: 'app-mission-briefing',
  standalone: true,
  imports: [],
  templateUrl: './mission-briefing.component.html',
  styleUrl: './mission-briefing.component.scss',
})
export class MissionBriefingComponent {
  private readonly mission = inject(MissionService);

  // === Briefing data ====================================================
  readonly title = 'What evidence supports the interpretation that ancient groundwater helped form Mount Sharp\'s boxwork?';

  // Pull image source info (readonly)
  readonly imageSource = computed(() => {
    const img = this.mission.image();
    return img ? { url: img.source.url, title: img.source.title, credit: img.source.credit } : null;
  });

  // Markers (science records) – displayed as a simple list
  readonly markers = computed(() => this.mission.markers());

  // === Truthful checklist (read‑only, computed) =========================
  private readonly hasStart = computed(() => !!this.mission.route().start);
  private readonly hasDestination = computed(() => !!this.mission.route().destination);
  private readonly hasStartAndDest = computed(() => this.hasStart() && this.hasDestination);

  private readonly hasSelectedMarker = computed(() => {
    const id = this.mission.selectedMarkerId();
    return !!id && this.mission.markers().some(m => m.id === id);
  });

  private readonly hasObservations = computed(() => this.mission.observations().length > 0);

  /** Checklist truth values – never imply success, only presence of inputs. */
  readonly checklist = computed(() => ({
    startAndDestination: this.hasStartAndDest(),
    markerSelected: this.hasSelectedMarker(),
    observationPresent: this.hasObservations(),
  }));
}
