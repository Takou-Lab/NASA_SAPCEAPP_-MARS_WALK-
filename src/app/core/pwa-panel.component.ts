import { Component, inject } from '@angular/core';
import { PwaService } from './pwa.service';

@Component({
  selector: 'app-pwa-panel',
  standalone: true,
  template: `
    <details class="pwa-panel">
      <summary>Install & offline · {{ pwa.online() ? 'Connection available' : 'Disconnected' }} · {{ pwa.state() === 'ready' ? 'Pack verified' : 'Pack ' + pwa.state() }}</summary>
      <p role="status">{{ pwa.message() }}</p>
      @if (pwa.progress(); as progress) { <p>{{ progress.completed }} / {{ progress.total }} files verified</p> }
      @if (pwa.version(); as version) { <p>Pack {{ version.slice(0, 12) }} · {{ pwa.totalBytes() }} bytes</p> }
      @if (pwa.state() !== 'unsupported') {
        <button type="button" (click)="pwa.prepare()" [disabled]="pwa.state() === 'preparing' || pwa.state() === 'checking'">Prepare offline</button>
        <button type="button" (click)="pwa.check()" [disabled]="pwa.state() === 'preparing' || pwa.state() === 'checking'">Verify saved pack</button>
        <button type="button" (click)="pwa.checkForUpdate()">Check for updates</button>
      }
      @if (pwa.canInstall()) { <button type="button" (click)="pwa.install()">Install MARSWALK</button> }
      @if (pwa.updateAvailable()) { <p>An update is waiting. Save/export work in every tab before applying it.</p><button type="button" (click)="pwa.applyUpdate()" [disabled]="pwa.state() === 'preparing'">Prepare & apply update</button> }
      <p>Install using your browser's install or Add to Home Screen menu if offered. Installation and offline preparation are separate. Browser storage may be cleared or evicted; verify again before disconnecting. External source websites need a connection.</p>
    </details>
  `,
  styles: `:host{display:block} .pwa-panel{padding:.5rem .8rem;background:#14212d;color:#e7edf2;border-bottom:1px solid #405161;font-size:.8rem}summary{cursor:pointer;min-height:24px}p{max-width:90ch}button{min-height:44px;margin:0 .5rem .4rem 0;padding:.4rem .7rem;background:#233b4d;color:#fff;border:1px solid #7596aa;border-radius:.3rem}button:focus-visible,summary:focus-visible{outline:3px solid #f0ab7d}button:disabled{opacity:.55}`,
})
export class PwaPanelComponent {
  readonly pwa = inject(PwaService);
  constructor() { void this.pwa.initialize(); }
}
