import { describe, expect, it, beforeEach } from 'vitest';
import { Route } from './models';
import {
  getObsStorageKey,
  getRouteStorageKey,
  loadObservationsFromStorage,
  loadRouteFromStorage,
  saveObservationsToStorage,
  saveRouteToStorage,
  validateObservationText,
  validateStoredRoute,
} from './storage-helpers';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('storage-helpers', () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  describe('route storage', () => {
    const testRoute: Route = {
      start: { x: 10, y: 20 },
      destination: { x: 100, y: 200 },
      waypoints: [{ x: 50, y: 60 }],
    };

    it('saves and loads route for matching imageRef', () => {
      const saveRes = saveRouteToStorage(testRoute, 'ref_a', mockStorage);
      expect(saveRes.ok).toBe(true);

      const loadRes = loadRouteFromStorage('ref_a', mockStorage);
      expect(loadRes.ok).toBe(true);
      expect(loadRes.route).toEqual(testRoute);
    });

    it('refuses to load route when imageRef does not match', () => {
      saveRouteToStorage(testRoute, 'ref_a', mockStorage);
      const loadRes = loadRouteFromStorage('ref_b', mockStorage);
      expect(loadRes.ok).toBe(false);
      expect(loadRes.error).toContain('No saved route found');
    });

    it('validates schemaVersion and rejects corrupted JSON', () => {
      mockStorage.setItem(getRouteStorageKey('ref_corrupt'), 'invalid json string');
      const loadRes = loadRouteFromStorage('ref_corrupt', mockStorage);
      expect(loadRes.ok).toBe(false);
    });
  });

  describe('observation storage', () => {
    it('validates note text: rejects empty or whitespace-only', () => {
      expect(validateObservationText('').valid).toBe(false);
      expect(validateObservationText('   \n  \t  ').valid).toBe(false);
      expect(validateObservationText('Valid geological feature observed').valid).toBe(true);
    });

    it('saves and loads observations list for matching imageRef', () => {
      const obsList = [
        {
          id: 'obs_1',
          imageRef: 'img_gale',
          createdAt: new Date().toISOString(),
          text: 'Cross-bedding in sandstone layer',
          position: { x: 150, y: 250 },
        },
      ];

      const saveRes = saveObservationsToStorage(obsList, 'img_gale', mockStorage);
      expect(saveRes.ok).toBe(true);

      const loadRes = loadObservationsFromStorage('img_gale', mockStorage);
      expect(loadRes.ok).toBe(true);
      expect(loadRes.observations).toEqual(obsList);
    });
  });
});
