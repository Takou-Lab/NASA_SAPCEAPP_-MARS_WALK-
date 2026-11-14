import { Component, inject } from '@angular/core';
import { MissionService } from './core/mission.service';
import { Viewer3dComponent } from './viewer3d/viewer3d.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Viewer3dComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly mission = inject(MissionService);
  constructor() {
    void this.mission.initialize();
  }
}
