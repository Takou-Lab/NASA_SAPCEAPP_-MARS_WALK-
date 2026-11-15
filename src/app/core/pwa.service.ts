import { Injectable, InjectionToken, inject, isDevMode, signal } from '@angular/core';

export const PWA_ENABLED = new InjectionToken('PWA_ENABLED', { factory: () => !isDevMode() });
export const PWA_WINDOW = new InjectionToken<Window | null>('PWA_WINDOW', {
  factory: () => typeof window === 'undefined' ? null : window,
});
export type OfflineState = 'checking' | 'unsupported' | 'not-prepared' | 'preparing' | 'ready' | 'error';
interface WorkerResult {
  done?: boolean; ready?: boolean; error?: string; version?: string; totalBytes?: number;
  progress?: { completed: number; total: number };
}
interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly browser = inject(PWA_WINDOW);
  private readonly enabled = inject(PWA_ENABLED);
  private registration: ServiceWorkerRegistration | null = null;
  private started = false;
  private installEvent: InstallEvent | null = null;
  private busy = false;
  readonly state = signal<OfflineState>('checking');
  readonly online = signal(this.browser?.navigator.onLine ?? false);
  readonly message = signal('Checking offline preparation…');
  readonly progress = signal<{ completed: number; total: number } | null>(null);
  readonly version = signal<string | null>(null);
  readonly totalBytes = signal<number | null>(null);
  readonly updateAvailable = signal(false);
  readonly canInstall = signal(false);

  async initialize(): Promise<void> {
    if (this.started) return;
    this.started = true;
    const browser = this.browser;
    if (!this.enabled || !browser?.isSecureContext || !browser.navigator.serviceWorker) {
      this.state.set('unsupported');
      this.message.set(!this.enabled ? 'Offline preparation is available in the production build.' : 'Offline preparation requires HTTPS (or localhost) and a supported browser.');
      return;
    }
    browser.addEventListener('online', () => this.online.set(true));
    browser.addEventListener('offline', () => this.online.set(false));
    browser.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); this.installEvent = event as InstallEvent; this.canInstall.set(true);
    });
    browser.addEventListener('appinstalled', () => { this.installEvent = null; this.canInstall.set(false); });
    try {
      const base = new URL(browser.document.baseURI);
      this.registration = await browser.navigator.serviceWorker.register(new URL('service-worker.js', base), { scope: base.pathname, updateViaCache: 'none' });
      const registration = this.registration;
      const watchUpdate = () => this.updateAvailable.set(!!registration.waiting);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          watchUpdate();
          if (installing.state === 'redundant' && registration.active) this.message.set('The update could not be prepared. The previous version and mission are retained.');
        });
      });
      watchUpdate();
      await browser.navigator.serviceWorker.ready;
      await this.check();
    } catch {
      this.state.set('error'); this.message.set('Offline support could not start. Check connection, browser storage and the production host, then reload.');
    }
  }

  private request(worker: ServiceWorker, type: string): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Offline operation timed out. Retry or verify preparation before disconnecting.')); }, 120_000);
      channel.port1.onmessage = event => {
        const result = event.data as WorkerResult;
        if (result.progress) this.progress.set(result.progress);
        if (!result.done) return;
        clearTimeout(timer); channel.port1.close(); resolve(result);
      };
      try { worker.postMessage({ type }, [channel.port2]); }
      catch (error) { clearTimeout(timer); channel.port1.close(); reject(error); }
    });
  }

  private show(result: WorkerResult): void {
    this.version.set(result.version ?? null);
    this.totalBytes.set(result.totalBytes ?? null);
    this.state.set(result.ready ? 'ready' : result.error ? 'error' : 'not-prepared');
    this.message.set(result.ready ? 'Offline pack verified. Save your route and notes before closing.' : result.error ?? 'Prepare this device while connected before relying on offline use.');
  }

  async check(): Promise<void> {
    if (this.busy || !this.registration?.active) return;
    this.busy = true;
    this.state.set('checking');
    try { this.show(await this.request(this.registration.active, 'STATUS')); }
    catch (error) { this.fail(error); }
    finally { this.busy = false; }
  }

  async prepare(): Promise<void> {
    if (this.busy || !this.registration?.active) return;
    this.busy = true; this.state.set('preparing'); this.progress.set(null);
    this.message.set('Downloading and verifying the complete offline pack. Keep this page open.');
    try { this.show(await this.request(this.registration.active, 'PREPARE')); }
    catch (error) { this.fail(error); }
    finally { this.busy = false; }
  }

  async checkForUpdate(): Promise<void> {
    try { await this.registration?.update(); this.updateAvailable.set(!!this.registration?.waiting); }
    catch { this.message.set('Could not check for updates. The current mission and prepared pack are unchanged.'); }
  }

  async applyUpdate(): Promise<void> {
    const waiting = this.registration?.waiting;
    if (this.busy || !waiting || !this.browser) return;
    if (!this.browser.confirm('This reloads MARSWALK and loses unsaved drafts. Save or export routes and notes first, and close other MARSWALK tabs before applying. Apply the update?')) return;
    this.busy = true; this.state.set('preparing'); this.progress.set(null);
    this.message.set('Preparing the new version. The previous pack is retained if this fails.');
    let stopWaiting = () => {};
    try {
      const result = await this.request(waiting, 'PREPARE');
      if (!result.ready) throw new Error(result.error ?? 'The update is not fully prepared.');
      const activated = new Promise<void>((resolve, reject) => {
        const workers = this.browser!.navigator.serviceWorker;
        const onChange = () => { clearTimeout(timer); resolve(); };
        const timer = setTimeout(() => { workers.removeEventListener('controllerchange', onChange); reject(new Error('Update activation timed out. Reload after saving your work.')); }, 15_000);
        workers.addEventListener('controllerchange', onChange, { once: true });
        stopWaiting = () => { clearTimeout(timer); workers.removeEventListener('controllerchange', onChange); };
      });
      void activated.catch(() => {});
      const applied = await this.request(waiting, 'ACTIVATE');
      if (!applied.ready) throw new Error(applied.error ?? 'Update activation failed.');
      await activated;
      this.browser.location.reload();
    } catch (error) { this.fail(error); }
    finally { stopWaiting(); this.busy = false; }
  }

  async install(): Promise<void> {
    const event = this.installEvent;
    if (!event) return;
    this.installEvent = null; this.canInstall.set(false);
    try { await event.prompt(); await event.userChoice; }
    catch { this.message.set('Use your browser menu to install or add MARSWALK to the home screen if supported.'); }
  }

  private fail(error: unknown): void {
    this.state.set('error'); this.message.set(error instanceof Error ? error.message : 'Offline operation failed. Retry preparation while connected.');
  }
}
