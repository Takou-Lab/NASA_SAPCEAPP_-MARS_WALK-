import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';
import type { ImageManifest } from '../core/models';
import { https } from '../core/validation';

@Component({
  selector: 'app-image-passport',
  standalone: true,
  templateUrl: './image-passport.component.html',
  styleUrl: './image-passport.component.scss',
})
export class ImagePassportComponent {
  readonly mission = inject(MissionService);

  readonly verifiedCalibration = computed(() => {
    const image = this.mission.image();
    if (!image) return null;
    const { calibration } = image;
    if (
      calibration.verified &&
      calibration.metersPerPixel !== null &&
      Number.isFinite(calibration.metersPerPixel)
    ) {
      return {
        metersPerPixel: calibration.metersPerPixel,
        method: calibration.method?.trim() ? calibration.method : 'Unavailable',
        rawSourceUrl: calibration.sourceUrl?.trim() ? calibration.sourceUrl : null,
        safeSourceUrl: this.safeUrl(calibration.sourceUrl),
      };
    }
    return null;
  });

  safeUrl(url: unknown): string | null {
    return https(url) ? url : null;
  }

  formatObservationDate(image: ImageManifest): string {
    return image.observationDate?.trim() ? image.observationDate : 'Unavailable';
  }
}
