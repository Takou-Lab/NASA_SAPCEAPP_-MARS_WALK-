import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { PWA_ENABLED, PWA_WINDOW, PwaService } from './pwa.service';

function setup(enabled = true) {
  let result = { ready: false };
  const worker = { postMessage: vi.fn((_data: unknown, ports: MessagePort[]) => ports[0].postMessage({ done: true, ...result })) };
  const registration = { active: worker, waiting: null, update: vi.fn(), addEventListener: vi.fn() };
  const navigator = { onLine: true, serviceWorker: { register: vi.fn(async (_url: URL, _options: RegistrationOptions) => registration), ready: Promise.resolve(registration) } };
  const browser = { navigator, isSecureContext: true, document: { baseURI: 'https://example.test/mars/' }, addEventListener: vi.fn(), confirm: vi.fn(() => false), location: { reload: vi.fn() } };
  TestBed.configureTestingModule({ providers: [{ provide: PWA_ENABLED, useValue: enabled }, { provide: PWA_WINDOW, useValue: browser }] });
  return { service: TestBed.inject(PwaService), browser, worker, registration, setResult: (value: typeof result) => { result = value; } };
}

describe('PWA lifecycle', () => {
  it('does not register workers in development mode', async () => {
    const {service,browser}=setup(false);await service.initialize();
    expect(service.state()).toBe('unsupported');expect(browser.navigator.serviceWorker.register).not.toHaveBeenCalled();
  });
  it('registers once at the deployed base and distinguishes connected from prepared', async () => {
    const {service,browser}=setup();await service.initialize();await service.initialize();
    expect(browser.navigator.serviceWorker.register).toHaveBeenCalledTimes(1);
    expect(String(browser.navigator.serviceWorker.register.mock.calls[0][0])).toBe('https://example.test/mars/service-worker.js');
    expect(service.online()).toBe(true);expect(service.state()).toBe('not-prepared');
  });
  it('trusts verified worker bytes, not connectivity, and revokes ready after corruption', async () => {
    const h=setup();await h.service.initialize();h.setResult({ready:true});await h.service.prepare();
    expect(h.service.state()).toBe('ready');h.setResult({ready:false});await h.service.check();
    expect(h.service.state()).toBe('not-prepared');
  });
  it('does not activate/reload a waiting update when the user declines', async () => {
    const h=setup();await h.service.initialize();Object.assign(h.registration,{waiting:h.worker});
    await h.service.applyUpdate();expect(h.browser.confirm).toHaveBeenCalled();
    expect(h.browser.location.reload).not.toHaveBeenCalled();
    expect(h.worker.postMessage.mock.calls.every(([data]) => (data as {type:string}).type !== 'ACTIVATE')).toBe(true);
  });
  it('keeps unsupported insecure contexts separate from ready', async () => {
    const h=setup();h.browser.isSecureContext=false;await h.service.initialize();
    expect(h.service.state()).toBe('unsupported');expect(h.browser.navigator.serviceWorker.register).not.toHaveBeenCalled();
  });
});
