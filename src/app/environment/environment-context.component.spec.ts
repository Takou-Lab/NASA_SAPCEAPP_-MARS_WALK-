import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EnvironmentContextComponent } from './environment-context.component';
import supplied from '../../../public/data/environment.json';
const pending = { ...supplied, reviewStatus: 'pending', readings: [] };
describe('Environmental context presentation', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnvironmentContextComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('withholds submitted values and exposes source/review limitations', () => {
    const f = TestBed.createComponent(EnvironmentContextComponent);
    f.detectChanges();
    http.expectOne('data/environment.json').flush(pending);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('measurements withheld');
    expect(f.nativeElement.textContent).toContain('not current conditions');
    expect(f.nativeElement.querySelectorAll('article').length).toBe(0);
    expect(f.nativeElement.querySelector('a').getAttribute('rel')).toBe('noopener noreferrer');
  });
  it('shows contributor excerpt values with visible provenance limits rather than a verified-data claim', () => {
    const f = TestBed.createComponent(EnvironmentContextComponent);
    f.detectChanges();
    http.expectOne('data/environment.json').flush(supplied);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Limited source review — excerpt only');
    expect(f.nativeElement.textContent).toContain('not independently verified');
    expect(f.nativeElement.querySelectorAll('article').length).toBe(2);
    expect(f.nativeElement.textContent).toContain('Parent product interval');
    expect(f.nativeElement.textContent).not.toContain('Reviewed historical observations');
  });

  it('offers retry after invalid data instead of rendering unreviewed numbers', () => {
    const f = TestBed.createComponent(EnvironmentContextComponent);
    f.detectChanges();
    http.expectOne('data/environment.json').flush({ ...pending, readings: [{ value: 777 }] });
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(f.nativeElement.textContent).not.toContain('777');
    f.nativeElement.querySelector('button').click();
    http.expectOne('data/environment.json').flush(pending);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('measurements withheld');
  });
});
