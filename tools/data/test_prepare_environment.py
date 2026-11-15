"""Regression and integrity checks for prepare_environment.py."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT = REPO_ROOT / "tools/data/prepare_environment.py"
SAMPLE_CSV = REPO_ROOT / "tools/data/samples/curiosity_rems_rad_sample.csv"


class PrepareEnvironmentTests(unittest.TestCase):
    def run_cli(self, source, output, check=False):
        cmd = [
            sys.executable,
            str(SCRIPT),
            "--source",
            str(source),
            "--output",
            str(output),
        ]
        if check:
            cmd.append("--check")
        return subprocess.run(cmd, capture_output=True, text=True, check=False)

    def test_successful_generation_from_sample(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "environment.json"
            res = self.run_cli(SAMPLE_CSV, out_file)
            self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
            self.assertTrue(out_file.exists())

            data = json.loads(out_file.read_text(encoding="utf-8"))
            self.assertEqual(data["schemaVersion"], 1)
            self.assertEqual(data["region"], "Mount Sharp foothills, Gale Crater, Mars")
            self.assertEqual(data["sampleAudit"]["totalInputRows"], 16)
            self.assertEqual(data["sampleAudit"]["includedRows"], 14)
            self.assertEqual(data["sampleAudit"]["excludedRows"], 2)

            quantities = {q["id"]: q for q in data["quantities"]}
            self.assertIn("atmospheric-pressure", quantities)
            self.assertIn("ambient-air-temperature", quantities)
            self.assertIn("surface-radiation-dose-rate", quantities)

            # Pressure checks
            p = quantities["atmospheric-pressure"]
            self.assertEqual(p["unit"], "Pa")
            self.assertEqual(p["mean"], 806.1)
            self.assertEqual(p["min"], 767.9)
            self.assertEqual(p["max"], 843.5)
            self.assertEqual(p["sampleCount"], 14)

            # Air temperature checks
            t = quantities["ambient-air-temperature"]
            self.assertEqual(t["unit"], "degC")
            self.assertEqual(t["mean"], -47.6)
            self.assertEqual(t["min"], -78.7)
            self.assertEqual(t["max"], -17.2)
            self.assertEqual(t["sampleCount"], 14)

            # Radiation dose rate checks (14 valid samples with quality=0)
            r = quantities["surface-radiation-dose-rate"]
            self.assertEqual(r["unit"], "uGy/day")
            self.assertEqual(r["mean"], 211.7)
            self.assertEqual(r["sampleCount"], 14)

    def test_deterministic_output(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out1 = Path(temp_dir) / "env1.json"
            out2 = Path(temp_dir) / "env2.json"
            res1 = self.run_cli(SAMPLE_CSV, out1)
            res2 = self.run_cli(SAMPLE_CSV, out2)
            self.assertEqual(res1.returncode, 0)
            self.assertEqual(res2.returncode, 0)
            self.assertEqual(out1.read_bytes(), out2.read_bytes())

    def test_check_mode_passes_on_matching_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "environment.json"
            self.run_cli(SAMPLE_CSV, out_file)
            mtime_before = out_file.stat().st_mtime_ns

            res = self.run_cli(SAMPLE_CSV, out_file, check=True)
            self.assertEqual(res.returncode, 0, res.stderr)
            self.assertIn("[SUCCESS]", res.stdout)
            self.assertEqual(out_file.stat().st_mtime_ns, mtime_before)

    def test_check_mode_fails_on_tampered_value(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "environment.json"
            self.run_cli(SAMPLE_CSV, out_file)

            data = json.loads(out_file.read_text(encoding="utf-8"))
            data["quantities"][0]["mean"] = 999.9
            out_file.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
            mtime_before = out_file.stat().st_mtime_ns

            res = self.run_cli(SAMPLE_CSV, out_file, check=True)
            self.assertEqual(res.returncode, 1)
            self.assertIn("differs from computed source payload", res.stderr)
            self.assertEqual(out_file.stat().st_mtime_ns, mtime_before)

    def test_check_mode_fails_on_missing_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "nonexistent.json"
            res = self.run_cli(SAMPLE_CSV, out_file, check=True)
            self.assertEqual(res.returncode, 1)
            self.assertIn("does not exist", res.stderr)
            self.assertFalse(out_file.exists())

    def test_sentinel_and_quality_filtering(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "test.csv"
            csv_path.write_text(
                "sol,ls_deg,pressure_min_pa,pressure_max_pa,pressure_mean_pa,temp_air_min_c,temp_air_max_c,temp_air_mean_c,rad_dose_rate_ugy_day,quality_flag\n"
                "100,10.0,750.0,800.0,775.0,-70.0,-20.0,-45.0,200.0,0\n"
                "101,10.5,-9999.0,-9999.0,-9999.0,-9999.0,-9999.0,-9999.0,-9999.0,2\n"
                "102,11.0,760.0,810.0,785.0,-68.0,-18.0,-43.0,210.0,0\n",
                encoding="utf-8",
            )
            out_file = Path(temp_dir) / "out.json"
            res = self.run_cli(csv_path, out_file)
            self.assertEqual(res.returncode, 0)

            data = json.loads(out_file.read_text(encoding="utf-8"))
            self.assertEqual(data["sampleAudit"]["totalInputRows"], 3)
            self.assertEqual(data["sampleAudit"]["includedRows"], 2)
            self.assertEqual(data["sampleAudit"]["excludedRows"], 1)
            self.assertEqual(data["quantities"][0]["mean"], 780.0)

    def test_missing_source_fails_cleanly(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "out.json"
            res = self.run_cli(Path(temp_dir) / "missing.csv", out_file)
            self.assertEqual(res.returncode, 1)
            self.assertIn("Source file does not exist", res.stderr)
            self.assertNotIn("Traceback", res.stderr)
            self.assertFalse(out_file.exists())

    def test_malformed_csv_fails_cleanly(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "bad.csv"
            csv_path.write_text("not_a_valid,csv_header\n1,2\n", encoding="utf-8")
            out_file = Path(temp_dir) / "out.json"
            res = self.run_cli(csv_path, out_file)
            self.assertEqual(res.returncode, 1)
            self.assertIn("missing required columns", res.stderr)
            self.assertNotIn("Traceback", res.stderr)
            self.assertFalse(out_file.exists())

    def test_atomic_write_preserves_existing_file_on_failure(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "out.json"
            sentinel_bytes = b"PRE_EXISTING_BYTES\n"
            out_file.write_bytes(sentinel_bytes)
            mtime_before = out_file.stat().st_mtime_ns

            # Try generating with a bad CSV
            bad_csv = Path(temp_dir) / "corrupt.csv"
            bad_csv.write_text("sol,ls_deg\n1,2\n", encoding="utf-8")
            res = self.run_cli(bad_csv, out_file)
            self.assertEqual(res.returncode, 1)
            self.assertEqual(out_file.read_bytes(), sentinel_bytes)
            self.assertEqual(out_file.stat().st_mtime_ns, mtime_before)


if __name__ == "__main__":
    unittest.main()
