import { MissionBriefingComponent } from '../../mission-briefing/mission-briefing.component';
import { Component } from '@angular/core';
import { ScienceContextComponent } from '../../science/science-context.component';
import { ExplorationConfidenceComponent } from '../../evidence/exploration-confidence.component';
import { ImagePassportComponent } from '../../evidence/image-passport.component';

@Component({
  selector: 'app-confidence-panel',
  standalone: true,
  imports: [
    MissionBriefingComponent,
    ScienceContextComponent,
    ExplorationConfidenceComponent,
    ImagePassportComponent,
  ],
  templateUrl: './confidence-panel.component.html',
  styleUrl: './confidence-panel.component.scss',
})
export class ConfidencePanelComponent {}
