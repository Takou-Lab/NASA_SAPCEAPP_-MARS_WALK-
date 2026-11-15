import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../../core/mission.service';

/**
 * Read‑only mission briefing component for Emma 2.
 * Displays the scientific question, evidence image, marker list, and a truthful checklist.
 * No mutations, storage, or navigation actions are performed.
 */
@Component({
  selector: 'app-emma-mission-briefing',
  standalone: true,
  imports: [],
  templateUrl: './emma-mission-briefing.component.html',
  styleUrl: './emma-mission-briefing.component.scss',
})
export class EmmaMissionBriefingComponent {
  private readonly mission = inject(MissionService);

  // Briefing title/question
  readonly title = "What evidence supports the interpretation that ancient groundwater helped form Mount Sharp's boxwork?";

  // Image source (readonly)
  readonly imageSource = computed(() => {
    const img = this.mission.image();
    return img ? { url: img.source.url, title: img.source.title, credit: img.source.credit } : null;
  });

  // Markers (science records)
  readonly markers = computed(() => this.mission.markers());

  // Truthful checklist (read‑only, computed)
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
