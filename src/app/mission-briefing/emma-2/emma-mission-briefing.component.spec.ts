import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmmaMissionBriefingComponent } from './emma-mission-briefing.component';
import { MissionService } from '../../core/mission.service';
import { of } from 'rxjs';

class MockMissionService {
  image() { return null; }
  markers() { return [{ id: 'm1', name: 'Marker 1' }]; }
  route() { return { start: 'A', destination: 'B' }; }
  selectedMarkerId() { return 'm1'; }
  observations() { return [{ id: 1 }]; }
}

describe('EmmaMissionBriefingComponent', () => {
  let component: EmmaMissionBriefingComponent;
  let fixture: ComponentFixture<EmmaMissionBriefingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmmaMissionBriefingComponent],
      providers: [{ provide: MissionService, useClass: MockMissionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmmaMissionBriefingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute checklist correctly', () => {
    const checklist = component.checklist();
    expect(checklist.startAndDestination).toBeTrue();
    expect(checklist.markerSelected).toBeTrue();
    expect(checklist.observationPresent).toBeTrue();
  });
});
