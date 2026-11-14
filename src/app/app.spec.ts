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

beforeEach(async () => {
  TestBed.configureTestingModule({
    imports: [App],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }).overrideComponent(App, {
    remove: { imports: [MapComponent] },
    add: { imports: [MapMountStub] },
  });
  await TestBed.compileComponents();
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
  const buttons = fixture.nativeElement.querySelectorAll(
    'app-science-context .science-record-button',
  ) as NodeListOf<HTMLButtonElement>;
  expect(buttons).toHaveLength(3);
  const route = mission.route();
  const mode = mission.mode();
  const observations = mission.observations();
  buttons[0].click();
  fixture.detectChanges();
  expect(mission.selectedMarkerId()).toBe(markers[0].id);
  const details = fixture.nativeElement.querySelector(
    'app-science-context .science-record-details',
  );
  expect(details.textContent).toContain(markers[0].finding);
  expect(details.textContent).toContain('Unavailable on this image');
  expect(mission.route()).toBe(route);
  expect(mission.mode()).toBe(mode);
  expect(mission.observations()).toBe(observations);
  http.verify();
});

it('reads a selected mission and exposes the actual import result', async () => {
  const fixture = TestBed.createComponent(App);
  const http = TestBed.inject(HttpTestingController);
  http.expectOne((r) => r.url.endsWith('/data/manifest.json')).flush(manifest);
  await Promise.resolve();
  http.expectOne((r) => r.url.endsWith('/data/markers.json')).flush(markers);
  await fixture.whenStable();
  const raw = JSON.stringify({
    schemaVersion: 1,
    imageRef: manifest.imageRef,
    route: { start: { x: 30, y: 40 }, destination: null, waypoints: [] },
    observations: [],
  });
  const event = {
    target: { files: [{ name: 'mission.json', size: raw.length, text: async () => raw }] },
  } as unknown as Event;
  await fixture.componentInstance.selectMissionFile(event);
  fixture.componentInstance.importSelectedMission();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Mission imported and saved on this device.');
  expect(TestBed.inject(MissionService).route().start).toEqual({ x: 30, y: 40 });
  http.verify();
});

it('keeps a newer file selection when an older file finishes reading later', async () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
  const http = TestBed.inject(HttpTestingController);
  http
    .expectOne((r) => r.url.endsWith('/data/manifest.json'))
    .flush('', { status: 404, statusText: 'Not Found' });
  let finishOld!: (raw: string) => void;
  const old = app.selectMissionFile({
    target: {
      files: [
        {
          name: 'old.json',
          size: 2,
          text: () =>
            new Promise<string>((resolve) => {
              finishOld = resolve;
            }),
        },
      ],
    },
  } as unknown as Event);
  await app.selectMissionFile({
    target: { files: [{ name: 'new.json', size: 2, text: async () => '{}' }] },
  } as unknown as Event);
  finishOld('old');
  await old;
  expect(app.missionFileName()).toBe('new.json');
  expect(app.readingMission()).toBe(false);
  http.verify();
});
