import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { MissionService } from '../core/mission.service';
import { testImage } from '../core/fixtures.spec-helper';
import { PreparationService, validPreparation } from './preparation.service';
import { SurvivalBriefComponent } from './survival-brief.component';
import type { ScienceMarker } from '../core/models';
describe('mission objective and user preparation', () => {
  const markers = signal<ScienceMarker[]>([]);
  const selected = signal<string | null>(null);
  const key = `marswalk:preparation:v1:${testImage().imageRef}`;
  const mission = {
    image: signal(testImage()),
    dataStatus: signal('ready'),
    route: signal({ start: { x: 1, y: 1 }, destination: null, waypoints: [] }),
    observations: signal([]),
    markers,
    selectedMarkerId: selected,
  };
  beforeEach(() => {
    localStorage.clear();
    markers.set([]);
    selected.set(null);
    TestBed.configureTestingModule({
      imports: [SurvivalBriefComponent],
      providers: [{ provide: MissionService, useValue: mission }],
    });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });
  function mount() {
    const f = TestBed.createComponent(SurvivalBriefComponent);
    f.detectChanges();
    return f;
  }
  it('starts collapsed with no prechecked or verified readiness claim', () => {
    const f = mount();
    expect(f.nativeElement.querySelector('details').open).toBe(false);
    expect(f.componentInstance.plan.checkedCount()).toBe(0);
    expect(f.nativeElement.textContent).toContain('does not inspect equipment');
    expect(localStorage.getItem(key)).toBeNull();
  });
  it('lets a user check and uncheck an item without saving automatically', () => {
    const f = mount();
    const input = f.nativeElement.querySelector('input[type=checkbox]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(f.componentInstance.plan.checkedCount()).toBe(1);
    input.checked = false;
    input.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(f.componentInstance.plan.checkedCount()).toBe(0);
    expect(localStorage.getItem(key)).toBeNull();
  });
  it('restores saved objective and declarations after a new app session', () => {
    let f = mount();
    f.componentInstance.plan.setObjective('Inspect and record a ridge morphology question');
    f.componentInstance.plan.setCheck('returnPlan', true);
    f.componentInstance.plan.save();
    f.destroy();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SurvivalBriefComponent],
      providers: [{ provide: MissionService, useValue: mission }],
    });
    f = mount();
    expect(f.componentInstance.plan.objective()).toBe(
      'Inspect and record a ridge morphology question',
    );
    expect(f.componentInstance.plan.checks().returnPlan).toBe(true);
    expect(f.componentInstance.plan.message()).toContain('restored');
  });
  it('preserves invalid saved bytes and keeps new entries on blocked save', () => {
    localStorage.setItem(key, 'corrupt preparation');
    const f = mount();
    f.componentInstance.plan.setObjective('Keep this draft');
    f.componentInstance.plan.save();
    expect(localStorage.getItem(key)).toBe('corrupt preparation');
    expect(f.componentInstance.plan.objective()).toBe('Keep this draft');
    expect(f.componentInstance.plan.message()).toContain('not overwritten');
  });
  it('reports storage errors without losing objective or checks', () => {
    const f = mount();
    f.componentInstance.plan.setObjective('Exact objective');
    f.componentInstance.plan.setCheck('communications', true);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('quota');
    });
    f.componentInstance.plan.save();
    expect(f.componentInstance.plan.objective()).toBe('Exact objective');
    expect(f.componentInstance.plan.checks().communications).toBe(true);
    expect(f.componentInstance.plan.message()).toContain('could not be saved');
  });
  it('updates a selected record and handles its removal without inventing a position', () => {
    const f = mount();
    markers.set([
      {
        id: 'record',
        name: 'Regional finding',
        positionStatus: 'unavailable',
        source: { url: 'https://science.nasa.gov/', title: 'NASA', credit: 'NASA' },
      } as ScienceMarker,
    ]);
    selected.set('record');
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Regional finding — unavailable position');
    markers.set([]);
    f.detectChanges();
    expect(f.componentInstance.selectedScience()).toBeNull();
    expect(f.nativeElement.textContent).toContain('No science record selected');
  });
  it('validates persisted declarations and bounds objective length', () => {
    const f = mount();
    const service = TestBed.inject(PreparationService);
    service.setObjective('Kept');
    service.setObjective('x'.repeat(1001));
    expect(service.objective()).toBe('Kept');
    expect(validPreparation({ objective: 'a', checks: {} })).toBe(false);
    expect(
      validPreparation({
        objective: 'a',
        checks: { lifeSupport: 'true', communications: true, returnPlan: true, hazards: true },
      }),
    ).toBe(false);
    expect(service.briefLines().join('\n')).toContain('[ ]');
  });
});
