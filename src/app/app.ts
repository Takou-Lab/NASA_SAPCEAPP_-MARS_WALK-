import { Component, inject } from '@angular/core';
import { MissionService } from './core/mission.service';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly mission = inject(MissionService);
  constructor() {
    void this.mission.initialize();
  }
}
