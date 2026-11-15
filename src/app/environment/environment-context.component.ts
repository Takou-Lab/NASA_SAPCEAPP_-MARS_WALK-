import { Component, OnInit, inject } from '@angular/core';
import { EnvironmentService } from '../core/environment.service';
@Component({
  selector: 'app-environment-context',
  standalone: true,
  templateUrl: './environment-context.component.html',
  styleUrl: './environment-context.component.scss',
})
export class EnvironmentContextComponent implements OnInit {
  readonly environment = inject(EnvironmentService);
  ngOnInit(): void {
    this.environment.initialize();
  }
}
