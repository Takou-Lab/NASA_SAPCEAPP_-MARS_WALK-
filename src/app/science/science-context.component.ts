import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';
import type { ScienceMarker } from '../core/models';

@Component({
  selector: 'app-science-context',
  standalone: true,
  templateUrl: './science-context.component.html',
  styleUrl: './science-context.component.scss',
})
export class ScienceContextComponent {
  readonly mission = inject(MissionService);

  readonly selectedRecord = computed<ScienceMarker | null>(
    () => this.mission.markers().find((m) => m.id === this.mission.selectedMarkerId()) ?? null,
  );

  selectRecord(id: string): void {
    this.mission.selectMarker(id);
  }

  clearSelection(): void {
    this.mission.selectMarker(null);
  }

  isSelected(id: string): boolean {
    return this.mission.selectedMarkerId() === id;
  }

  formatPositionStatus(record: ScienceMarker): string {
    if (record.positionStatus === 'unavailable' || record.position === null) {
      return 'Unavailable on this image (contextual record — no map pin)';
    }
    if (record.positionStatus === 'illustrative' && record.position) {
      return `Illustrative (${record.position.x}, ${record.position.y} px)`;
    }
    if (record.positionStatus === 'verified' && record.position) {
      return `Verified (${record.position.x}, ${record.position.y} px)`;
    }
    return 'Unavailable on this image';
  }

  safeExternalUrl(url: string): string | null {
    if (typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? url : null;
    } catch {
      return null;
    }
  }
}
