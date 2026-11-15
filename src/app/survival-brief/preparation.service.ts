import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { MissionService } from '../core/mission.service';
export const PREPARATION_CHECKS = [
  {
    id: 'lifeSupport',
    label:
      'Suit, life support and supply limits reviewed using authoritative operating information',
  },
  { id: 'communications', label: 'Communication method and loss-of-contact procedure agreed' },
  { id: 'returnPlan', label: 'Return location, access and contingency plan identified' },
  {
    id: 'hazards',
    label: 'Terrain and environmental unknowns reviewed; unresolved hazards recorded',
  },
] as const;
export type PreparationCheck = (typeof PREPARATION_CHECKS)[number]['id'];
export interface Preparation {
  objective: string;
  checks: Record<PreparationCheck, boolean>;
}
const empty = (): Preparation => ({
  objective: '',
  checks: { lifeSupport: false, communications: false, returnPlan: false, hazards: false },
});
export function validPreparation(value: unknown): value is Preparation {
  if (!value || typeof value !== 'object') return false;
  const p = value as Preparation;
  return (
    typeof p.objective === 'string' &&
    p.objective.length <= 1000 &&
    !!p.checks &&
    typeof p.checks === 'object' &&
    !Array.isArray(p.checks) &&
    PREPARATION_CHECKS.every((c) => typeof p.checks[c.id] === 'boolean')
  );
}
/** User declarations only; separate from scientific evidence and operational readiness. */
@Injectable({ providedIn: 'root' })
export class PreparationService {
  private readonly mission = inject(MissionService);
  private readonly state = signal<Preparation>(empty());
  readonly objective = computed(() => this.state().objective);
  readonly checks = computed(() => this.state().checks);
  readonly checkedCount = computed(
    () => PREPARATION_CHECKS.filter((c) => this.checks()[c.id]).length,
  );
  readonly message = signal(
    'Unsaved user declarations. These checks do not verify equipment or establish mission readiness.',
  );
  private imageRef: string | null = null;
  constructor() {
    effect(() => {
      const ref = this.mission.image()?.imageRef;
      if (!ref || ref === this.imageRef) return;
      this.imageRef = ref;
      untracked(() => {
        this.state.set(empty());
        this.restore();
      });
    });
  }
  setObjective(text: string) {
    if (text.length > 1000) {
      this.message.set('Keep the objective to 1,000 characters or fewer.');
      return;
    }
    this.state.update((s) => ({ ...s, objective: text }));
    this.changed();
  }
  setCheck(id: PreparationCheck, checked: boolean) {
    if (!PREPARATION_CHECKS.some((c) => c.id === id) || typeof checked !== 'boolean') return;
    this.state.update((s) => ({ ...s, checks: { ...s.checks, [id]: checked } }));
    this.changed();
  }
  private changed() {
    this.message.set(
      'Preparation changed. Save preparation separately; route saving does not save these declarations.',
    );
  }
  private key() {
    return `marswalk:preparation:v1:${this.mission.image()!.imageRef}`;
  }
  private decode(raw: string): Preparation | null {
    try {
      const v = JSON.parse(raw);
      if (
        v.schemaVersion !== 1 ||
        v.imageRef !== this.mission.image()?.imageRef ||
        !validPreparation(v.preparation)
      )
        return null;
      return {
        objective: v.preparation.objective,
        checks: Object.fromEntries(
          PREPARATION_CHECKS.map((c) => [c.id, v.preparation.checks[c.id]]),
        ) as Preparation['checks'],
      };
    } catch {
      return null;
    }
  }
  private restore() {
    try {
      const raw = localStorage.getItem(this.key());
      if (raw === null) return;
      const p = this.decode(raw);
      if (!p) {
        this.message.set(
          'Saved preparation is unreadable and has been preserved. It will not be overwritten; download your current brief to keep your work.',
        );
        return;
      }
      this.state.set(p);
      this.message.set(
        'Saved objective and user declarations restored for this image. They are not independent equipment verification.',
      );
    } catch {
      this.message.set('Preparation storage is unavailable. Download the brief to keep a copy.');
    }
  }
  save() {
    if (!this.mission.image() || this.mission.dataStatus() !== 'ready') {
      this.message.set('Load the active image before saving preparation.');
      return;
    }
    try {
      const old = localStorage.getItem(this.key());
      if (old !== null && !this.decode(old)) {
        this.message.set(
          'Saved preparation is unreadable and was not overwritten. Download your current brief instead.',
        );
        return;
      }
      localStorage.setItem(
        this.key(),
        JSON.stringify({
          schemaVersion: 1,
          imageRef: this.mission.image()!.imageRef,
          preparation: this.state(),
        }),
      );
      this.message.set(
        'Preparation saved on this device. Save route, observations and time assumptions separately.',
      );
    } catch {
      this.message.set(
        'Preparation could not be saved. Current entries remain; download the brief.',
      );
    }
  }
  briefLines() {
    return [
      'MISSION OBJECTIVE',
      this.objective().trim() || 'Not entered',
      'USER-DECLARED PREPARATION (not verified equipment status)',
      ...PREPARATION_CHECKS.map((c) => `[${this.checks()[c.id] ? 'x' : ' '}] ${c.label}`),
      `User declarations: ${this.checkedCount()} of ${PREPARATION_CHECKS.length}. A checked list is not a readiness or safety clearance.`,
    ];
  }
}
