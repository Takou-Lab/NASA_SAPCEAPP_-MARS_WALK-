import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import manifest from '../../public/data/manifest.json';
import markers from '../../public/data/markers.json';
import { MissionService } from './core/mission.service';
import { MapComponent } from './map/map.component';
import { App } from './app';
import { ShellComponent } from './ui/shell/shell.component';

@Component({ selector: 'app-map', template: '' })
class MapMountStub {}

describe('App integration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).overrideComponent(ShellComponent, {
      remove: { imports: [MapComponent] },
      add: { imports: [MapMountStub] },
    });
  });

  it('initializes shared data once and mounts the shell-owned map once', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    const mission = TestBed.inject(MissionService);
    http.expectOne((request) => request.url.endsWith('/data/manifest.json')).flush(manifest);
    await Promise.resolve();
    http.expectOne((request) => request.url.endsWith('/data/markers.json')).flush(markers);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(mission.dataStatus()).toBe('ready');
    expect(mission.image()?.imageRef).toBe(manifest.imageRef);
    expect(mission.markers()).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('app-map')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('app-shell')).toBeTruthy();
    const scienceButton = fixture.nativeElement.querySelector(
      '.science-record-button',
    ) as HTMLButtonElement;
    expect(scienceButton).toBeTruthy();
    scienceButton.click();
    fixture.detectChanges();
    expect(mission.selectedMarkerId()).toBe(markers[0].id);
    expect(mission.markers()[0].position).toBeNull();
    expect(mission.route().start).toBeNull();
    expect(mission.route().destination).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(mission.markers()[0].source.title);
    http.verify();
  });
});
