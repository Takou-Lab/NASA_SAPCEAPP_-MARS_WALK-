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
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush({
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

  it('updates draftText from native textarea input and clears textarea on submit', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('#obs-input') as HTMLTextAreaElement;
    const submitBtn = compiled.querySelector('.submit-btn') as HTMLButtonElement;

    textarea.value = 'Layered ridge texture near crater rim';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.draftText()).toBe('Layered ridge texture near crater rim');
    expect(submitBtn.disabled).toBe(false);

    const form = compiled.querySelector('form.note-form') as HTMLFormElement;
    const submitSpy = vi.spyOn(component, 'onSubmit');
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);
    fixture.detectChanges();

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(component.draftText()).toBe('');
    expect(textarea.value).toBe('');
  });

  it('formats timestamps safely and renders observation entries without tabindex', () => {
    expect(component.formatTimestamp('not-a-valid-date')).toBe('not-a-valid-date');
    const iso = '2026-11-15T03:56:38.000Z';
    const expectedFormatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
    expect(component.formatTimestamp(iso)).toBe(expectedFormatted);

    component.setDraftText('Polygonal fracture pattern observed');
    component.onSubmit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const svgs = Array.from(compiled.querySelectorAll('svg'));
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }

    const entry = compiled.querySelector('.obs-entry') as HTMLElement;
    expect(entry).toBeTruthy();
    expect(entry.hasAttribute('tabindex')).toBe(false);

    const timestampEl = entry.querySelector('.entry-timestamp') as HTMLElement;
    expect(timestampEl.textContent?.trim()).toBe(
      component.formatTimestamp(service.observations()[0].createdAt),
    );
  });

  it('updates nextActionHint across draft input and keeps draft and save hint on storage failure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.submit-btn') as HTMLButtonElement;
    const banner = () => compiled.querySelector('.next-step-banner')?.textContent?.trim();

    expect(submitBtn.getAttribute('aria-label')?.toLowerCase()).toContain('save observation');
    expect(banner()).toBe(
      'Next step: Enter a geological or traverse observation above, then select Save Observation.',
    );

    component.setDraftText('Fracture fill mineral band near ridge crest');
    fixture.detectChanges();
    expect(banner()).toBe(
      'Next step: Select Save Observation to persist your draft to the local mission log.',
    );

    vi.spyOn(service, 'addObservation').mockReturnValue({
      ok: false,
      error: 'Simulated storage quota error',
    });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.draftText()).toBe('Fracture fill mineral band near ridge crest');
    expect(banner()).toBe(
      'Next step: Select Save Observation to persist your draft to the local mission log.',
    );

    vi.restoreAllMocks();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.draftText()).toBe('');
    expect(banner()).toBe(
      'Next step: Enter a geological or traverse observation above, then select Save Observation.',
    );
  });
});

describe('NotebookComponent metadata state banners', () => {
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
  });

  afterEach(() => http.verify());

  it('renders loading banner and preserves draft hint before metadata resolves', () => {
    component.setDraftText('Early draft while loading');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.notebook-state');
    expect(state?.getAttribute('role')).toBe('status');
    expect(state?.textContent).toContain('drafts remain preserved');
    expect(compiled.querySelector('.next-step-banner')?.textContent?.trim()).toBe(
      'Mission metadata is not ready; you can draft notes here, and save once raster metadata is loaded.',
    );
    expect(component.draftText()).toBe('Early draft while loading');
  });

  it('renders unavailable banner and preserves typed draft when manifest returns 404', async () => {
    component.setDraftText('Draft entered without metadata');
    const initialized = service.initialize();
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush('Not found', { status: 404, statusText: 'Not Found' });
    await initialized;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.notebook-state');
    expect(service.dataStatus()).toBe('unavailable');
    expect(state?.getAttribute('role')).toBe('status');
    expect(state?.textContent).toContain('Image data has not been supplied');
    expect(state?.textContent).toContain('drafts remain preserved');
    expect(component.draftText()).toBe('Draft entered without metadata');
  });

  it('renders error alert banner and preserves draft when manifest load fails', async () => {
    component.setDraftText('Draft retained on error');
    const initialized = service.initialize();
    http
      .expectOne((request) => request.url.endsWith('/data/manifest.json'))
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    await initialized;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector('.notebook-state-error');
    expect(service.dataStatus()).toBe('error');
    expect(state?.getAttribute('role')).toBe('alert');
    expect(state?.textContent).toContain('Image manifest could not be loaded or validated.');
    expect(state?.textContent).toContain('drafts remain preserved');
    expect(component.draftText()).toBe('Draft retained on error');
  });
});
