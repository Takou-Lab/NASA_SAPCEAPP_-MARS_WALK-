import { Component, computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';
import type { Point } from '../core/models';

interface DistanceSummary {
  derived: boolean;
  formatted: string;
  basis: string;
}

interface CoverageSummary {
  status: 'verified-aoi' | 'regional-context' | 'missing';
  label: string;
  detail: string;
}

function formatPointStatus(point: Point | null): string {
  return point ? `Set (${point.x}, ${point.y} px)` : 'Not set';
}

function formatMeters(meters: number): string {
  if (meters === 0) return '0';
  const maximumFractionDigits = meters > 0 && meters < 0.01 ? 4 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    useGrouping: false,
  }).format(meters);
}

@Component({
  selector: 'app-exploration-confidence',
  standalone: true,
  templateUrl: './exploration-confidence.component.html',
  styleUrl: './exploration-confidence.component.scss',
})
export class ExplorationConfidenceComponent {
  readonly mission = inject(MissionService);

  readonly startStatus = computed(() => formatPointStatus(this.mission.route().start));
  readonly destinationStatus = computed(() => formatPointStatus(this.mission.route().destination));
  readonly waypointsCount = computed(() => this.mission.route().waypoints.length);

  readonly endpointsStatus = computed(() => {
    const route = this.mission.route();
    if (route.start && route.destination) {
      return {
        complete: true,
        label: 'Complete endpoints',
        detail: 'Start and destination are both set.',
      };
    }
    if (!route.start && !route.destination) {
      return {
        complete: false,
        label: 'Incomplete endpoints',
        detail: 'Route endpoints are incomplete: start and destination are not set.',
      };
    }
    return {
      complete: false,
      label: 'Incomplete endpoints',
      detail: route.start
        ? 'Route endpoints are incomplete: destination is not set.'
        : 'Route endpoints are incomplete: start is not set.',
    };
  });

  readonly distanceSummary = computed<DistanceSummary>(() => {
    const assessment = this.mission.assessment();
    const meters = assessment.planarDistanceMeters;
    const image = this.mission.image();

    if (assessment.distanceStatus === 'derived' && meters !== null && Number.isFinite(meters)) {
      const scaleDetail =
        image?.calibration.verified && image.calibration.metersPerPixel !== null
          ? ` (${image.calibration.metersPerPixel} m/pixel)`
          : '';
      return {
        derived: true,
        formatted: `${formatMeters(meters)} m`,
        basis: `Derived from verified image-plane metric calibration${scaleDetail}. Planar image-plane distance only — not terrain-following distance.`,
      };
    }

    const reason = !image
      ? 'No verified image manifest is loaded; metric distance is unavailable.'
      : !this.endpointsStatus().complete
        ? 'Route endpoints are incomplete; metric distance is unavailable.'
        : 'Metric calibration for this prepared image is unverified; metric distance is unavailable and raw pixels are not meters.';

    return {
      derived: false,
      formatted: 'Metric distance unavailable',
      basis: reason,
    };
  });

  readonly terrainStatusLabel = computed(() =>
    this.mission.assessment().terrainStatus === 'unavailable'
      ? 'Unavailable'
      : this.mission.assessment().terrainStatus,
  );

  readonly coverageSummary = computed<CoverageSummary>(() => {
    const image = this.mission.image();
    if (!image) {
      return {
        status: 'missing',
        label: 'Missing image manifest',
        detail:
          'No verified image manifest is loaded; exploration-area coverage cannot be confirmed.',
      };
    }
    if (image.coverageStatus === 'verified-aoi') {
      return {
        status: 'verified-aoi',
        label: 'Verified AOI (verified-aoi)',
        detail:
          'Manifest records verified exploration-area overlap (verified-aoi). Terrain and hazard limits still apply.',
      };
    }
    return {
      status: 'regional-context',
      label: 'Regional context (regional-context)',
      detail:
        'Exact exploration-area overlap is unverified (regional-context). Visual context does not establish rover tie-points or north-up alignment.',
    };
  });

  readonly uniqueWarnings = computed(() => Array.from(new Set(this.mission.assessment().warnings)));
}
