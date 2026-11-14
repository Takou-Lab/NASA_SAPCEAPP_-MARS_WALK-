import { Component, computed, inject, signal } from '@angular/core';
import { MAX_MISSION_IMPORT_BYTES, MissionService } from './core/mission.service';
import { MapComponent } from './map/map.component';
import { Viewer3dComponent } from './viewer3d/viewer3d.component';
import { ScienceContextComponent } from './science/science-context.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent, ScienceContextComponent, Viewer3dComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly mission = inject(MissionService);
  readonly viewerOpen = signal(false);
  private readonly missionJson = signal<string | null>(null);
  private fileRequest = 0;
  readonly missionFileName = signal<string | null>(null);
  readonly readingMission = signal(false);
  readonly transferMessage = signal<string | null>(null);
  readonly hasMissionFile = computed(() => this.missionJson() !== null);
  constructor() {
    void this.mission.initialize();
  }
  async selectMissionFile(event: Event): Promise<void> {
    const request = ++this.fileRequest;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.missionJson.set(null);
    this.missionFileName.set(file?.name ?? null);
    this.transferMessage.set(null);
    this.readingMission.set(false);
    if (!file) return;
    if (file.size > MAX_MISSION_IMPORT_BYTES) {
      this.transferMessage.set('Mission files must be 1 MiB or smaller.');
      return;
    }
    this.readingMission.set(true);
    try {
      const raw = await file.text();
      if (request === this.fileRequest) this.missionJson.set(raw);
    } catch {
      if (request === this.fileRequest)
        this.transferMessage.set('The selected file could not be read.');
    } finally {
      if (request === this.fileRequest) this.readingMission.set(false);
    }
  }
  importSelectedMission(): void {
    const raw = this.missionJson();
    if (raw === null || this.readingMission() || this.mission.dataStatus() !== 'ready') return;
    const result = this.mission.importMission(raw);
    this.transferMessage.set(
      result.ok ? 'Mission imported and saved on this device.' : (result.error ?? 'Import failed.'),
    );
  }
}
