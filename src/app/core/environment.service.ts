import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EnvironmentalContext, validEnvironmentalContext } from './environment';
@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private readonly http = inject(HttpClient);
  private started = false;
  private request = 0;
  private readonly contextState = signal<EnvironmentalContext | null>(null);
  private readonly statusState = signal<'loading' | 'pending' | 'ready' | 'error'>('loading');
  readonly context = this.contextState.asReadonly();
  readonly status = this.statusState.asReadonly();
  initialize(): void {
    if (!this.started) {
      this.started = true;
      this.reload();
    }
  }
  reload(): void {
    this.started = true;
    const request = ++this.request;
    this.contextState.set(null);
    this.statusState.set('loading');
    this.http.get<unknown>('data/environment.json').subscribe({
      next: (value) => {
        if (request !== this.request) return;
        if (!validEnvironmentalContext(value)) {
          this.statusState.set('error');
          return;
        }
        const copy = structuredClone(value);
        copy.readings.forEach(Object.freeze);
        Object.freeze(copy.readings);
        Object.freeze(copy);
        this.contextState.set(copy);
        this.statusState.set(copy.reviewStatus === 'accepted' ? 'ready' : 'pending');
      },
      error: () => {
        if (request === this.request) this.statusState.set('error');
      },
    });
  }
}
