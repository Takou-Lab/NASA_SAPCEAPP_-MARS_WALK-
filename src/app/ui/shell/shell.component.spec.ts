import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MissionService } from '../../core/mission.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;
  let component: ShellComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [MissionService],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates shell layout and defaults to confidence tab', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab()).toBe('confidence');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-confidence-panel')).toBeTruthy();
  });

  it('switches between tabs on demand', () => {
    component.setActiveTab('planner');
    fixture.detectChanges();
    expect(component.activeTab()).toBe('planner');
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-route-planner')).toBeTruthy();

    component.setActiveTab('notebook');
    fixture.detectChanges();
    expect(component.activeTab()).toBe('notebook');
    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-notebook')).toBeTruthy();
  });

  it('toggles panel collapsed state', () => {
    expect(component.isPanelCollapsed()).toBe(false);
    component.togglePanel();
    expect(component.isPanelCollapsed()).toBe(true);
    component.togglePanel();
    expect(component.isPanelCollapsed()).toBe(false);
  });

  it('handles resizer keyboard navigation and width reset', () => {
    const initialWidth = component.panelWidth();
    expect(initialWidth).toBe(380);

    // ArrowLeft widens panel
    component.onResizerKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(component.panelWidth()).toBe(400);

    // ArrowRight narrows panel
    component.onResizerKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(component.panelWidth()).toBe(380);

    // Double click resets to default
    component.onResizerKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(component.panelWidth()).toBe(400);
    component.resetPanelWidth();
    expect(component.panelWidth()).toBe(380);
  });
});
