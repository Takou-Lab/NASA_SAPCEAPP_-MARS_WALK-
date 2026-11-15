import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import { testImage } from '../core/fixtures.spec-helper';
import { NotebookComponent } from './notebook.component';

describe('NotebookComponent', () => {
  let fixture: ComponentFixture<NotebookComponent>;
  let component: NotebookComponent;
  let service: MissionService;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotebookComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MissionService);
    http = TestBed.inject(HttpTestingController);
    const initialized = service.initialize();
    http.expectOne((request) => request.url.endsWith('/data/manifest.json')).flush({
      ...testImage(),
      width: 1000,
      height: 1000,
    });
    await Promise.resolve();
    http.expectOne((request) => request.url.endsWith('/data/markers.json')).flush([]);
    await initialized;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('creates notebook with empty draft and disabled submit', () => {
    expect(component).toBeTruthy();
    expect(component.draftText()).toBe('');
    expect(component.isDraftEmpty()).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.submit-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('rejects whitespace-only text without calling addObservation', () => {
    component.setDraftText('   \n  ');
    fixture.detectChanges();

    const spy = vi.spyOn(service, 'addObservation');
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
    expect(component.feedback()?.type).toBe('error');
    expect(component.draftText()).toBe('   \n  '); // preserved
  });

  it('saves valid observation, clears draft text, and updates list', () => {
    component.setDraftText('Discovered cross-stratified sulfate ridges');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.draftText()).toBe(''); // Cleared upon success
    expect(component.feedback()?.type).toBe('success');
    expect(service.observations()).toHaveLength(1);
    expect(service.observations()[0].text).toBe('Discovered cross-stratified sulfate ridges');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Discovered cross-stratified sulfate ridges');
  });

  it('preserves draft text in editor if storage fails', () => {
    component.setDraftText('Valuable geological observation that must not be lost');
    fixture.detectChanges();

    // Mock service returning failure
    vi.spyOn(service, 'addObservation').mockReturnValue({
      ok: false,
      error: 'Simulated quota exceeded error',
    });

    component.onSubmit();
    fixture.detectChanges();

    // The draft text MUST remain in the component state
    expect(component.draftText()).toBe('Valuable geological observation that must not be lost');
    expect(component.feedback()?.type).toBe('error');
    expect(component.feedback()?.message).toContain('Simulated quota exceeded');
  });

  it('attaches route start location when enabled', () => {
    service.setMode('start');
    service.applyMapPoint({ x: 340, y: 520 });
    fixture.detectChanges();

    expect(component.hasStartPoint()).toBe(true);
    component.toggleAttachStart();
    expect(component.attachStartLocation()).toBe(true);

    component.setDraftText('Note at EVA start');
    component.onSubmit();

    expect(service.observations()[0].position).toEqual({ x: 340, y: 520 });
  });
});
