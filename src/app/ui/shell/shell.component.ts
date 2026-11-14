import { UpperCasePipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { MissionService } from '../../core/mission.service';
import { NotebookComponent } from '../../notebook/notebook.component';
import { RoutePlannerComponent } from '../../planner/route-planner.component';
import { ConfidencePanelComponent } from '../confidence-panel/confidence-panel.component';
import { HeaderComponent } from '../header/header.component';

export type ActiveTab = 'confidence' | 'planner' | 'notebook';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    UpperCasePipe,
    HeaderComponent,
    ConfidencePanelComponent,
    RoutePlannerComponent,
    NotebookComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnDestroy {
  private missionService = inject(MissionService);

  readonly mode = this.missionService.mode;
  readonly route = this.missionService.route;
  readonly image = this.missionService.image;
  readonly observations = this.missionService.observations;

  readonly activeTab = signal<ActiveTab>('confidence');
  readonly isPanelCollapsed = signal<boolean>(false);

  // Resizable sidebar state
  readonly panelWidth = signal<number>(380);
  readonly isResizing = signal<boolean>(false);

  private readonly MIN_WIDTH = 300;
  private readonly MAX_WIDTH = 750;
  private readonly DEFAULT_WIDTH = 380;
  private readonly STORAGE_KEY = 'marswalk_panel_width';

  private boundMouseMove?: (e: MouseEvent) => void;
  private boundMouseUp?: () => void;
  private boundTouchMove?: (e: TouchEvent) => void;
  private boundTouchEnd?: () => void;

  constructor() {
    this.initPanelWidth();
  }

  private initPanelWidth(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= this.MIN_WIDTH && parsed <= this.MAX_WIDTH) {
          this.panelWidth.set(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  setActiveTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    if (this.isPanelCollapsed()) {
      this.isPanelCollapsed.set(false);
    }
  }

  togglePanel(): void {
    this.isPanelCollapsed.update((v) => !v);
  }

  startResize(event: MouseEvent | TouchEvent): void {
    if (this.isPanelCollapsed()) return;

    event.preventDefault();
    this.isResizing.set(true);

    this.boundMouseMove = (e: MouseEvent) => this.handlePointerMove(e.clientX);
    this.boundMouseUp = () => this.stopResize();

    this.boundTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        this.handlePointerMove(e.touches[0].clientX);
      }
    };
    this.boundTouchEnd = () => this.stopResize();

    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup', this.boundMouseUp);
    window.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundTouchEnd);
  }

  private handlePointerMove(clientX: number): void {
    const windowWidth = window.innerWidth;
    const newWidth = windowWidth - clientX;
    const maxAllowed = Math.min(this.MAX_WIDTH, windowWidth - 280);

    if (newWidth >= this.MIN_WIDTH && newWidth <= maxAllowed) {
      this.panelWidth.set(Math.round(newWidth));
    }
  }

  private stopResize(): void {
    this.isResizing.set(false);

    if (this.boundMouseMove) window.removeEventListener('mousemove', this.boundMouseMove);
    if (this.boundMouseUp) window.removeEventListener('mouseup', this.boundMouseUp);
    if (this.boundTouchMove) window.removeEventListener('touchmove', this.boundTouchMove);
    if (this.boundTouchEnd) window.removeEventListener('touchend', this.boundTouchEnd);

    try {
      localStorage.setItem(this.STORAGE_KEY, this.panelWidth().toString());
    } catch {
      // Ignore
    }
  }

  resetPanelWidth(): void {
    this.panelWidth.set(this.DEFAULT_WIDTH);
    try {
      localStorage.setItem(this.STORAGE_KEY, this.DEFAULT_WIDTH.toString());
    } catch {
      // Ignore
    }
  }

  onResizerKeydown(event: KeyboardEvent): void {
    const STEP = 20;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const next = Math.min(this.MAX_WIDTH, this.panelWidth() + STEP);
      this.panelWidth.set(next);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = Math.max(this.MIN_WIDTH, this.panelWidth() - STEP);
      this.panelWidth.set(next);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.panelWidth.set(this.MIN_WIDTH);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.panelWidth.set(this.MAX_WIDTH);
    }
  }

  ngOnDestroy(): void {
    this.stopResize();
  }
}
