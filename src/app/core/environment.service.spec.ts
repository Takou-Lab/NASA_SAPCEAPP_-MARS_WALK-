import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EnvironmentService } from './environment.service';
const pending = {
  schemaVersion: 1,
  scope: 'historical-rover-context',
  instrument: 'REMS',
  sourceUrl: 'https://atmos.nmsu.edu/PDS/',
  reviewStatus: 'pending',
  reviewNote: 'Sources awaiting review',
  readings: [],
};
describe('EnvironmentService', () => {
  let service: EnvironmentService, http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EnvironmentService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('initializes once, freezes review metadata and never publishes pending measurements', () => {
    service.initialize();
    service.initialize();
    http.expectOne('data/environment.json').flush(pending);
    expect(service.status()).toBe('pending');
    expect(Object.isFrozen(service.context())).toBe(true);
    service.reload();
    http.expectOne('data/environment.json').flush({ ...pending, readings: [{ value: 700 }] });
    expect(service.status()).toBe('error');
    expect(service.context()).toBeNull();
  });
  it('rejects network failures and recovers by explicit retry', () => {
    service.initialize();
    http
      .expectOne('data/environment.json')
      .flush('missing', { status: 404, statusText: 'Not Found' });
    expect(service.status()).toBe('error');
    service.reload();
    http.expectOne('data/environment.json').flush(pending);
    expect(service.status()).toBe('pending');
  });
  it('ignores stale responses when a retry supersedes a request', () => {
    service.initialize();
    const old = http.expectOne('data/environment.json');
    service.reload();
    http.expectOne('data/environment.json').flush(pending);
    old.flush({ bad: true });
    expect(service.status()).toBe('pending');
  });
});
