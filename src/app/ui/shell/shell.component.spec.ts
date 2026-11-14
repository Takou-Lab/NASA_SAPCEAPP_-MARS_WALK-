import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { MissionService } from '../../core/mission.service';
import { NotebookComponent } from '../../notebook/notebook.component';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;
  let component: ShellComponent;
  const originalViewportWidth = window.innerWidth;

  beforeEach(async () => {
    localStorage.clear();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalViewportWidth,
    });
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [MissionService, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalViewportWidth,
    });
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

  it('clamps keyboard and restored widths to reserve map space at an 820px viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 820 });
    component.onResizerKeydown(new KeyboardEvent('keydown', { key: 'End' }));
    expect(component.panelWidth()).toBe(520);
    localStorage.setItem('marswalk_panel_width', '750');
    fixture.destroy();
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.panelWidth()).toBe(520);
  });

  it('resizes the sidebar with pointer input and persists the viewport-clamped width', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 820 });
    component.onViewportResize();
    component.startResize(new MouseEvent('mousedown', { clientX: 440 }));

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 360 }));
    expect(component.panelWidth()).toBe(460);
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 }));
    expect(component.panelWidth()).toBe(520);
    window.dispatchEvent(new MouseEvent('mouseup'));

    expect(localStorage.getItem('marswalk_panel_width')).toBe('520');
    expect(component.isResizing()).toBe(false);
  });

  it('keeps unsaved and failed-save notebook drafts while tabs change', () => {
    const notebook = fixture.debugElement.query(By.directive(NotebookComponent))
      .componentInstance as NotebookComponent;
    const mission = TestBed.inject(MissionService);
    notebook.setDraftText('Keep this exact field note');
    component.setActiveTab('planner');
    component.setActiveTab('notebook');
    expect(notebook.draftText()).toBe('Keep this exact field note');

    vi.spyOn(mission, 'addObservation').mockReturnValue({
      ok: false,
      error: 'Storage unavailable',
    });
    notebook.onSubmit();
    component.setActiveTab('confidence');
    component.setActiveTab('notebook');
    expect(notebook.draftText()).toBe('Keep this exact field note');
    expect(notebook.feedback()?.type).toBe('error');
  });
});
