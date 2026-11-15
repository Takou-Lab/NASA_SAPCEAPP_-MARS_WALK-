import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';
import { PREPARATION_CHECKS, PreparationCheck, PreparationService } from './preparation.service';
@Component({
  selector: 'app-survival-brief',
  standalone: true,
  template: ` <details>
    <summary>
      Mission objective &amp; preparation · {{ plan.checkedCount() }}/4 user declarations
    </summary>
    <p>
      State the question you want to investigate. Mark only checks you have independently reviewed.
      MARSWALK does not inspect equipment or grant departure clearance.
    </p>
    <fieldset [disabled]="mission.dataStatus() !== 'ready'">
      <legend>Mission objective and user-declared checks</legend>
      <label for="survival-objective"
        >Exploration objective<textarea
          id="survival-objective"
          maxlength="1000"
          rows="3"
          [value]="plan.objective()"
          (input)="objectiveChanged($event)"
          placeholder="What evidence will you inspect or record, and why?"
        ></textarea>
      </label>
      @for (item of items; track item.id) {
        <label class="check"
          ><input
            type="checkbox"
            [checked]="plan.checks()[item.id]"
            (change)="checkChanged(item.id, $event)"
          />
          <span>{{ item.label }}</span></label
        >
      }
      <button type="button" (click)="plan.save()">Save mission preparation</button>
    </fieldset>
    <p role="status">{{ plan.message() }}</p>
    <p>
      <strong>Live mission:</strong> {{ routeSummary() }} ·
      {{ mission.observations().length }} saved observations.
    </p>
    @if (selectedScience(); as record) {
      <p>
        <strong>Selected evidence:</strong> {{ record.name }} —
        {{ record.positionStatus }} position.
        <a [href]="record.source.url" target="_blank" rel="noopener noreferrer">Source</a>. A
        regional record is not a confirmed destination.
      </p>
    } @else {
      <p>No science record selected. Review evidence before choosing an observation objective.</p>
    }
    <p>
      The Download survival brief button below includes this objective, checklist, current route,
      time scenario, selected evidence and saved observations. It creates a text snapshot; save each
      section to retain its inputs offline.
    </p>
  </details>`,
  styles: [
    `
      :host {
        display: block;
        margin: 16px 0;
      }
      details {
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 10px;
        background: var(--bg-surface);
        color: var(--text-primary);
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        min-height: 32px;
      }
      p {
        line-height: 1.5;
      }
      fieldset {
        min-width: 0;
        border: 0;
        padding: 0;
      }
      legend {
        font-weight: 600;
        margin-bottom: 10px;
      }
      label {
        display: grid;
        gap: 6px;
      }
      textarea {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        padding: 10px;
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        color: var(--text-primary);
        background: var(--bg-card);
        font: inherit;
        resize: vertical;
      }
      .check {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 0;
        min-height: 24px;
        line-height: 1.5;
      }
      .check input {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        margin: 0;
      }
      button {
        min-height: 44px;
        padding: 10px;
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        background: var(--bg-card);
        color: var(--text-primary);
        font: inherit;
        cursor: pointer;
      }
      button:focus-visible,
      textarea:focus-visible,
      input:focus-visible,
      summary:focus-visible {
        outline: 3px solid var(--border-focus);
        outline-offset: 2px;
      }
      a {
        color: var(--science-cyan);
      }
    `,
  ],
})
export class SurvivalBriefComponent {
  readonly plan = inject(PreparationService);
  readonly mission = inject(MissionService);
  readonly items = PREPARATION_CHECKS;
  readonly routeSummary = computed(() => {
    const r = this.mission.route();
    return `Start ${r.start ? 'set' : 'missing'}, destination ${r.destination ? 'set' : 'missing'}, ${r.waypoints.length} waypoints`;
  });
  readonly selectedScience = computed(
    () => this.mission.markers().find((m) => m.id === this.mission.selectedMarkerId()) ?? null,
  );
  objectiveChanged(e: Event) {
    this.plan.setObjective((e.target as HTMLTextAreaElement).value);
  }
  checkChanged(id: PreparationCheck, e: Event) {
    this.plan.setCheck(id, (e.target as HTMLInputElement).checked);
  }
}
