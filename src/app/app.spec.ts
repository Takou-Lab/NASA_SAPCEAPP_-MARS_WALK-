import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

it('renders an honest data-unavailable foundation when the manifest is absent', async () => {
  TestBed.configureTestingModule({
    imports: [App],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  const fixture = TestBed.createComponent(App);
  const http = TestBed.inject(HttpTestingController);
  http
    .expectOne((r) => r.url.endsWith('/data/manifest.json'))
    .flush('', { status: 404, statusText: 'Not Found' });
  await fixture.whenStable();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('unavailable');
  expect(fixture.nativeElement.textContent).toContain('Waiting for a verified local image');
  http.verify();
});
