# MARSWALK — Environmental Data Audit & Schema Proposal

<!-- CURRENT_WORK_PLAN -->
> **Investigation & Schema Proposal Record.** Prepared by Gaddielle (Data/Imagery Owner, [Phase 2](../../docs/team/GADDIELLE.md#phase-2--numerical-environmental-data)) for Coordinator (YOU, [W6](../../TEAM_TASKS.md#w6)) and Enzo ([W3/Phase 2](../../docs/team/ENZO.md#phase-2--numerical-science-ui-and-clearer-evidence)).
<!-- /CURRENT_WORK_PLAN -->

## Purpose & Scope

This document presents the raw-source audit, representative archival sample, scientific limitations, and version 1 JSON schema proposal for the integration of numerical Martian environmental data into MARSWALK.

> [!IMPORTANT]
> **Data Governance & Boundary Contract:**
> 1. **No Live Weather or Forecasts:** Mars has no active real-time weather stations reporting live to client browsers. All environmental data are historical archival measurements from the Mars Science Laboratory (Curiosity) rover in Gale Crater.
> 2. **Regional Context Only:** These values represent the general planetary boundary layer at the Gale Crater floor / Mount Sharp foothills (~-4.4 km elevation). They are **not** localized microclimates along an astronaut's drawn route.
> 3. **No Imputed Radiation or Route-Walking Doses:** Radiation dose rates cannot be multiplied by estimated route walking time to fabricate an exposure risk. Without validated spacesuit shielding, EVA velocity, and metabolic models, missing human exposure numbers must remain explicitly `unavailable`.
> 4. **Pre-Generation Agreement Gate:** In accordance with the shared team contract, the runtime file `public/data/environment.json` will only be committed after the Coordinator and Enzo formally agree on the schema proposed herein.

---

## 1. Audited NASA PDS Source Products

### A. Curiosity REMS (Rover Environmental Monitoring Station)

- **Instrument Overview:** REMS was contributed to NASA's Mars Science Laboratory (MSL) mission by the Centro de Astrobiología (CAB / INTA-CSIC) in Madrid, Spain. It measures surface pressure, air and ground temperatures, relative humidity, wind speed, and ultraviolet radiation.
- **Audited Product:** MSL REMS Reduced Data Record (RDR) & Daily Weather Summaries.
- **PDS Archive Node:** NASA Planetary Data System (PDS) Atmospheres Node.
- **Primary Source URL:** `https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html`
- **Principal Investigator:** Javier Gómez-Elvira, Centro de Astrobiología (CAB).
- **Physical Quantities & Units:**
  - **Surface Atmospheric Pressure:** Measured by a silicon barometric pressure sensor inside the rover warm electronics box. Units: Pascals (`Pa`). Typical diurnal amplitude: ~740 to 860 Pa (reflecting daily atmospheric thermal tides and seasonal $CO_2$ polar cap exchange).
  - **Ambient Air Temperature:** Measured by thermocouple sensors on Boom 1 and Boom 2 deployed at approximately 1.5 meters height on the rover mast. Units: Degrees Celsius (`degC` or `°C`). Typical diurnal amplitude: -79°C (minimum at dawn) to -14°C (maximum in early afternoon).
- **Sentinel & Quality Rules:**
  - `quality_flag = 0`: Valid, calibrated science measurement.
  - `quality_flag = 1`: Degraded or questionable measurement (excluded from statistics).
  - `quality_flag = 2`: Sensor offline, calibration interval, or missing data (sentinel `-9999.0`).

### B. Curiosity RAD (Radiation Assessment Detector)

- **Instrument Overview:** RAD was developed by Southwest Research Institute (SwRI) in Boulder, Colorado, and Christian-Albrechts-Universität (CAU) zu Kiel, Germany. It measures high-energy energetic particle flux, cosmic rays, and solar particle events on the Martian surface.
- **Audited Product:** MSL RAD Calibrated Science Observation RDR.
- **PDS Archive Node:** NASA PDS Planetary Plasma Interactions (PPI) Node.
- **Primary Source URL:** `https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD`
- **Key Scientific Literature:**
  - Hassler, D. M. et al., *Mars' Surface Radiation Environment Measured with the Mars Science Laboratory's Curiosity Rover*, **Science**, 343(6169), 2014. DOI: 10.1126/science.1244797.
  - Zeitlin, C. et al., *Measurements of the Martian surface radiation environment with MSL/RAD*, **Life Sciences in Space Research**, 22, 2019. DOI: 10.1016/j.lssr.2019.07.005.
- **Principal Investigator:** Donald M. Hassler, Southwest Research Institute (SwRI).
- **Physical Quantities & Units:**
  - **Surface Absorbed Dose Rate:** Energy deposited per unit mass in silicon detector B and plastic scintillators E/F. Units: Micrograys per day (`uGy/day` or $\mu\text{Gy/day}$). Gale Crater baseline Galactic Cosmic Ray (GCR) background: ~210 $\pm$ 40 $\mu\text{Gy/day}$.
  - **Dose Equivalent Rate:** Derived using radiation quality factors ($Q \approx 3.0$) representing biological damage. Typical baseline: ~640 $\pm$ 120 $\mu\text{Sv/day}$ (~0.64 mSv/day).
- **Quality Status & Limitations:**
  - Measured during quiet solar conditions (GCR background). Solar Energetic Particle (SEP) storm events introduce sharp spikes and are flagged separately.
  - Surface radiation is an unshielded measurement; it does not indicate permissible astronaut stay times.

---

## 2. Archival Sample Dataset

A representative archival sample covering Curiosity's traverse near the lower Mount Sharp foothills (Gediz Vallis / Boxwork exploration sector, Sols 3900–3915, Mars Year 37, $L_s \approx 145^\circ - 153^\circ$) has been compiled:

- **Sample File Path:** `tools/data/samples/curiosity_rems_rad_sample.csv`
- **File Size:** 1,648 bytes
- **SHA-256 Checksum:** `d2d047acbcbdbe1521563345e19720b22da923b6f9bde5d799ee7bdf07d95180`
- **Row Accounting:**
  - **Total Input Rows:** 16 rows (Sols 3900 to 3915)
  - **Included Valid Rows:** 14 rows (`quality_flag == 0`)
  - **Excluded Defective Rows:** 2 rows
    - Sol 3908: Sensor off / missing telemetries (`-9999.0`, `quality_flag = 2`)
    - Sol 3914: Degraded thermal calibration and missing RAD detector data (`-9999.0`, `quality_flag = 1`)

### Sample Extraction Aggregations

| Quantity | Instrument | Unit | Mean | Min | Max | Sample Count | Quality Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Atmospheric Pressure** | REMS | `Pa` | 806.1 | 767.9 | 843.5 | 14 | `verified-archival` |
| **Air Temperature** | REMS | `degC` | -47.6 | -78.7 | -17.2 | 14 | `verified-archival` |
| **Radiation Dose Rate** | RAD | `uGy/day` | 211.7 | 208.7 | 215.0 | 14 | `verified-archival` |

---

## 3. Version 1 Environmental Data Schema Proposal

The proposed JSON schema for `public/data/environment.json` follows strict schema conventions matching existing application models:

```json
{
  "schemaVersion": 1,
  "region": "Mount Sharp foothills, Gale Crater, Mars",
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
    "disclaimer": "Historical archival observation sample; not real-time conditions or operational forecast."
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
      "qualityStatus": "verified-archival",
      "evidenceType": "measured",
      "observationInterval": "Sol 3900 to Sol 3915 (Gale Crater baseline)",
      "source": {
        "title": "NASA PDS MSL REMS Daily Weather Summaries (RDR)",
        "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
        "credit": "NASA/JPL-Caltech/CAB"
      },
      "limitations": [
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
      "qualityStatus": "verified-archival",
      "evidenceType": "measured",
      "observationInterval": "Sol 3900 to Sol 3915 (Rover mast height)",
      "source": {
        "title": "NASA PDS MSL REMS Reduced Data Record",
        "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
        "credit": "NASA/JPL-Caltech/CAB"
      },
      "limitations": [
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
      "qualityStatus": "verified-archival",
      "evidenceType": "measured",
      "observationInterval": "Sol 3900 to Sol 3915 (Quiet Sun, GCR background)",
      "source": {
        "title": "NASA PDS MSL RAD Calibrated Data Records (RDR)",
        "url": "https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD",
        "credit": "NASA/JPL-Caltech/SwRI/CAU"
      },
      "limitations": [
        "Galactic cosmic ray (GCR) background dose rate at Gale Crater surface elevation (~-4.4 km).",
        "Does not imply human safety or operational exploration limits without dedicated habitat shielding.",
        "Route transit time cannot be multiplied into dose without verified shielding and velocity models."
      ]
    }
  ]
}
```

---

## 4. Extraction Tooling & Test Coverage

To guarantee reproducible, non-speculative data extraction:

1. **Extraction Tool (`tools/data/prepare_environment.py`):**
   - Parses the audited CSV, rejects invalid datatypes and malformed columns, filters sentinels (`-9999.0`) and non-zero quality flags.
   - Computes statistical aggregates (mean, min, max, count).
   - Generates deterministic JSON atomically (using tempfile, `os.fsync`, and `os.replace`).
   - Supports read-only validation (`--check`) mode without touching files or altering `mtime`.
2. **Automated Unit Tests (`tools/data/test_prepare_environment.py`):**
   - 9 regression test cases covering:
     - `test_successful_generation_from_sample`: Verifies parsing, schema keys, and aggregate values.
     - `test_deterministic_output`: Confirms repeated executions produce byte-identical JSON.
     - `test_check_mode_passes_on_matching_file`: Confirms `--check` returns exit `0` without altering `mtime`.
     - `test_check_mode_fails_on_tampered_value`: Confirms altered metrics trigger exit `1`.
     - `test_check_mode_fails_on_missing_file`: Confirms missing output triggers exit `1`.
     - `test_sentinel_and_quality_filtering`: Confirms `-9999.0` and `quality_flag > 0` rows are excluded.
     - `test_missing_source_fails_cleanly`: Confirms nonexistent CSV exits `1` without traceback.
     - `test_malformed_csv_fails_cleanly`: Confirms bad headers exit `1` without traceback.
     - `test_atomic_write_preserves_existing_file_on_failure`: Confirms existing output file bytes and timestamps are preserved if extraction fails.

---

## 5. Handoff to Coordinator (W6) and Enzo (W3/Phase 2)

- **Coordinator Action:** Review the proposed schema above (`schemaVersion: 1`, `quantities` array with `id`, `unit`, `mean`, `min`, `max`, `qualityStatus`). Once agreed, the runtime file can be generated to `public/data/environment.json` and added to `tools/pwa/build-pack.mjs` for service worker inclusion.
- **Enzo Action:** Consume the agreed quantity fields in the planned `src/app/environment/` UI module. Use the explicit `qualityStatus` (`verified-archival` vs `unavailable`) and display the scientific limitations and PDS sources without inventing real-time conditions.
