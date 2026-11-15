import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from '../core/mission.service';
import { testImage } from '../core/fixtures.spec-helper';
import { RoutePlannerComponent } from './route-planner.component';

describe('RoutePlannerComponent', () => {
  let fixture: ComponentFixture<RoutePlannerComponent>;
  let component: RoutePlannerComponent;
  let service: MissionService;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RoutePlannerComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutePlannerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MissionService);
    http = TestBed.inject(HttpTestingController);
    const initialized = service.initialize();
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush({
        ...testImage(),
        width: 200,
        height: 200,
      });
    await Promise.resolve();
    http.expectOne((request) => request.url.endsWith('/data/markers.json')).flush([]);
    await initialized;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('creates component and defaults to inspect mode', () => {
    expect(component).toBeTruthy();
    expect(component.mode()).toBe('inspect');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mode-btn.active')?.textContent).toContain('Inspect');
  });

  it('updates mode on button click', () => {
    component.setMode('start');
    fixture.detectChanges();
    expect(service.mode()).toBe('start');
    expect(component.mode()).toBe('start');

    component.setMode('waypoint');
    fixture.detectChanges();
    expect(service.mode()).toBe('waypoint');

    component.setMode('destination');
    fixture.detectChanges();
    expect(service.mode()).toBe('destination');
  });

  it('undo and clear button disabled states reflect route state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const undoBtn = compiled.querySelector('.undo-btn') as HTMLButtonElement;
    const clearBtn = compiled.querySelector('.clear-btn') as HTMLButtonElement;

    // Initially empty
    expect(undoBtn.disabled).toBe(true);
    expect(clearBtn.disabled).toBe(true);

    // Apply a point
    service.setMode('start');
    service.applyMapPoint({ x: 10, y: 10 });
    fixture.detectChanges();

    expect(undoBtn.disabled).toBe(false);
    expect(clearBtn.disabled).toBe(false);

    // Click undo
    component.undo();
    fixture.detectChanges();

    expect(service.route().start).toBeNull();
    expect(undoBtn.disabled).toBe(true);
  });

  it('clearing route triggers feedback and can be undone', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 50, y: 50 });
    fixture.detectChanges();

    component.clear();
    fixture.detectChanges();

    expect(service.route().start).toBeNull();
    expect(component.storageFeedback()?.message).toContain('Route cleared');

    // Undo restores the route
    component.undo();
    fixture.detectChanges();
    expect(service.route().start).toEqual({ x: 50, y: 50 });
  });

  it('saves and loads route through component controls', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 25, y: 75 });
    service.setMode('destination');
    service.applyMapPoint({ x: 125, y: 175 });
    fixture.detectChanges();

    component.save();
    fixture.detectChanges();
    expect(component.storageFeedback()?.type).toBe('success');

    // Clear
    service.clearRoute();
    fixture.detectChanges();
    expect(service.route().start).toBeNull();

    // Load back
    component.load();
    fixture.detectChanges();
    expect(service.route().start).toEqual({ x: 25, y: 75 });
    expect(service.route().destination).toEqual({ x: 125, y: 175 });
  });

  it('marks decorative svg icons aria-hidden and preserves button semantics', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const svgs = Array.from(compiled.querySelectorAll('svg'));
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }

    const modeBtns = Array.from(compiled.querySelectorAll('.mode-btn')) as HTMLButtonElement[];
    expect(modeBtns).toHaveLength(4);
    for (const btn of modeBtns) {
      expect(btn.type).toBe('button');
      expect(btn.getAttribute('aria-label')).toBeTruthy();
      expect(btn.hasAttribute('aria-pressed')).toBe(true);
    }

    const startBtn = compiled.querySelector('.mode-start') as HTMLButtonElement;
    startBtn.click();
    fixture.detectChanges();
    expect(component.mode()).toBe('start');
    expect(startBtn.getAttribute('aria-pressed')).toBe('true');

    const actionBtns = Array.from(
      compiled.querySelectorAll('.undo-btn, .clear-btn, .save-btn, .load-btn'),
    ) as HTMLButtonElement[];
    expect(actionBtns).toHaveLength(4);
    for (const btn of actionBtns) {
      expect(btn.type).toBe('button');
      const label = btn.getAttribute('aria-label')?.toLowerCase() ?? '';
      const visible = btn.querySelector('span')?.textContent?.trim().toLowerCase() ?? '';
      expect(label).toContain(visible);
    }
  });

  it('transitions nextActionHint reactively as start and destination are added and cleared', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const banner = () => compiled.querySelector('.next-step-banner')?.textContent?.trim();

    expect(banner()).toBe(
      'Next step: Select Start mode and click the map raster to set the EVA start point.',
    );

    service.setMode('start');
    service.applyMapPoint({ x: 15, y: 25 });
    fixture.detectChanges();
    expect(banner()).toBe(
      'Next step: Select Destination mode (or Waypoint) and click the map raster to complete the traverse.',
    );

    service.setMode('destination');
    service.applyMapPoint({ x: 120, y: 140 });
    fixture.detectChanges();
    expect(banner()).toBe(
      'Next step: Save Route locally for this raster or open Notebook to record field observations.',
    );

    component.clear();
    fixture.detectChanges();
    expect(banner()).toBe(
      'Next step: Select Start mode and click the map raster to set the EVA start point.',
    );
  });
});

describe('RoutePlannerComponent metadata state banners', () => {
  let fixture: ComponentFixture<RoutePlannerComponent>;
  let service: MissionService;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RoutePlannerComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutePlannerComponent);
    service = TestBed.inject(MissionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('renders loading banner and wait hint while raster metadata is loading', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.planner-state');
    expect(state?.getAttribute('role')).toBe('status');
    expect(state?.classList.contains('planner-state-error')).toBe(false);
    expect(compiled.querySelector('.next-step-banner')?.textContent?.trim()).toBe(
      'Wait for verified raster metadata before placing or loading route points.',
    );
  });

  it('renders unavailable status banner when manifest returns 404', async () => {
    const initialized = service.initialize();
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush('Not found', { status: 404, statusText: 'Not Found' });
    await initialized;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.planner-state');
    expect(service.dataStatus()).toBe('unavailable');
    expect(state?.getAttribute('role')).toBe('status');
    expect(state?.textContent).toContain('Image data has not been supplied');
    expect(compiled.querySelector('.next-step-banner')?.textContent?.trim()).toBe(
      'Wait for verified raster metadata before placing or loading route points.',
    );
  });

  it('renders error alert banner when manifest request fails', async () => {
    const initialized = service.initialize();
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    await initialized;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.planner-state-error');
    expect(service.dataStatus()).toBe('error');
    expect(state?.getAttribute('role')).toBe('alert');
    expect(state?.textContent).toContain('Image manifest could not be loaded or validated.');
    expect(compiled.querySelector('.next-step-banner')?.textContent?.trim()).toBe(
      'Wait for verified raster metadata before placing or loading route points.',
    );
  });
});
