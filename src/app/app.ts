import { Component, inject } from '@angular/core';
import { MissionService } from './core/mission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly mission = inject(MissionService);
  constructor() {
    void this.mission.initialize();
  }
}
