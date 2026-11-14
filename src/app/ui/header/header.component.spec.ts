import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from '../../core/mission.service';
import { ThemeService } from '../../core/theme.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let service: MissionService;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [MissionService, ThemeService],
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

  it('toggles map layers via MissionService', () => {
    expect(service.layers().grid).toBe(false);
    component.toggleLayer('grid');
    expect(service.layers().grid).toBe(true);
    component.toggleLayer('grid');
    expect(service.layers().grid).toBe(false);
  });

  it('toggles theme between dark and light via button', () => {
    const initialTheme = component.theme();
    component.toggleTheme();
    expect(component.theme()).not.toBe(initialTheme);
  });
});
