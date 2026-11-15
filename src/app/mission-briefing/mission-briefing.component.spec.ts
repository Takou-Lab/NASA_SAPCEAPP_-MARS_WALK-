import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionBriefingComponent } from './mission-briefing.component';
import { MissionService } from '../core/mission.service';
import { of } from 'rxjs';

/** Minimal stub for MissionService exposing readonly signals */
class MissionServiceStub {
  private readonly _image = {
    source: { url: 'https://example.com/image', title: 'Example Image', credit: 'NASA' },
  } as any;
  readonly image = () => this._image;
  readonly markers = () => [{ id: 'm1', name: 'Marker 1', evidenceType: 'typeA' }];
  readonly route = () => ({ start: { x: 1, y: 1 }, destination: { x: 2, y: 2 } } as any);
  readonly selectedMarkerId = () => 'm1';
  readonly observations = () => [{ id: 'o1', text: 'note', position: null }];
}

describe('MissionBriefingComponent', () => {
  let component: MissionBriefingComponent;
  let fixture: ComponentFixture<MissionBriefingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionBriefingComponent],
      providers: [{ provide: MissionService, useClass: MissionServiceStub }],
    }).compileComponents();
    fixture = TestBed.createComponent(MissionBriefingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute checklist truthfully', () => {
    const checklist = component.checklist();
    expect(checklist.startAndDestination).toBeTrue();
    expect(checklist.markerSelected).toBeTrue();
    expect(checklist.observationPresent).toBeTrue();
  });
});
