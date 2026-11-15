#!/usr/bin/env python3
r"""prepare_environment.py — Convert Curiosity REMS and RAD observation samples to environmental JSON.

Extracts Gale Crater meteorological and radiation context from NASA PDS archival tables,
filters invalid sentinel values (-9999) and degraded quality flags, computes verifiable
statistical aggregations (mean, min, max), and produces a deterministic JSON document.

Usage:
  python tools/data/prepare_environment.py --source <input.csv> --output <output.json>
  python tools/data/prepare_environment.py --source <input.csv> --output <output.json> --check
"""

import argparse
import csv
import json
import os
from pathlib import Path
import sys
import tempfile

SENTINEL_VALUE = -9999.0

REMS_PRESSURE_SOURCE = {
    "title": "NASA PDS MSL REMS Daily Weather Summaries (RDR)",
    "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
    "credit": "NASA/JPL-Caltech/CAB",
}

REMS_TEMP_SOURCE = {
    "title": "NASA PDS MSL REMS Reduced Data Record",
    "url": "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html",
    "credit": "NASA/JPL-Caltech/CAB",
}

RAD_DOSE_SOURCE = {
    "title": "NASA PDS MSL RAD Calibrated Data Records (RDR)",
    "url": "https://pds-ppi.igpp.ucla.edu/mission/MSL/MSL/RAD",
    "credit": "NASA/JPL-Caltech/SwRI/CAU",
}


def parse_source_csv(source_path: Path):
    r"""Parse raw PDS observation CSV, validating headers, datatypes, and sentinel flags."""
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


def aggregate_values(values):
    r"""Compute count, mean, min, and max strictly over valid non-sentinel numbers."""
    if not values:
        return None
    return {
        "mean": round(sum(values) / len(values), 1),
        "min": round(min(values), 1),
        "max": round(max(values), 1),
        "sampleCount": len(values),
    }


def build_environment_data(records):
    r"""Filter invalid/sentinel rows and construct the v1 environment schema."""
    total_rows = len(records)
    valid_sols = [r["sol"] for r in records if r["quality"] == 0]

    if not valid_sols:
        raise ValueError("No valid observation rows found with quality_flag == 0")

    start_sol = min(valid_sols)
    end_sol = max(valid_sols)

    # 1. Atmospheric Pressure (Pa)
    pressures_mean = [
        r["p_mean"]
        for r in records
        if r["quality"] == 0 and r["p_mean"] != SENTINEL_VALUE and r["p_mean"] > 0
    ]
    pressures_min = [
        r["p_min"]
        for r in records
        if r["quality"] == 0 and r["p_min"] != SENTINEL_VALUE and r["p_min"] > 0
    ]
    pressures_max = [
        r["p_max"]
        for r in records
        if r["quality"] == 0 and r["p_max"] != SENTINEL_VALUE and r["p_max"] > 0
    ]

    p_agg = aggregate_values(pressures_mean)
    p_min_val = min(pressures_min) if pressures_min else (p_agg["min"] if p_agg else None)
    p_max_val = max(pressures_max) if pressures_max else (p_agg["max"] if p_agg else None)

    pressure_qty = {
        "id": "atmospheric-pressure",
        "name": "Surface Atmospheric Pressure",
        "instrument": "REMS",
        "unit": "Pa",
        "mean": p_agg["mean"] if p_agg else None,
        "min": round(p_min_val, 1) if p_min_val is not None else None,
        "max": round(p_max_val, 1) if p_max_val is not None else None,
        "sampleCount": p_agg["sampleCount"] if p_agg else 0,
        "qualityStatus": "verified-archival" if p_agg else "unavailable",
        "evidenceType": "measured",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (Gale Crater baseline)",
        "source": REMS_PRESSURE_SOURCE,
        "limitations": [
            "Diurnal barometric amplitude reflects regional atmospheric tidal dynamics, not terrain microrelief.",
            "Historical archival sample from Curiosity traverse; not active real-time conditions.",
        ],
    }

    # 2. Ambient Air Temperature (degC)
    temps_mean = [
        r["t_mean"]
        for r in records
        if r["quality"] == 0 and r["t_mean"] != SENTINEL_VALUE and r["t_mean"] > -200.0
    ]
    temps_min = [
        r["t_min"]
        for r in records
        if r["quality"] == 0 and r["t_min"] != SENTINEL_VALUE and r["t_min"] > -200.0
    ]
    temps_max = [
        r["t_max"]
        for r in records
        if r["quality"] == 0 and r["t_max"] != SENTINEL_VALUE and r["t_max"] > -200.0
    ]

    t_agg = aggregate_values(temps_mean)
    t_min_val = min(temps_min) if temps_min else (t_agg["min"] if t_agg else None)
    t_max_val = max(temps_max) if temps_max else (t_agg["max"] if t_agg else None)

    temp_qty = {
        "id": "ambient-air-temperature",
        "name": "Ambient Air Temperature (1.5 m)",
        "instrument": "REMS",
        "unit": "degC",
        "mean": t_agg["mean"] if t_agg else None,
        "min": round(t_min_val, 1) if t_min_val is not None else None,
        "max": round(t_max_val, 1) if t_max_val is not None else None,
        "sampleCount": t_agg["sampleCount"] if t_agg else 0,
        "qualityStatus": "verified-archival" if t_agg else "unavailable",
        "evidenceType": "measured",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (Rover mast height)",
        "source": REMS_TEMP_SOURCE,
        "limitations": [
            "Measured at rover mast height (~1.5 m) along Curiosity traverse path in Gale Crater.",
            "Extreme diurnal range (~60 degC) is characteristic of low-density Martian atmosphere.",
        ],
    }

    # 3. Radiation Absorbed Dose Rate (uGy/day)
    rad_vals = [
        r["rad"]
        for r in records
        if r["quality"] == 0 and r["rad"] != SENTINEL_VALUE and r["rad"] > 0.0
    ]
    rad_agg = aggregate_values(rad_vals)

    rad_qty = {
        "id": "surface-radiation-dose-rate",
        "name": "Surface Absorbed Dose Rate (GCR background)",
        "instrument": "RAD",
        "unit": "uGy/day",
        "mean": rad_agg["mean"] if rad_agg else None,
        "min": rad_agg["min"] if rad_agg else None,
        "max": rad_agg["max"] if rad_agg else None,
        "sampleCount": rad_agg["sampleCount"] if rad_agg else 0,
        "qualityStatus": "verified-archival" if rad_agg else "unavailable",
        "evidenceType": "measured",
        "observationInterval": f"Sol {start_sol} to Sol {end_sol} (Quiet Sun, GCR background)",
        "source": RAD_DOSE_SOURCE,
        "limitations": [
            "Galactic cosmic ray (GCR) background dose rate at Gale Crater surface elevation (~-4.4 km).",
            "Does not imply human safety or operational exploration limits without dedicated habitat shielding.",
            "Route transit time cannot be multiplied into dose without verified shielding and velocity models.",
        ],
    }

    payload = {
        "schemaVersion": 1,
        "region": "Mount Sharp foothills, Gale Crater, Mars",
        "provenance": {
            "mission": "Mars Science Laboratory (Curiosity Rover)",
            "instruments": ["REMS", "RAD"],
            "pdsNodes": [
                "Planetary Data System Atmospheres Node",
                "Planetary Data System Planetary Plasma Interactions Node",
            ],
            "disclaimer": "Historical archival observation sample; not real-time conditions or operational forecast.",
        },
        "solRange": {
            "startSol": start_sol,
            "endSol": end_sol,
        },
        "sampleAudit": {
            "totalInputRows": total_rows,
            "includedRows": len(valid_sols),
            "excludedRows": total_rows - len(valid_sols),
        },
        "quantities": [pressure_qty, temp_qty, rad_qty],
    }

    return payload


def write_environment_json(data: dict, output_path: Path):
    r"""Write payload atomically via temporary file, fsync, and atomic replace."""
    content = json.dumps(data, indent=2) + "\n"
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

    expected_keys = {"schemaVersion", "region", "provenance", "solRange", "sampleAudit", "quantities"}
    if set(existing_data.keys()) != expected_keys:
        print(f"[ERROR] Root keys mismatch. Expected {expected_keys}, got {set(existing_data.keys())}", file=sys.stderr)
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

    computed_json = json.dumps(computed_data, indent=2) + "\n"
    if raw_text != computed_json:
        print(f"[ERROR] Existing file '{output_path}' differs from computed source payload", file=sys.stderr)
        return 1

    print(f"[SUCCESS] Environment data '{output_path}' matches source '{source_path}'.")
    for q in existing_data["quantities"]:
        print(f"  - {q['name']}: {q['mean']} {q['unit']} (range: {q['min']} to {q['max']}, n={q['sampleCount']})")
    return 0


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Convert Curiosity REMS/RAD observations to environment JSON")
    parser.add_argument("--source", type=Path, default=Path("tools/data/samples/curiosity_rems_rad_sample.csv"), help="Source CSV file")
    parser.add_argument("--output", type=Path, default=Path("public/data/environment.json"), help="Output JSON file")
    parser.add_argument("--check", action="store_true", help="Read-only validation mode")
    args = parser.parse_args(argv)

    if args.check:
        return check_environment_json(args.source, args.output)

    try:
        records = parse_source_csv(args.source)
        payload = build_environment_data(records)
        write_environment_json(payload, args.output)
        print(f"[SUCCESS] Wrote environment data to '{args.output}'.")
        print(f"  Total input rows: {payload['sampleAudit']['totalInputRows']}, included: {payload['sampleAudit']['includedRows']}")
        for q in payload["quantities"]:
            print(f"  - {q['name']}: {q['mean']} {q['unit']} ({q['qualityStatus']})")
        return 0
    except Exception as err:
        print(f"[ERROR] {err}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
