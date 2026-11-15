import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from '../../core/mission.service';
import { ThemeService } from '../theme.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let service: MissionService;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [MissionService, ThemeService, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MissionService);
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('creates header and displays brand title', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('MARSWALK');
  });

  it('labels the unsupported coordinate grid as unavailable and keeps it disabled', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Coordinate grid unavailable"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Grid unavailable');
    button.click();
    expect(service.layers().grid).toBe(false);
  });

  it('toggles theme between dark and light via button', () => {
    const initialTheme = component.theme();
    component.toggleTheme();
    expect(component.theme()).not.toBe(initialTheme);
  });

  it('marks decorative SVGs aria-hidden while preserving button accessible names', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const assertSvgsHidden = () => {
      const svgs = Array.from(compiled.querySelectorAll('svg'));
      expect(svgs.length).toBeGreaterThanOrEqual(6);
      for (const svg of svgs) {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
      }
    };

    assertSvgsHidden();
    component.toggleTheme();
    fixture.detectChanges();
    assertSvgsHidden();

    const buttons = Array.from(compiled.querySelectorAll('button'));
    expect(buttons).toHaveLength(5);
    for (const button of buttons) {
      expect((button.getAttribute('aria-label') ?? '').trim().length).toBeGreaterThan(0);
    }

    expect(compiled.querySelector('button[aria-label="Toggle Imagery Layer"]')).toBeTruthy();
    expect(
      compiled.querySelector('button[aria-label="Toggle Science Markers Layer"]'),
    ).toBeTruthy();
    expect(compiled.querySelector('button[aria-label="Coordinate grid unavailable"]')).toBeTruthy();
    expect(compiled.querySelector('button[aria-label="Export mission record JSON"]')).toBeTruthy();
    expect(compiled.querySelector('.theme-toggle-btn')?.getAttribute('aria-label')).toBeTruthy();
  });
});
