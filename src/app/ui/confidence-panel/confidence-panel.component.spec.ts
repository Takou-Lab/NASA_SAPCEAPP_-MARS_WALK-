import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from '../../core/mission.service';
import { ImageManifest, ScienceMarker } from '../../core/models';
import { ConfidencePanelComponent } from './confidence-panel.component';

describe('ConfidencePanelComponent', () => {
  let fixture: ComponentFixture<ConfidencePanelComponent>;
  let component: ConfidencePanelComponent;
  let service: MissionService;

  const mockManifest: ImageManifest = {
    schemaVersion: 1,
    imageRef: 'gale_hirise_01',
    assetPath: 'data/imagery/gale.png',
    width: 1200,
    height: 900,
    coordinateSystem: 'image-pixels-bottom-left',
    source: {
      title: 'HiRISE ESP_037146_1755',
      url: 'https://hirise.lpl.arizona.edu/ESP_037146_1755',
      credit: 'NASA/JPL/UArizona',
    },
    observationDate: '2024-06-01',
    coverageStatus: 'verified-aoi',
    limitations: ['2D visible only, no hyperspectral data'],
    calibration: {
      verified: true,
      metersPerPixel: 0.25,
      sourceUrl: 'https://hirise.lpl.arizona.edu/calibration',
      method: 'Spacecraft geometry',
    },
  };

  const sampleMarker: ScienceMarker = {
    id: 'm1',
    name: 'Sulphate Ridge 01',
    imageRef: 'gale_hirise_01',
    position: { x: 300, y: 400 },
    positionStatus: 'verified',
    instrument: 'Mastcam',
    date: 'Sol 3120',
    finding: 'Distinct polygonal boxwork veins in layered sulfate bedrock',
    evidenceType: 'measured',
    source: {
      title: 'Curiosity Mastcam Sol 3120',
      url: 'https://mars.nasa.gov/msl/multimedia/images/',
      credit: 'NASA/JPL-Caltech/MSSS',
    },
    limitations: ['Sample taken from rover mast perspective'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfidencePanelComponent],
      providers: [MissionService],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfidencePanelComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MissionService);
    service.setImageManifest(mockManifest);
    service.setMarkers([sampleMarker]);
    fixture.detectChanges();
  });

  it('displays Visual Review Only badge and never displays a SAFE badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Visual Review Only');
    expect(compiled.querySelector('.badge-safe')).toBeNull();
    expect(compiled.textContent?.toLowerCase()).not.toContain('badge-safe');
  });

  it('shows Distance unavailable when endpoints are missing', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.formattedDistance()).toBe('Distance unavailable');
    expect(compiled.querySelector('.metric-value')?.textContent).toContain('Distance unavailable');
  });

  it('displays derived planar distance once start and destination are set', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 0, y: 0 });
    service.setMode('destination');
    service.applyMapPoint({ x: 400, y: 0 }); // 400 px * 0.25 m/px = 100 meters
    fixture.detectChanges();

    expect(component.formattedDistance()).toBe('100.0 m');
  });

  it('renders selected science marker details and allows deselection', () => {
    service.selectMarker('m1');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.marker-detail-card')).toBeTruthy();
    expect(compiled.textContent).toContain('Selected Target: Sulphate Ridge 01');
    expect(compiled.textContent).toContain('Mastcam');

    // Deselect
    component.clearMarkerSelection();
    fixture.detectChanges();
    expect(compiled.querySelector('.marker-detail-card')).toBeNull();
  });
});
