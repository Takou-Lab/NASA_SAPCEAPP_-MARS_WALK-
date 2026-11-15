import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import manifest from '../../../../public/data/manifest.json';
import markers from '../../../../public/data/markers.json';
import { MissionService } from '../../core/mission.service';
import { PwaService } from '../../core/pwa.service';
import { ThemeService } from '../theme.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let service: MissionService;
  let pwaService: PwaService;
  let http: HttpTestingController;
  let initSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    initSpy = vi.spyOn(PwaService.prototype, 'initialize').mockResolvedValue();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        MissionService,
        ThemeService,
        PwaService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MissionService);
    pwaService = TestBed.inject(PwaService);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates header, displays brand title, and never initializes PwaService', () => {
    expect(component).toBeTruthy();
    expect(initSpy).not.toHaveBeenCalled();
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

  it('distinguishes metadata, network, and offline pack states and reserves .status-ready strictly for verified offline packs', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const metaPill = () => compiled.querySelector('.metadata-pill') as HTMLElement;
    const netPill = () => compiled.querySelector('.network-pill') as HTMLElement;
    const offlinePill = () => compiled.querySelector('.offline-pill') as HTMLElement;

    // Initial loading state + online + checking offline pack
    pwaService.online.set(true);
    pwaService.state.set('checking');
    fixture.detectChanges();

    expect(metaPill().textContent?.trim()).toBe('Metadata: Loading…');
    expect(metaPill().classList.contains('status-loading')).toBe(true);
    expect(metaPill().classList.contains('status-ready')).toBe(false);
    expect(netPill().textContent?.trim()).toBe('Network: Online');
    expect(netPill().classList.contains('status-neutral')).toBe(true);
    expect(netPill().classList.contains('status-ready')).toBe(false);
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Checking…');
    expect(offlinePill().classList.contains('status-loading')).toBe(true);
    expect(offlinePill().classList.contains('status-ready')).toBe(false);

    // Loaded metadata uses .status-info, NOT .status-ready
    const initPromise = service.initialize();
    http.expectOne((req) => req.url.endsWith('/data/manifest.json')).flush(manifest);
    await Promise.resolve();
    http.expectOne((req) => req.url.endsWith('/data/markers.json')).flush(markers);
    await initPromise;
    pwaService.state.set('not-prepared');
    fixture.detectChanges();

    expect(metaPill().textContent?.trim()).toBe('Metadata: Loaded');
    expect(metaPill().classList.contains('status-info')).toBe(true);
    expect(metaPill().classList.contains('status-ready')).toBe(false);
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Not Prepared');
    expect(offlinePill().classList.contains('status-neutral')).toBe(true);
    expect(offlinePill().classList.contains('status-ready')).toBe(false);
    expect(compiled.querySelectorAll('.status-ready')).toHaveLength(0);

    // Offline network + preparing progress + unsupported + error
    pwaService.online.set(false);
    pwaService.state.set('preparing');
    pwaService.progress.set({ completed: 2, total: 5 });
    fixture.detectChanges();
    expect(netPill().textContent?.trim()).toBe('Network: Offline');
    expect(netPill().classList.contains('status-loading')).toBe(true);
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Preparing (2/5)');
    expect(offlinePill().classList.contains('status-ready')).toBe(false);

    pwaService.progress.set(null);
    fixture.detectChanges();
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Preparing…');

    pwaService.state.set('unsupported');
    fixture.detectChanges();
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Unavailable');
    expect(offlinePill().classList.contains('status-neutral')).toBe(true);
    expect(offlinePill().classList.contains('status-ready')).toBe(false);

    // Only pwa.state() === 'ready' gets .status-ready
    pwaService.state.set('ready');
    fixture.detectChanges();
    expect(offlinePill().textContent?.trim()).toBe('Offline Pack: Verified');
    expect(offlinePill().classList.contains('status-ready')).toBe(true);
    expect(compiled.querySelectorAll('.status-ready')).toHaveLength(1);
    http.verify();
  });

  it('renders metadata unavailable and error labels clearly', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const metaPill = () => compiled.querySelector('.metadata-pill') as HTMLElement;

    const initUnavailable = service.initialize();
    http
      .expectOne((req) => req.url.endsWith('/data/manifest.json'))
      .flush('', { status: 404, statusText: 'Not Found' });
    await initUnavailable;
    fixture.detectChanges();
    expect(metaPill().textContent?.trim()).toBe('Metadata: Unavailable');
    expect(metaPill().classList.contains('status-error')).toBe(true);
    expect(metaPill().classList.contains('status-ready')).toBe(false);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        MissionService,
        ThemeService,
        PwaService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    const errFixture = TestBed.createComponent(HeaderComponent);
    const errService = TestBed.inject(MissionService);
    const errHttp = TestBed.inject(HttpTestingController);
    const initErr = errService.initialize();
    errHttp
      .expectOne((req) => req.url.endsWith('/data/manifest.json'))
      .flush('', { status: 500, statusText: 'Server Error' });
    await initErr;
    errFixture.detectChanges();
    const errMeta = errFixture.nativeElement.querySelector('.metadata-pill') as HTMLElement;
    expect(errMeta.textContent?.trim()).toBe('Metadata: Error');
    expect(errMeta.classList.contains('status-error')).toBe(true);
    errHttp.verify();
  });

  it('shows conditional PWA flag pills only when real states exist and keeps button count at 5', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.pwa-flag-pill')).toHaveLength(0);
    expect(compiled.querySelectorAll('button')).toHaveLength(5);

    pwaService.canInstall.set(true);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Install Available');
    expect(compiled.querySelectorAll('button')).toHaveLength(5);

    pwaService.updateAvailable.set(true);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Update Waiting (save work first)');
    expect(compiled.querySelectorAll('button')).toHaveLength(5);

    pwaService.state.set('error');
    pwaService.message.set('Cache write failed.');
    fixture.detectChanges();
    const offlinePill = compiled.querySelector('.offline-pill') as HTMLElement;
    const alertPill = compiled.querySelector('.pwa-flag-pill[role="alert"]') as HTMLElement;
    expect(offlinePill.textContent?.trim()).toBe('Offline Pack: Error');
    expect(offlinePill.classList.contains('status-error')).toBe(true);
    expect(alertPill.textContent).toContain(
      'Cache write failed. — Save/export unsaved work first; retry preparation while connected.',
    );
    expect(compiled.querySelectorAll('button')).toHaveLength(5);
  });
});
