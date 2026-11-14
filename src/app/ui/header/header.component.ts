import { Component, computed, inject } from '@angular/core';
import { LayerId } from '../../core/models';
import { MissionService } from '../../core/mission.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private missionService = inject(MissionService);
  private themeService = inject(ThemeService);

  readonly dataStatus = this.missionService.dataStatus;
  readonly image = this.missionService.image;
  readonly layers = this.missionService.layers;
  readonly theme = this.themeService.theme;

  readonly statusLabel = computed(() => {
    switch (this.dataStatus()) {
      case 'ready':
        return 'Data Ready';
      case 'loading':
        return 'Loading Data...';
      case 'unavailable':
        return 'Data Unavailable';
      case 'error':
        return 'Data Error';
    }
  });

  toggleLayer(layerId: LayerId): void {
    const current = this.layers()[layerId];
    this.missionService.setLayer(layerId, !current);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onExport(): void {
    this.missionService.exportMission();
  }
}
