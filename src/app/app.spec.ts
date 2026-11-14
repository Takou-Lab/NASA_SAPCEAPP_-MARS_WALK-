import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import manifest from '../../public/data/manifest.json';
import markers from '../../public/data/markers.json';
import { App } from './app';
import { MissionService } from './core/mission.service';
import { MapComponent } from './map/map.component';

// Root integration tests isolate Leaflet's browser renderer. Its behavior has
// separate map tests and a real-browser smoke check.
@Component({ selector: 'app-map', template: '' })
class MapMountStub {}

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [App],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }).overrideComponent(App, {
    remove: { imports: [MapComponent] },
    add: { imports: [MapMountStub] },
  });
});

it('mounts the map once and keeps the missing-data shell usable', async () => {
  const fixture = TestBed.createComponent(App);
  const http = TestBed.inject(HttpTestingController);
  http
    .expectOne((r) => r.url.endsWith('/data/manifest.json'))
    .flush('', { status: 404, statusText: 'Not Found' });
  await fixture.whenStable();
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelectorAll('app-map')).toHaveLength(1);
  expect(fixture.nativeElement.textContent).toContain('unavailable');
  expect(fixture.nativeElement.textContent).toContain('Waiting for a verified local image');
  http.verify();
});

it('loads the delivered image and three unlocated science records through the real service', async () => {
  const fixture = TestBed.createComponent(App);
  const mission = TestBed.inject(MissionService);
  const http = TestBed.inject(HttpTestingController);
  http.expectOne((r) => r.url.endsWith('/data/manifest.json')).flush(manifest);
  await Promise.resolve();
  http.expectOne((r) => r.url.endsWith('/data/markers.json')).flush(markers);
  await fixture.whenStable();
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelectorAll('app-map')).toHaveLength(1);
  expect(mission.dataStatus()).toBe('ready');
  expect(mission.dataError()).toBeNull();
  expect(mission.image()?.imageRef).toBe(manifest.imageRef);
  expect(mission.markers()).toHaveLength(3);
  expect(
    mission
      .markers()
      .every((marker) => marker.position === null && marker.positionStatus === 'unavailable'),
  ).toBe(true);
  expect(mission.assessment().planarDistanceMeters).toBeNull();
  expect(fixture.nativeElement.textContent).toContain('3 contextual science records');
  http.verify();
});
