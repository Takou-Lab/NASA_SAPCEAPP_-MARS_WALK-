import { Component, inject } from '@angular/core';
import { MissionService } from './core/mission.service';
import { ShellComponent } from './ui/shell/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly mission = inject(MissionService);

  constructor() {
    void this.mission.initialize();
  }
}
