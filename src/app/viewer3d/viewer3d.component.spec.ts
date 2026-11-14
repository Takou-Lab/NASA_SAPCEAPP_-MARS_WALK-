import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Viewer3dComponent } from './viewer3d.component';
import { MissionService } from '../core/mission.service';

describe('Viewer3dComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewer3dComponent],
      providers: [MissionService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('instantiates successfully', () => {
    const fixture = TestBed.createComponent(Viewer3dComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('displays mandatory prototype banner and terrain limitations', () => {
    const fixture = TestBed.createComponent(Viewer3dComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Prototype: 3D training view');
    expect(text).toContain('No verified terrain; elevation unavailable');
    expect(text).toContain('Vertical Exaggeration');
  });

  it('provides camera preset controls and reset button', () => {
    const fixture = TestBed.createComponent(Viewer3dComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.controls-toolbar button');
    const buttonTexts = Array.from(buttons).map((b: any) => b.textContent?.trim());

    expect(buttonTexts).toContain('Rehearsal View');
    expect(buttonTexts).toContain('Top-Down (Map)');
    expect(buttonTexts).toContain('Low Oblique');
    expect(buttonTexts).toContain('Reset View');
  });

  it('handles component teardown without throwing', () => {
    const fixture = TestBed.createComponent(Viewer3dComponent);
    fixture.detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });
});

