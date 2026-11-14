import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('initializes and applies default theme', () => {
    expect(service.theme()).toBeDefined();
    const currentTheme = service.theme();
    expect(document.documentElement.getAttribute('data-theme')).toBe(currentTheme);
  });

  it('toggles theme between dark and light', () => {
    const initial = service.theme();
    service.toggleTheme();
    const updated = service.theme();
    expect(updated).not.toBe(initial);
    expect(document.documentElement.getAttribute('data-theme')).toBe(updated);
    expect(localStorage.getItem('marswalk_theme')).toBe(updated);

    service.toggleTheme();
    expect(service.theme()).toBe(initial);
  });
});
