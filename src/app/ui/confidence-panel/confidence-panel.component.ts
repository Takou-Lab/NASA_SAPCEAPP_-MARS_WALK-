import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../../core/mission.service';
import { ScienceContextComponent } from '../../science/science-context.component';

@Component({
  selector: 'app-confidence-panel',
  standalone: true,
  imports: [ScienceContextComponent],
  templateUrl: './confidence-panel.component.html',
  styleUrl: './confidence-panel.component.scss',
})
export class ConfidencePanelComponent {
  private missionService = inject(MissionService);

  readonly image = this.missionService.image;
  readonly assessment = this.missionService.assessment;
  readonly formattedDistance = computed(() => {
    const meters = this.assessment().planarDistanceMeters;
    if (meters === null) {
      return 'Distance unavailable';
    }
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(1)} m`;
  });

}
