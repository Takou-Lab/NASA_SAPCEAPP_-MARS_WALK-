import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { SurvivalBudgetComponent } from './survival-budget.component';
import { MissionService } from '../core/mission.service';
import { testImage } from '../core/fixtures.spec-helper';
describe('survival time scenario', () => {
  const assessment = signal({ planarDistanceMeters: 500 });
  const key = `marswalk:survival-budget:v1:${testImage().imageRef}`;
  beforeEach(() => {
    localStorage.clear();
    assessment.set({ planarDistanceMeters: 500 });
    TestBed.configureTestingModule({
      imports: [SurvivalBudgetComponent],
      providers: [
        {
          provide: MissionService,
          useValue: {
            image: signal(testImage()),
            assessment,
            dataStatus: signal('ready'),
            markers: signal([]),
            selectedMarkerId: signal(null),
            route: signal({ start: { x: 1, y: 1 }, destination: { x: 2, y: 2 }, waypoints: [] }),
            observations: signal([]),
          },
        },
      ],
    });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });
  function mount() {
    const f = TestBed.createComponent(SurvivalBudgetComponent);
    f.detectChanges();
    return f;
  }
  it('keeps example assumptions explicit and updates reactively when route distance changes', () => {
    const f = mount();
    expect(f.componentInstance.result().ok).toBe(false);
    f.componentInstance.example();
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Within entered time budget');
    assessment.set({ planarDistanceMeters: 1000 });
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Exceeds entered time budget');
    expect(f.nativeElement.textContent).toContain('Illustrative example only');
    expect(localStorage.getItem(key)).toBeNull();
  });
  it('saves assumptions separately and restores them in a recreated component', () => {
    let f = mount();
    f.componentInstance.example();
    f.componentInstance.save();
    expect(localStorage.length).toBe(1);
    f.destroy();
    f = mount();
    expect(f.componentInstance.inputs().speedKmh).toBe(1);
    expect(f.componentInstance.message()).toContain('restored');
  });
  it('preserves unreadable saved assumptions on attempted save', () => {
    localStorage.setItem(key, 'corrupt');
    const f = mount();
    f.componentInstance.example();
    f.componentInstance.save();
    expect(localStorage.getItem(key)).toBe('corrupt');
    expect(f.componentInstance.message()).toContain('not overwritten');
  });
  it('reports blocked storage and retains in-memory inputs', () => {
    const f = mount();
    f.componentInstance.example();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('quota');
    });
    f.componentInstance.save();
    expect(f.componentInstance.inputs().reserveMinutes).toBe(30);
    expect(f.componentInstance.message()).toContain('could not be saved');
  });
  it('exports scenario facts and limitations separately from importable mission data', () => {
    const f = mount();
    f.componentInstance.example();
    f.componentInstance.preparation.setObjective('Inspect fracture context');
    f.componentInstance.preparation.setCheck('returnPlan', true);
    const text = f.componentInstance.brief();
    expect(text).toContain('Round-trip travel: 60.00 min');
    expect(text).toContain('Inspect fracture context');
    expect(text).toContain('[x] Return location');
    expect(text).toContain('Margin after reserve: 10.00 min');
    expect(text).toContain('not a live countdown');
    expect(text).toContain(testImage().imageRef);
    expect(text).toContain('cannot be imported');
  });
  it('treats a cleared field as unavailable rather than zero', () => {
    const f = mount();
    f.componentInstance.example();
    f.componentInstance.set('speedKmh', { target: { value: '' } } as unknown as Event);
    expect(f.componentInstance.inputs().speedKmh).toBeNull();
    expect(f.componentInstance.result().ok).toBe(false);
  });
  it('keeps a draft preparation exportable when the time estimate is unavailable', () => {
    const f = mount();
    f.componentInstance.preparation.setObjective('Draft objective without time assumptions');
    const text = f.componentInstance.brief();
    expect(text).toContain('Draft objective without time assumptions');
    expect(text).toContain('Estimate unavailable:');
    const button = [...f.nativeElement.querySelectorAll('button')].find((b: unknown) =>
      (b as HTMLButtonElement).textContent?.includes('Download survival brief'),
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });
});
