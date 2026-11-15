# MARSWALK — Environmental Source Audit & Schema Proposal

<!-- CURRENT_WORK_PLAN -->
> **Investigation, Source Audit & Schema Proposal Record (Phase A).** Prepared by Gaddielle (Data/Imagery Owner, [GADDIELLE.md](../team/GADDIELLE.md)) for Coordinator (YOU, [W6](../../TEAM_TASKS.md#w6)) and Enzo ([W3/Phase 2](../team/ENZO.md#phase-2--numerical-science-ui-and-clearer-evidence)).
<!-- /CURRENT_WORK_PLAN -->

## Purpose & Scope

This document delivers **Phase A** of the numerical environmental data work for MARSWALK:
1. Technical investigation and source audit of NASA Planetary Data System (PDS) Curiosity REMS and RAD data archives.
2. Reviewable source rows and representative archival sample covering Curiosity's traverse sector in Gale Crater.
3. Rigorous RAD radiation feasibility assessment, human exposure limitations, and physical boundary constraints.
4. Proposed Version 1 JSON schema contract (`public/data/environment.json`) and corresponding TypeScript interface proposal for `src/app/core/models.ts`.
5. Local conversion tool prototype ([`tools/data/prepare_environment.py`](../../tools/data/prepare_environment.py)) and comprehensive automated unit test suite ([`tools/data/test_prepare_environment.py`](../../tools/data/test_prepare_environment.py)).

> [!IMPORTANT]
> **Data Governance & Boundary Contract:**
> 1. **Archival Observations, Not Live Forecasts:** Mars atmospheric and radiation datasets from the Mars Science Laboratory (MSL Curiosity) rover in Gale Crater are released through scheduled PDS volume publications; real-time operational weather feeds are not published to public web clients.
> 2. **Regional Context Only:** These values represent the planetary boundary layer at the Gale Crater floor / Mount Sharp foothills (~-4.4 km elevation). They are **not** localized microclimates along an astronaut's drawn route.
> 3. **No Imputed Radiation or Route-Walking Doses:** Radiation dose rates cannot be multiplied by estimated route walking time to fabricate an exposure risk. Without validated spacesuit shielding, EVA velocity, and metabolic models, human exposure numbers must remain explicitly `unavailable`.
> 4. **Illustrative Sample Classification (R1):** The committed 16-row sample CSV is an **illustrative test-only fixture**. Because exact original PDS product IDs, label files (.LBL), raw binary tables, and download checksums could not be retrieved from the network-restricted cloud environment during this sprint, the data is explicitly classified as `dataStatus: "illustrative-sample"` with `evidenceType: "illustrative"`, NOT confirmed NASA measurements (`verified-archival`).
> 5. **Pre-Generation Agreement Gate:** In accordance with the shared team contract, the runtime file `public/data/environment.json` will only be committed after the Coordinator and Enzo formally agree on the schema and source provenance.

---

## 1. Audited NASA PDS Source Products

### A. Curiosity REMS (Rover Environmental Monitoring Station)

- **Instrument Overview:** REMS was contributed to NASA's Mars Science Laboratory (MSL) mission by the Centro de Astrobiología (CAB / INTA-CSIC) in Madrid, Spain. It measures surface pressure, air and ground temperatures, relative humidity, wind speed, and ultraviolet radiation.
- **Audited Product Line:** MSL REMS Reduced Data Record (RDR) & Daily Weather Summaries.
- **PDS Archive Node:** NASA Planetary Data System (PDS) Atmospheres Node.
- **Archive Collection URL:** `https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html`
- **Principal Investigator:** Javier Gómez-Elvira, Centro de Astrobiología (CAB).
- **Physical Quantities & Units:**
  - **Surface Atmospheric Pressure:** Measured by a barometric sensor inside the rover warm electronics box. Units: Pascals (`Pa`). Typical diurnal amplitude: ~740 to 860 Pa (reflecting daily atmospheric thermal tides and seasonal $CO_2$ polar cap sublimation/condensation cycles).
  - **Ambient Air Temperature:** Measured by thermocouple sensors on Boom 1 and Boom 2 deployed at approximately 1.5 meters height on the rover mast. Units: Degrees Celsius (`degC` or `°C`). Typical diurnal amplitude: -79°C (minimum at dawn) to -14°C (maximum in early afternoon).
- **Quality & Sentinel Rules:**
  - `quality_flag = 0`: Valid measurement row.
  - `quality_flag = 1`: Degraded or questionable measurement.
  - `quality_flag = 2`: Sensor offline or missing data (sentinel `-9999.0`).
- **Provenance Limitation:** While these instrument characteristics are derived from published CAB/PDS documentation, exact PDS product IDs and raw download hashes for Sols 3900–3915 have not been validated against archive downloads. Output is labeled `illustrative-sample`.

### B. Curiosity RAD (Radiation Assessment Detector) Feasibility Assessment

- **Instrument Overview:** RAD was developed by Southwest Research Institute (SwRI) in Boulder, Colorado, and Christian-Albrechts-Universität (CAU) zu Kiel, Germany. It measures energetic charged particles, neutrons, and gamma rays on the Martian surface.
- **Audited Product Line:** MSL RAD Calibrated Science Observation RDR.
- **PDS Archive Node:** NASA PDS Planetary Plasma Interactions (PPI) Node.
- **Archive Collection URL:** `https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD`
- **Key Scientific Literature:**
  - Hassler, D. M. et al., *Mars' Surface Radiation Environment Measured with the Mars Science Laboratory's Curiosity Rover*, **Science**, 343(6169), 2014. DOI: [10.1126/science.1244797](https://doi.org/10.1126/science.1244797).
  - Zeitlin, C. et al., *Measurements of the Martian surface radiation environment with MSL/RAD*, **Life Sciences in Space Research**, 22, 2019. DOI: [10.1016/j.lssr.2019.07.005](https://doi.org/10.1016/j.lssr.2019.07.005).
- **Principal Investigator:** Donald M. Hassler, Southwest Research Institute (SwRI).
- **Physical Quantities & Units:**
  - **Surface Absorbed Dose Rate:** Energy deposited per unit mass in silicon detector B and plastic scintillators E/F. Units: Micrograys per day (`uGy/day` or $\mu\text{Gy/day}$). Gale Crater baseline Galactic Cosmic Ray (GCR) background: ~210 $\pm$ 40 $\mu\text{Gy/day}$ during low solar activity periods.
  - **Dose Equivalent Rate:** Derived using radiation quality factors ($Q \approx 3.0$) representing biological damage. Typical baseline: ~640 $\pm$ 120 $\mu\text{Sv/day}$ (~0.64 mSv/day).
- **Feasibility Evaluation & Limitations:**
  - **FEASIBLE:** Presenting verified or illustrative archival absorbed dose rates (`uGy/day`) as a regional environmental baseline representing the unshielded surface background in Gale Crater.
  - **STRICTLY UNFEASIBLE:** Multiplying dose rates by route walking duration to display an accumulated route radiation dose. The application has no validated spacesuit shielding thickness, no human metabolic transit speed, and no terrain horizon shielding calculation. Doing so would violate scientific integrity.
  - **DECISION:** Include surface radiation dose rate strictly as a regional context quantity with explicit limitations.

---

## 2. Reviewable Source Rows & Archival Sample

A representative sample covering Curiosity's traverse near the lower Mount Sharp foothills (Gediz Vallis / Boxwork exploration sector, Sols 3900–3915, Mars Year 37, $L_s \approx 145^\circ - 153^\circ$) has been compiled:

- **Sample File Path:** [`tools/data/samples/curiosity_rems_rad_sample.csv`](../../tools/data/samples/curiosity_rems_rad_sample.csv)
- **File Size:** 1,648 bytes
- **SHA-256 Checksum:** `d2d047acbcbdbe1521563345e19720b22da923b6f9bde5d799ee7bdf07d95180`
- **Classification:** **Illustrative Test-Only Fixture** (R1).
- **Row Accounting:** 16 input rows, 14 included rows (`quality_flag == 0`), 2 excluded rows (Sol 3908 with `quality_flag = 2`, Sol 3914 with `quality_flag = 1`).

### Reviewable Source Rows Table

| Sol | Solar Longitude ($L_s$) | Min Press (Pa) | Max Press (Pa) | Mean Press (Pa) | Min Air Temp (°C) | Max Air Temp (°C) | Mean Air Temp (°C) | RAD Dose Rate ($\mu\text{Gy/day}$) | Quality Flag | Extraction Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **3900** | 145.0° | 774.2 | 841.5 | 807.8 | -76.5 | -18.4 | -47.4 | 211.5 | 0 | **Included** |
| **3901** | 145.5° | 775.1 | 842.3 | 808.7 | -76.8 | -18.2 | -47.5 | 212.0 | 0 | **Included** |
| **3902** | 146.0° | 772.8 | 839.7 | 806.2 | -77.1 | -17.9 | -47.5 | 209.4 | 0 | **Included** |
| **3903** | 146.5° | 771.5 | 838.4 | 804.9 | -77.4 | -18.1 | -47.7 | 210.8 | 0 | **Included** |
| **3904** | 147.0° | 773.0 | 840.1 | 806.5 | -76.9 | -17.8 | -47.3 | 213.2 | 0 | **Included** |
| **3905** | 147.5° | 774.8 | 841.9 | 808.3 | -76.2 | -17.5 | -46.8 | 208.7 | 0 | **Included** |
| **3906** | 148.0° | 776.0 | 843.5 | 809.7 | -75.8 | -17.2 | -46.5 | 214.1 | 0 | **Included** |
| **3907** | 148.5° | 775.4 | 842.8 | 809.1 | -76.0 | -17.4 | -46.7 | 211.0 | 0 | **Included** |
| **3908** | 149.0° | *-9999.0* | *-9999.0* | *-9999.0* | *-9999.0* | *-9999.0* | *-9999.0* | *-9999.0* | 2 | **Excluded** (offline) |
| **3909** | 149.5° | 773.9 | 840.8 | 807.3 | -76.7 | -18.0 | -47.3 | 212.5 | 0 | **Included** |
| **3910** | 150.0° | 772.1 | 838.9 | 805.5 | -77.2 | -18.3 | -47.7 | 209.8 | 0 | **Included** |
| **3911** | 150.5° | 771.0 | 837.6 | 804.3 | -77.5 | -18.6 | -48.0 | 210.3 | 0 | **Included** |
| **3912** | 151.0° | 770.4 | 836.8 | 803.6 | -77.8 | -18.8 | -48.3 | 215.0 | 0 | **Included** |
| **3913** | 151.5° | 769.8 | 836.0 | 802.9 | -78.1 | -19.0 | -48.5 | 213.8 | 0 | **Included** |
| **3914** | 152.0° | 768.5 | 834.9 | 801.7 | -78.4 | -19.2 | -48.8 | *-9999.0* | 1 | **Excluded** (degraded) |
| **3915** | 152.5° | 767.9 | 834.1 | 801.0 | -78.7 | -19.5 | -49.1 | 211.2 | 0 | **Included** |

---

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
    "disclaimer": "Illustrative fixture sample derived from documented archive landing pages. Not real-time conditions, operational forecast or verified raw-product extraction."
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
        "Historical archival sample from Curiosity traverse; not active real-time conditions."
      ]
    },
    {
      "id": "ambient-air-temperature",
      "name": "Ambient Air Temperature (1.5 m)",
      "instrument": "REMS",
      "unit": "degC",
      "mean": -47.6,
      "min": -78.7,
      "max": -17.2,
      "sampleCount": 14,
      "qualityStatus": "illustrative-sample",
      "evidenceType": "illustrative",
      "aggregationMethod": "mean of daily mean values; min/max span daily column minima/maxima across included sols",
      "observationInterval": "Sol 3900 to Sol 3915 (rover mast height, illustrative sample)",
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
        "Measured at rover mast height (~1.5 m) along Curiosity traverse path in Gale Crater.",
        "Extreme diurnal range (~60 degC) is characteristic of low-density Martian atmosphere."
      ]
    },
    {
      "id": "surface-radiation-dose-rate",
      "name": "Surface Absorbed Dose Rate (GCR background)",
      "instrument": "RAD",
      "unit": "uGy/day",
      "mean": 211.7,
      "min": 208.7,
      "max": 215.0,
      "sampleCount": 14,
      "qualityStatus": "illustrative-sample",
      "evidenceType": "illustrative",
      "aggregationMethod": "mean/min/max of daily absorbed dose rate values across included sols",
      "observationInterval": "Sol 3900 to Sol 3915 (illustrative surface GCR background)",
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
        "Galactic cosmic ray (GCR) background dose rate; Gale Crater surface elevation (~-4.4 km) context only.",
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
| **Gaddielle (Data Owner)** | Source audit, sample compilation, converter tool, test coverage. | **Complete (Phase A Corrections).** Delivered audit, illustrative CSV, converter tool with alias/finite/range protections, and 16 tests (50 tests total in tools/data). |
| **Coordinator (YOU, W6)** | Review and agree shared schema, add TypeScript interfaces to `src/app/core/models.ts`, integrate loader into `MissionService`, update full offline pack (`tools/pwa/build-pack.mjs`). | Review proposed illustrative contract above; agree on dataStatus/perQuantityAudit fields before Phase B runtime file generation. |
| **Enzo (UI Owner)** | Consume agreed environmental signals/models in `src/app/environment/` UI component and evidence workspace. | Review display fields, units, and illustrative-sample status badges; prepare presentation layer without importing unagreed APIs. |
