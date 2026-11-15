# Environmental source investigation and illustrative converter

Updated 15 November 2026. Gaddielle supplied the prototype; coordinator corrections address temperature accounting and fixture wording. **No source-verified environmental measurements or runtime schema are approved.**

## 1. Source discovery and evidence boundary

- REMS archive discovery: https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html
- RAD archive discovery: https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD
- PDS search: https://pds.nasa.gov/

These are discovery references, not exact product citations or extraction evidence. REMS and RAD are different instruments; their units, intervals, detector definitions, quality flags and missing-value rules must be established separately from original product labels. Original product IDs/downloads/labels, raw hashes and row mappings have not been supplied for the fixture. No sample location, solar season, observation time, detector or quiet-Sun condition is verified. No numerical instrument background ranges are asserted by this prototype.

Next actual data delivery: one bounded original REMS pressure/temperature product with label/documentation, stable download/product/version, byte size/SHA-256, documented units/time/quality and a reproducible extraction mapping. RAD can follow independently if traceable. Keep historical rover context distinct from conditions on a drawn route. Do not infer human dose, terrain, safety or real-time conditions.

## 2. Illustrative test fixture and conversion conventions

[CSV](../../tools/data/samples/curiosity_rems_rad_sample.csv): **1380 bytes**, SHA-256 `c86e76dea60147a9f7ee1ae53fcab686cc293e1d59eb43f56787aa8fc06d9408`. Header comments were corrected; numeric rows are unchanged. Sol 3900–3915 and season fields are fixture identifiers/values, not evidence of actual traverse or archive coverage. There are 16 fixture rows: 14 quality-0 candidates and two quality-excluded rows.

The converter's shared quality flag (0 include; 1/2 exclude) and -9999 sentinel are **fixture conventions**, not verified REMS/RAD archive semantics. Per-quantity counts reflect these conventions only. Finite, ordered temperature intervals are retained without the previous undocumented -200 degC cutoff; intervals below absolute zero (-273.15 degC) are rejected as physically invalid. This basic physical bound is not an instrument calibration range. Complete missing intervals are excluded per quantity; partial missing intervals are rejected. Valid zero radiation is retained. Derived summaries use equal-weight means of supplied daily means and extrema from the same accepted intervals; duplicate sols and observation weighting need a source-specific contract before scientific use.

Generated output is always `illustrative-sample` / `illustrative`. The schema below is a **prototype proposal only**, not an approved shared interface. Do not generate or commit public runtime environmental data or implement a dependent UI from it. Original source verification and coordinator/Enzo schema agreement are separate gates.

## 3. Version 1 Environmental Data Schema Proposal

### A. TypeScript Interface Proposal (for `src/app/core/models.ts`)

```ts
export interface EnvironmentPerQuantityAudit {
  includedSolCount: number;
  sentinelExcluded: number;
  qualityExcluded: number;
}

export interface EnvironmentSource {
  title: string;
  url: string; // validated HTTPS URL
  credit: string;
}

export interface EnvironmentQuantity {
  id: 'atmospheric-pressure' | 'ambient-air-temperature' | 'surface-radiation-dose-rate';
  name: string;
  instrument: 'REMS' | 'RAD';
  unit: 'Pa' | 'degC' | 'uGy/day';
  mean: number | null;
  min: number | null;
  max: number | null;
  sampleCount: number;
  qualityStatus: 'illustrative-sample' | 'verified-archival' | 'unavailable';
  evidenceType: 'illustrative' | 'measured';
  aggregationMethod: string;
  observationInterval: string;
  perQuantityAudit: EnvironmentPerQuantityAudit;
  source: EnvironmentSource;
  limitations: string[];
}

export interface EnvironmentContext {
  schemaVersion: 1;
  region: string;
  dataStatus: 'illustrative-sample' | 'verified-archival';
  dataStatusNote: string;
  provenance: {
    mission: string;
    instruments: string[];
    pdsNodes: string[];
    disclaimer: string;
  };
  solRange: {
    startSol: number;
    endSol: number;
  };
  sampleAudit: {
    totalInputRows: number;
    includedRows: number;
    excludedRows: number;
  };
  quantities: EnvironmentQuantity[];
}
```

### B. Serialized JSON Example (`public/data/environment.json`)

```json
{
  "schemaVersion": 1,
  "region": "Mount Sharp foothills, Gale Crater, Mars",
  "dataStatus": "illustrative-sample",
  "dataStatusNote": "Values are from an illustrative fixture CSV. Exact original PDS product IDs, label files, raw-file hashes and row extraction have not been verified. Do not display these as confirmed NASA measurements.",
  "provenance": {
    "mission": "Mars Science Laboratory (Curiosity Rover)",
    "instruments": [
      "REMS",
      "RAD"
    ],
    "pdsNodes": [
      "Planetary Data System Atmospheres Node",
      "Planetary Data System Planetary Plasma Interactions Node"
    ],
    "disclaimer": "Illustrative fixture; archive landing pages are discovery references only. Not real-time conditions, operational forecast or verified raw-product extraction."
  },
  "solRange": {
    "startSol": 3900,
    "endSol": 3915
  },
  "sampleAudit": {
    "totalInputRows": 16,
    "includedRows": 14,
    "excludedRows": 2
  },
  "quantities": [
    {
      "id": "atmospheric-pressure",
      "name": "Surface Atmospheric Pressure",
      "instrument": "REMS",
      "unit": "Pa",
      "mean": 806.1,
      "min": 767.9,
      "max": 843.5,
      "sampleCount": 14,
      "qualityStatus": "illustrative-sample",
      "evidenceType": "illustrative",
      "aggregationMethod": "mean of daily mean values; min/max span daily column minima/maxima across included sols",
      "observationInterval": "Sol 3900 to Sol 3915 (illustrative Gale Crater sample)",
      "perQuantityAudit": {
        "includedSolCount": 14,
        "sentinelExcluded": 0,
        "qualityExcluded": 2
      },
      "source": {
        "title": "NASA PDS MSL REMS Archive (illustrative sample; exact product/extraction unverified)",
        "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
        "credit": "NASA/JPL-Caltech/CAB (illustrative fixture only)"
      },
      "limitations": [
        "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
        "Diurnal barometric amplitude reflects regional atmospheric tidal dynamics, not terrain microrelief.",
        "Illustrative fixture only; no rover observation, location or acquisition interval is verified."
      ]
    },
    {
      "id": "ambient-air-temperature",
      "name": "Illustrative Air Temperature",
      "instrument": "REMS",
      "unit": "degC",
      "mean": -47.6,
      "min": -78.7,
      "max": -17.2,
      "sampleCount": 14,
      "qualityStatus": "illustrative-sample",
      "evidenceType": "illustrative",
      "aggregationMethod": "mean of daily mean values; min/max span daily column minima/maxima across included sols",
      "observationInterval": "Sol 3900 to Sol 3915 (illustrative sample)",
      "perQuantityAudit": {
        "includedSolCount": 14,
        "sentinelExcluded": 0,
        "qualityExcluded": 2
      },
      "source": {
        "title": "NASA PDS MSL REMS Archive (illustrative sample; exact product/extraction unverified)",
        "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
        "credit": "NASA/JPL-Caltech/CAB (illustrative fixture only)"
      },
      "limitations": [
        "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
        "No sensor position or rover location has been verified for these fixture values.",
        "Fixture extrema are not verified Martian observations or climatological bounds."
      ]
    },
    {
      "id": "surface-radiation-dose-rate",
      "name": "Illustrative Absorbed Dose Rate",
      "instrument": "RAD",
      "unit": "uGy/day",
      "mean": 211.7,
      "min": 208.7,
      "max": 215.0,
      "sampleCount": 14,
      "qualityStatus": "illustrative-sample",
      "evidenceType": "illustrative",
      "aggregationMethod": "mean/min/max of daily absorbed dose rate values across included sols",
      "observationInterval": "Sol 3900 to Sol 3915 (illustrative sample)",
      "perQuantityAudit": {
        "includedSolCount": 14,
        "sentinelExcluded": 0,
        "qualityExcluded": 2
      },
      "source": {
        "title": "NASA PDS MSL RAD Archive (illustrative sample; exact product/extraction unverified)",
        "url": "https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD",
        "credit": "NASA/JPL-Caltech/SwRI/CAU (illustrative fixture only)"
      },
      "limitations": [
        "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
        "Detector, shielding, solar activity and geographic context are unverified for this fixture.",
        "Does not imply human safety or operational exploration limits without dedicated habitat shielding.",
        "Route transit time cannot be multiplied into dose without verified shielding and velocity models."
      ]
    }
  ]
}
```

---

## 4. Extraction Tooling & Test Coverage

To ensure reproducible, defensive, non-speculative data extraction addressing review items R1–R4:

1. **Extraction Tool ([`tools/data/prepare_environment.py`](../../tools/data/prepare_environment.py)):**
   - **R1 (Provenance):** Labels output `illustrative-sample` and `evidenceType: illustrative`, removing false verified claims while exact product downloads remain unverified.
   - **R2 (Source Protection):** Rejects source/output aliases (`paths_alias`) before any write operation; exits with code 1, leaving source and destination bytes and timestamps completely untouched.
   - **R3 (Finite Data & Consistency):** Validates all floating-point fields are finite (`math.isfinite`), rejecting `NaN`, `±Infinity`, and overflow values. Validates interval consistency (`min <= mean <= max`) for quality-0 non-sentinel rows. Uses strict JSON serialization (`allow_nan=False`).
   - **R4 (Independent Auditing & Legitimate Zeros):** Conducts independent per-quantity sentinel filtering (`perQuantityAudit`), ensuring missing values in one sensor do not discard valid readings in another. Preserves legitimate zero values (e.g. 0.0 radiation dose rate).
   - Generates deterministic JSON atomically (using temporary file, `os.fsync`, and `os.replace`).
   - Supports read-only validation (`--check`) mode without touching files or altering `mtime`.
2. **Automated Unit Tests ([`tools/data/test_prepare_environment.py`](../../tools/data/test_prepare_environment.py)):**
   - 16 test cases covering:
     - `test_successful_generation_from_sample`: Verifies parsing, schema keys, per-quantity audit, and aggregate values.
     - `test_deterministic_output`: Confirms repeated executions produce byte-identical JSON.
     - `test_check_mode_passes_on_matching_file`: Confirms `--check` returns exit `0` without altering `mtime`.
     - `test_check_mode_fails_on_tampered_value`: Confirms altered metrics trigger exit `1`.
     - `test_check_mode_fails_on_missing_file`: Confirms missing output triggers exit `1`.
     - `test_sentinel_and_quality_filtering`: Confirms `-9999.0` and `quality_flag > 0` rows are excluded.
     - `test_missing_source_fails_cleanly`: Confirms nonexistent CSV exits `1` without traceback.
     - `test_malformed_csv_fails_cleanly`: Confirms bad headers exit `1` without traceback.
     - `test_atomic_write_preserves_existing_file_on_failure`: Confirms existing output file bytes and timestamps are preserved if extraction fails.
     - `test_output_aliasing_source_fails_and_preserves_source` (R2): Confirms passing identical source and output exits 1 and preserves source.
     - `test_output_aliasing_source_relative_path_fails` (R2): Confirms relative alias paths are caught and rejected.
     - `test_nan_input_rejected_and_preserves_destination` (R3): Confirms NaN is rejected with exit 1 and preserves destination.
     - `test_infinity_input_rejected_and_preserves_destination` (R3): Confirms Inf is rejected with exit 1 and preserves destination.
     - `test_overflow_input_rejected_and_preserves_destination` (R3): Confirms 1e309 overflow is rejected with exit 1.
     - `test_inconsistent_min_mean_max_rejected_and_preserves_destination` (R3): Confirms min > mean or mean > max is rejected with exit 1.
     - `test_legitimate_zero_radiation_preserved` (R4): Confirms 0.0 radiation is preserved as a valid measurement.
     - `test_per_quantity_independent_sentinel_handling` (R4): Confirms sentinel in one instrument does not discard valid data in another.

---

## 5. Handoff Protocol & Verification

| Role | Responsibility | Action Required |
| :--- | :--- | :--- |
| **Gaddielle (Data Owner)** | Source audit, sample compilation, converter tool, test coverage. | Prototype correction delivery only; actual source acquisition and scientific schema approval remain pending. See the latest coordinator review for tested totals. |
| **Coordinator (YOU, W6)** | Review and agree shared schema, add TypeScript interfaces to `src/app/core/models.ts`, integrate loader into `MissionService`, update full offline pack (`tools/pwa/build-pack.mjs`). | Require verified sources and agree versioned fields before any runtime file or loader implementation. |
| **Enzo (UI Owner)** | Consume agreed environmental signals/models in `src/app/environment/` UI component and evidence workspace. | Review actual verified-data needs; do not mount illustrative fixture output or import unagreed APIs. |
