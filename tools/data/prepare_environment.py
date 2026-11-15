#!/usr/bin/env python3
r"""prepare_environment.py — Convert Curiosity REMS and RAD illustrative samples to environmental JSON.

Parses a CSV fixture in the documented column format, filters sentinel values (-9999) and
degraded quality flags, validates finite/consistent numbers and min<=mean<=max per row, and
produces a deterministic JSON document.

IMPORTANT: The bundled sample CSV (tools/data/samples/curiosity_rems_rad_sample.csv) is an
ILLUSTRATIVE FIXTURE only. Its numerical values have not been traced to specific original NASA PDS
data-product downloads with verified raw-file hashes. The converter therefore labels all output
"illustrative-sample", not "verified-archival" or "measured". When a future source-verified product
is supplied and accepted by the coordinator, the status and evidence fields can be updated.

Usage:
  python tools/data/prepare_environment.py --source <input.csv> --output <output.json>
  python tools/data/prepare_environment.py --source <input.csv> --output <output.json> --check
"""

import argparse
import csv
import json
import math
import os
from pathlib import Path
import sys
import tempfile

SENTINEL_VALUE = -9999.0

# Archive landing-page references for the instrument collections.
# These cite the publicly accessible PDS archive nodes; they do not constitute
# a verified extraction mapping from a specific product download.
REMS_PRESSURE_SOURCE = {
    "title": "NASA PDS MSL REMS Archive (illustrative sample; exact product/extraction unverified)",
    "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
    "credit": "NASA/JPL-Caltech/CAB (illustrative fixture only)",
}

REMS_TEMP_SOURCE = {
    "title": "NASA PDS MSL REMS Archive (illustrative sample; exact product/extraction unverified)",
    "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
    "credit": "NASA/JPL-Caltech/CAB (illustrative fixture only)",
}

RAD_DOSE_SOURCE = {
    "title": "NASA PDS MSL RAD Archive (illustrative sample; exact product/extraction unverified)",
    "url": "https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD",
    "credit": "NASA/JPL-Caltech/SwRI/CAU (illustrative fixture only)",
}


# ---------------------------------------------------------------------------
# Path alias check (R2)
# ---------------------------------------------------------------------------

def paths_alias(path1: Path | str, path2: Path | str) -> bool:
    """Check whether two paths resolve to the same filesystem location."""
    try:
        p1_str = str(path1)
        p2_str = str(path2)
        if os.path.exists(p1_str) and os.path.exists(p2_str):
            return os.path.samefile(p1_str, p2_str)
        p1 = os.path.realpath(os.path.abspath(p1_str))
        p2 = os.path.realpath(os.path.abspath(p2_str))
        return p1 == p2
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Input validation helpers (R3)
# ---------------------------------------------------------------------------

def _require_finite(value: float, field: str, sol: int) -> None:
    """Raise ValueError if value is NaN, infinite, or overflows standard float range."""
    if not math.isfinite(value):
        raise ValueError(
            f"Non-finite value {value!r} in field '{field}' at Sol {sol}; "
            "row rejected (NaN/±Inf not permitted)"
        )


def _require_min_mean_max(val_min: float, val_mean: float, val_max: float,
                          label: str, sol: int) -> None:
    """Raise ValueError when min > mean or mean > max for the same measurement interval."""
    if val_min > val_mean or val_mean > val_max:
        raise ValueError(
            f"Inconsistent {label} interval at Sol {sol}: "
            f"min={val_min} mean={val_mean} max={val_max}; min<=mean<=max required"
        )


def _is_sentinel(value: float) -> bool:
    """Return True when value equals the documented missing-data sentinel."""
    return value == SENTINEL_VALUE


# ---------------------------------------------------------------------------
# CSV parsing
# ---------------------------------------------------------------------------

def parse_source_csv(source_path: Path):
    r"""Parse illustrative observation CSV, validating headers, datatypes, finite values and consistency."""
    if not source_path.exists():
        raise ValueError(f"Source file does not exist: {source_path}")

    raw_lines = source_path.read_text(encoding="utf-8").splitlines()
    data_lines = [line for line in raw_lines if line.strip() and not line.strip().startswith("#")]

    if not data_lines:
        raise ValueError(f"Source file contains no data rows: {source_path}")

    reader = csv.DictReader(data_lines)
    expected_cols = {
        "sol",
        "ls_deg",
        "pressure_min_pa",
        "pressure_max_pa",
        "pressure_mean_pa",
        "temp_air_min_c",
        "temp_air_max_c",
        "temp_air_mean_c",
        "rad_dose_rate_ugy_day",
        "quality_flag",
    }
    if not reader.fieldnames or not expected_cols.issubset(set(reader.fieldnames)):
        missing = expected_cols - set(reader.fieldnames or [])
        raise ValueError(f"Source CSV is missing required columns: {missing}")

    records = []
    for line_idx, row in enumerate(reader, start=1):
        try:
            sol = int(row["sol"])
            ls = float(row["ls_deg"])
            p_min = float(row["pressure_min_pa"])
            p_max = float(row["pressure_max_pa"])
            p_mean = float(row["pressure_mean_pa"])
            t_min = float(row["temp_air_min_c"])
            t_max = float(row["temp_air_max_c"])
            t_mean = float(row["temp_air_mean_c"])
            rad = float(row["rad_dose_rate_ugy_day"])
            quality = int(row["quality_flag"])
        except (ValueError, KeyError) as err:
            raise ValueError(f"Invalid numeric data at data row {line_idx}: {err}") from err

        # R3: validate all floats are finite (NaN / ±Inf not permitted in any field)
        for field_name, field_val in [
            ("ls_deg", ls),
            ("pressure_min_pa", p_min), ("pressure_max_pa", p_max), ("pressure_mean_pa", p_mean),
            ("temp_air_min_c", t_min), ("temp_air_max_c", t_max), ("temp_air_mean_c", t_mean),
            ("rad_dose_rate_ugy_day", rad),
        ]:
            _require_finite(field_val, field_name, sol)

        # Validate quality flag is documented category
        if quality not in (0, 1, 2):
            raise ValueError(f"Invalid quality_flag {quality} at Sol {sol}; expected 0, 1, or 2")

        # Validate solar longitude range [0, 360)
        if ls < 0.0 or ls >= 360.0:
            raise ValueError(f"Solar longitude {ls} out of range [0, 360) at Sol {sol}")

        # R3: validate min <= mean <= max consistency for quality-0 rows
        if quality == 0:
            p_sentinels = [_is_sentinel(v) for v in (p_min, p_mean, p_max)]
            if any(p_sentinels):
                if not all(p_sentinels):
                    raise ValueError(
                        f"Inconsistent pressure sentinels at Sol {sol}: "
                        f"min={p_min}, mean={p_mean}, max={p_max}; partial missing data not permitted in quality_flag=0"
                    )
            else:
                if p_min < 0.0:
                    raise ValueError(f"Negative pressure min {p_min} at Sol {sol}")
                _require_min_mean_max(p_min, p_mean, p_max, "pressure", sol)

            t_sentinels = [_is_sentinel(v) for v in (t_min, t_mean, t_max)]
            if any(t_sentinels):
                if not all(t_sentinels):
                    raise ValueError(
                        f"Inconsistent temperature sentinels at Sol {sol}: "
                        f"min={t_min}, mean={t_mean}, max={t_max}; partial missing data not permitted in quality_flag=0"
                    )
            else:
                if t_min < -273.15:
                    raise ValueError(f"Temperature below absolute zero at Sol {sol}")
                _require_min_mean_max(t_min, t_mean, t_max, "temperature", sol)

            if not _is_sentinel(rad) and rad < 0.0:
                raise ValueError(f"Negative radiation dose rate {rad} at Sol {sol}")

        records.append(
            {
                "sol": sol,
                "ls": ls,
                "p_min": p_min,
                "p_max": p_max,
                "p_mean": p_mean,
                "t_min": t_min,
                "t_max": t_max,
                "t_mean": t_mean,
                "rad": rad,
                "quality": quality,
            }
        )

    return records


# ---------------------------------------------------------------------------
# Aggregation
# ---------------------------------------------------------------------------

def aggregate_values(values):
    r"""Compute count, mean, min, and max strictly over a list of valid numbers."""
    if not values:
        return None
    return {
        "mean": round(sum(values) / len(values), 1),
        "min": round(min(values), 1),
        "max": round(max(values), 1),
        "sampleCount": len(values),
    }


# ---------------------------------------------------------------------------
# Schema construction
# ---------------------------------------------------------------------------

def build_environment_data(records):
    r"""Filter sentinel/invalid rows and construct the v1 environment schema.

    Per-quantity filtering is INDEPENDENT (R4):
    - A row excluded from pressure (p_mean is sentinel) may still contribute a valid RAD sample.
    - A row excluded from RAD (rad is sentinel) may still contribute valid REMS samples.
    - Legitimate zero values (e.g. rad == 0.0) are INCLUDED; only -9999.0 is sentinel.
    """
    total_rows = len(records)

    # Quality filtering: quality==0 rows are the valid candidate pool.
    quality_ok_rows = [r for r in records if r["quality"] == 0]

    if not quality_ok_rows:
        raise ValueError("No valid observation rows found with quality_flag == 0")

    valid_sols = [r["sol"] for r in quality_ok_rows]
    start_sol = min(valid_sols)
    end_sol = max(valid_sols)
    included_rows = len(quality_ok_rows)
    excluded_rows = total_rows - included_rows

    # 1. Atmospheric Pressure (Pa) — per-quantity independent filtering
    pressures_mean = [
        r["p_mean"] for r in quality_ok_rows if not _is_sentinel(r["p_mean"]) and r["p_mean"] >= 0.0
    ]
    pressures_raw_min = [
        r["p_min"] for r in quality_ok_rows if not _is_sentinel(r["p_min"]) and r["p_min"] >= 0.0
    ]
    pressures_raw_max = [
        r["p_max"] for r in quality_ok_rows if not _is_sentinel(r["p_max"]) and r["p_max"] >= 0.0
    ]

    p_agg = aggregate_values(pressures_mean)
    p_min_val = round(min(pressures_raw_min), 1) if pressures_raw_min else (p_agg["min"] if p_agg else None)
    p_max_val = round(max(pressures_raw_max), 1) if pressures_raw_max else (p_agg["max"] if p_agg else None)

    p_usable = len(pressures_mean)
    p_missing = included_rows - p_usable

    pressure_qty = {
        "id": "atmospheric-pressure",
        "name": "Surface Atmospheric Pressure",
        "instrument": "REMS",
        "unit": "Pa",
        "mean": p_agg["mean"] if p_agg else None,
        "min": p_min_val,
        "max": p_max_val,
        "sampleCount": p_usable,
        "qualityStatus": "illustrative-sample" if p_agg else "unavailable",
        "evidenceType": "illustrative",
        "aggregationMethod": "mean of daily mean values; min/max span daily column minima/maxima across included sols",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (illustrative Gale Crater sample)",
        "perQuantityAudit": {
            "includedSolCount": p_usable,
            "sentinelExcluded": p_missing,
            "qualityExcluded": excluded_rows,
        },
        "source": REMS_PRESSURE_SOURCE,
        "limitations": [
            "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
            "Diurnal barometric amplitude reflects regional atmospheric tidal dynamics, not terrain microrelief.",
            "Illustrative fixture only; no rover observation, location or acquisition interval is verified.",
        ],
    }

    # 2. Ambient Air Temperature (degC) — per-quantity independent filtering
    temps_mean = [
        r["t_mean"] for r in quality_ok_rows if not _is_sentinel(r["t_mean"])
    ]
    temps_raw_min = [
        r["t_min"] for r in quality_ok_rows if not _is_sentinel(r["t_min"])
    ]
    temps_raw_max = [
        r["t_max"] for r in quality_ok_rows if not _is_sentinel(r["t_max"])
    ]

    t_agg = aggregate_values(temps_mean)
    t_min_val = round(min(temps_raw_min), 1) if temps_raw_min else (t_agg["min"] if t_agg else None)
    t_max_val = round(max(temps_raw_max), 1) if temps_raw_max else (t_agg["max"] if t_agg else None)

    t_usable = len(temps_mean)
    t_missing = included_rows - t_usable

    temp_qty = {
        "id": "ambient-air-temperature",
        "name": "Illustrative Air Temperature",
        "instrument": "REMS",
        "unit": "degC",
        "mean": t_agg["mean"] if t_agg else None,
        "min": t_min_val,
        "max": t_max_val,
        "sampleCount": t_usable,
        "qualityStatus": "illustrative-sample" if t_agg else "unavailable",
        "evidenceType": "illustrative",
        "aggregationMethod": "mean of daily mean values; min/max span daily column minima/maxima across included sols",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (illustrative sample)",
        "perQuantityAudit": {
            "includedSolCount": t_usable,
            "sentinelExcluded": t_missing,
            "qualityExcluded": excluded_rows,
        },
        "source": REMS_TEMP_SOURCE,
        "limitations": [
            "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
            "No sensor position or rover location has been verified for these fixture values.",
            "Fixture extrema are not verified Martian observations or climatological bounds.",
        ],
    }

    # 3. Radiation Absorbed Dose Rate (uGy/day) — per-quantity independent filtering (R4)
    # Legitimate zero values (rad == 0.0) are preserved; only -9999.0 is sentinel.
    rad_vals = [
        r["rad"] for r in quality_ok_rows if not _is_sentinel(r["rad"]) and r["rad"] >= 0.0
    ]
    rad_agg = aggregate_values(rad_vals)

    rad_usable = len(rad_vals)
    rad_missing = included_rows - rad_usable

    rad_qty = {
        "id": "surface-radiation-dose-rate",
        "name": "Illustrative Absorbed Dose Rate",
        "instrument": "RAD",
        "unit": "uGy/day",
        "mean": rad_agg["mean"] if rad_agg else None,
        "min": rad_agg["min"] if rad_agg else None,
        "max": rad_agg["max"] if rad_agg else None,
        "sampleCount": rad_usable,
        "qualityStatus": "illustrative-sample" if rad_agg else "unavailable",
        "evidenceType": "illustrative",
        "aggregationMethod": "mean/min/max of daily absorbed dose rate values across included sols",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (illustrative sample)",
        "perQuantityAudit": {
            "includedSolCount": rad_usable,
            "sentinelExcluded": rad_missing,
            "qualityExcluded": excluded_rows,
        },
        "source": RAD_DOSE_SOURCE,
        "limitations": [
            "Values are ILLUSTRATIVE ONLY. Exact product/label/extraction has not been verified against a specific PDS download.",
            "Detector, shielding, solar activity and geographic context are unverified for this fixture.",
            "Does not imply human safety or operational exploration limits without dedicated habitat shielding.",
            "Route transit time cannot be multiplied into dose without verified shielding and velocity models.",
        ],
    }

    payload = {
        "schemaVersion": 1,
        "region": "Mount Sharp foothills, Gale Crater, Mars",
        "dataStatus": "illustrative-sample",
        "dataStatusNote": (
            "Values are from an illustrative fixture CSV. "
            "Exact original PDS product IDs, label files, raw-file hashes and row extraction have "
            "not been verified. Do not display these as confirmed NASA measurements."
        ),
        "provenance": {
            "mission": "Mars Science Laboratory (Curiosity Rover)",
            "instruments": ["REMS", "RAD"],
            "pdsNodes": [
                "Planetary Data System Atmospheres Node",
                "Planetary Data System Planetary Plasma Interactions Node",
            ],
            "disclaimer": (
                "Illustrative fixture; archive landing pages are discovery references only. "
                "Not real-time conditions, operational forecast or verified raw-product extraction."
            ),
        },
        "solRange": {
            "startSol": start_sol,
            "endSol": end_sol,
        },
        "sampleAudit": {
            "totalInputRows": total_rows,
            "includedRows": included_rows,
            "excludedRows": excluded_rows,
        },
        "quantities": [pressure_qty, temp_qty, rad_qty],
    }

    return payload


# ---------------------------------------------------------------------------
# Atomic write (R3: allow_nan=False)
# ---------------------------------------------------------------------------

def write_environment_json(data: dict, output_path: Path):
    r"""Write payload atomically via temporary file, fsync, and atomic replace.

    R3: uses allow_nan=False so non-finite values (Infinity, NaN) raise ValueError
    rather than producing invalid JSON.
    """
    content = json.dumps(data, indent=2, allow_nan=False) + "\n"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_fd, temp_name = tempfile.mkstemp(
        dir=str(output_path.parent), prefix=".env_tmp_", suffix=".json"
    )
    try:
        with open(temp_fd, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_name, output_path)
    except Exception:
        if os.path.exists(temp_name):
            try:
                os.remove(temp_name)
            except OSError:
                pass
        raise


# ---------------------------------------------------------------------------
# Read-only check
# ---------------------------------------------------------------------------

def check_environment_json(source_path: Path, output_path: Path) -> int:
    r"""Read-only validation of existing environment JSON against source data without modifying disk."""
    if not output_path.exists():
        print(f"[ERROR] Environment file does not exist: {output_path}", file=sys.stderr)
        return 1

    try:
        raw_text = output_path.read_text(encoding="utf-8")
        existing_data = json.loads(raw_text)
    except Exception as err:
        print(f"[ERROR] Existing environment file is not valid JSON: {err}", file=sys.stderr)
        return 1

    # Structural schema validation
    if not isinstance(existing_data, dict):
        print("[ERROR] Environment index root must be an object", file=sys.stderr)
        return 1

    expected_keys = {
        "schemaVersion",
        "region",
        "dataStatus",
        "dataStatusNote",
        "provenance",
        "solRange",
        "sampleAudit",
        "quantities",
    }
    if set(existing_data.keys()) != expected_keys:
        print(
            f"[ERROR] Root keys mismatch. Expected {expected_keys}, got {set(existing_data.keys())}",
            file=sys.stderr,
        )
        return 1

    if existing_data.get("schemaVersion") != 1 or isinstance(existing_data.get("schemaVersion"), bool):
        print("[ERROR] schemaVersion must be integer 1", file=sys.stderr)
        return 1

    quantities = existing_data.get("quantities")
    if not isinstance(quantities, list) or len(quantities) != 3:
        print("[ERROR] quantities must be a list of exactly 3 quantity objects", file=sys.stderr)
        return 1

    # Extract fresh payload from source
    try:
        records = parse_source_csv(source_path)
        computed_data = build_environment_data(records)
    except Exception as err:
        print(f"[ERROR] Failed to extract from source '{source_path}': {err}", file=sys.stderr)
        return 1

    computed_json = json.dumps(computed_data, indent=2, allow_nan=False) + "\n"
    if raw_text != computed_json:
        print(f"[ERROR] Existing file '{output_path}' differs from computed source payload", file=sys.stderr)
        return 1

    print(f"[SUCCESS] Environment data '{output_path}' matches source '{source_path}'.")
    for q in existing_data["quantities"]:
        print(
            f"  - {q['name']}: {q['mean']} {q['unit']} "
            f"(range: {q['min']} to {q['max']}, n={q['sampleCount']}, {q['qualityStatus']})"
        )
    return 0


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        description="Convert Curiosity REMS/RAD illustrative observations to environment JSON"
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("tools/data/samples/curiosity_rems_rad_sample.csv"),
        help="Source CSV file",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/data/environment.json"),
        help="Output JSON file",
    )
    parser.add_argument("--check", action="store_true", help="Read-only validation mode")
    args = parser.parse_args(argv)

    if args.check:
        return check_environment_json(args.source, args.output)

    # R2: reject source/output aliases before any write
    if paths_alias(args.source, args.output):
        print(
            f"[ERROR] Output path '{args.output}' aliases source input '{args.source}'. "
            "Refusing to overwrite source file.",
            file=sys.stderr,
        )
        return 1

    try:
        records = parse_source_csv(args.source)
        payload = build_environment_data(records)
        write_environment_json(payload, args.output)
        print(f"[SUCCESS] Wrote environment data to '{args.output}'.")
        print(f"  dataStatus: {payload['dataStatus']}")
        print(
            f"  Total input rows: {payload['sampleAudit']['totalInputRows']}, "
            f"included: {payload['sampleAudit']['includedRows']}"
        )
        for q in payload["quantities"]:
            print(
                f"  - {q['name']}: {q['mean']} {q['unit']} "
                f"(sampleCount={q['sampleCount']}, {q['qualityStatus']})"
            )
        return 0
    except Exception as err:
        print(f"[ERROR] {err}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
