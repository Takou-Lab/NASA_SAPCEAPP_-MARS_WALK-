import { Component, computed, inject, signal, Signal } from '@angular/core';
import { Observation, Point, Route } from '../core/models';
import { MissionService } from '../core/mission.service';

@Component({
  selector: 'app-notebook',
  standalone: true,
  templateUrl: './notebook.component.html',
  styleUrl: './notebook.component.scss',
})
export class NotebookComponent {
  private missionService = inject(MissionService);

  readonly observations: Signal<readonly Observation[]> = this.missionService.observations;
  readonly image = this.missionService.image;
  readonly route: Signal<Route> = this.missionService.route;
  readonly dataStatus: Signal<'loading' | 'ready' | 'unavailable' | 'error'> = this.missionService.dataStatus;
  readonly dataError: Signal<string | null> = this.missionService.dataError;

  // Local component draft state (retained on failure)
  readonly draftText = signal<string>('');
  readonly attachStartLocation = signal<boolean>(false);
  readonly feedback = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  readonly isDraftEmpty: Signal<boolean> = computed(() => {
    return this.draftText().trim().length === 0;
  });

  readonly hasStartPoint: Signal<boolean> = computed(() => {
    return this.route().start !== null;
  });

  readonly nextActionHint: Signal<string> = computed(() => {
    if (this.dataStatus() !== 'ready') {
      return 'Mission metadata is not ready; you can draft notes here, and save once raster metadata is loaded.';
    }
    if (this.isDraftEmpty()) {
      return 'Next step: Enter a geological or traverse observation above, then select Save Observation.';
    }
    return 'Next step: Select Save Observation to persist your draft to the local mission log.';
  });

  setDraftText(text: string): void {
    this.draftText.set(text);
  }

  onDraftInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    if (target) {
      this.setDraftText(target.value);
    }
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit();
  }

  formatTimestamp(isoOrDate: string): string {
    const trimmed = isoOrDate.trim();
    if (!trimmed) {
      return isoOrDate;
    }
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return isoOrDate;
    }
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(parsed);
    } catch {
      return isoOrDate;
    }
  }

  toggleAttachStart(): void {
    if (this.hasStartPoint()) {
      this.attachStartLocation.update((v) => !v);
    }
  }

  onSubmit(): void {
    const raw = this.draftText();
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      this.setFeedback('Observation text cannot be empty or whitespace only.', 'error');
      return;
    }

    let pos: Point | null = null;
    if (this.attachStartLocation() && this.route().start) {
      pos = { ...this.route().start! };
    }

    // Call service to validate and persist
    const res = this.missionService.addObservation(trimmed, pos);

    if (res.ok) {
      // Clear draft ONLY after confirmed success
      this.draftText.set('');
      this.attachStartLocation.set(false);
      this.setFeedback('Observation saved to local mission log.', 'success');
    } else {
      // Storage or validation failed: draftText is preserved!
      this.setFeedback(
        res.error ?? 'Storage failed: your note draft has been preserved in the editor.',
        'error',
      );
    }
  }

  private setFeedback(message: string, type: 'success' | 'error'): void {
    this.feedback.set({ message, type });
    setTimeout(() => {
      if (this.feedback()?.message === message) {
        this.feedback.set(null);
      }
    }, 4500);
  }
}
