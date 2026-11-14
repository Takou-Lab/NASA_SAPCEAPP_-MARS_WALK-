"""Regression and integrity checks for build_image_pack.py."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT = REPO_ROOT / "tools/data/build_image_pack.py"
REAL_MANIFEST = REPO_ROOT / "public/data/manifest.json"
REAL_IMAGE = REPO_ROOT / "public/data/imagery/PIA26306_derived_2048.jpg"
PUBLIC_ROOT = REPO_ROOT / "public"


class BuildImagePackTests(unittest.TestCase):
    def run_cli(self, manifest, public_root, output, check=False):
        cmd = [
            sys.executable,
            str(SCRIPT),
            "--manifest",
            str(manifest),
            "--public-root",
            str(public_root),
            "--output",
            str(output),
        ]
        if check:
            cmd.append("--check")
        return subprocess.run(cmd, capture_output=True, text=True, check=False)

    def test_generate_real_package_matches_expected_schema_and_values(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "image-pack.json"
            res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file)
            self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
            self.assertTrue(out_file.exists())

            data = json.loads(out_file.read_text(encoding="utf-8"))
            self.assertEqual(data["schemaVersion"], 1)
            self.assertEqual(data["imageRef"], "hirise-mro-pia26306-boxwork-2048x1042-v1")
            self.assertEqual(len(data["files"]), 2)
            self.assertEqual(data["files"][0]["path"], "data/manifest.json")
            self.assertEqual(data["files"][0]["bytes"], 1200)
            self.assertEqual(data["files"][0]["sha256"], "40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82")
            self.assertEqual(data["files"][1]["path"], "data/imagery/PIA26306_derived_2048.jpg")
            self.assertEqual(data["files"][1]["bytes"], 523272)
            self.assertEqual(data["files"][1]["sha256"], "7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8")
            self.assertEqual(data["totalBytes"], 524472)

    def test_deterministic_identical_generation(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out1 = Path(temp_dir) / "out1.json"
            out2 = Path(temp_dir) / "out2.json"
            res1 = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out1)
            res2 = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out2)
            self.assertEqual(res1.returncode, 0)
            self.assertEqual(res2.returncode, 0)
            self.assertEqual(out1.read_bytes(), out2.read_bytes())

    def test_check_mode_passes_fresh_index_without_modifying(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "image-pack.json"
            self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file)
            mtime_before = out_file.stat().st_mtime_ns

            check_res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file, check=True)
            self.assertEqual(check_res.returncode, 0, check_res.stdout + check_res.stderr)
            mtime_after = out_file.stat().st_mtime_ns
            self.assertEqual(mtime_before, mtime_after)

    def test_check_mode_fails_on_missing_index(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            missing_out = Path(temp_dir) / "nonexistent.json"
            res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, missing_out, check=True)
            self.assertEqual(res.returncode, 1)
            self.assertIn("does not exist", res.stderr)

    def test_check_mode_fails_on_tampered_hash_or_bytes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "image-pack.json"
            self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file)

            # Tamper hash
            data = json.loads(out_file.read_text(encoding="utf-8"))
            data["files"][1]["sha256"] = "0000000000000000000000000000000000000000000000000000000000000000"
            out_file.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

            res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file, check=True)
            self.assertEqual(res.returncode, 1)
            self.assertIn("Mismatch in files[1].sha256", res.stderr)

    def test_check_mode_fails_on_tampered_total_bytes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out_file = Path(temp_dir) / "image-pack.json"
            self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file)

            data = json.loads(out_file.read_text(encoding="utf-8"))
            data["totalBytes"] = 999999
            out_file.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

            res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, out_file, check=True)
            self.assertEqual(res.returncode, 1)
            self.assertIn("totalBytes mismatch", res.stderr)

    def test_corrupt_or_truncated_image_fails_and_preserves_existing_output(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            pub = Path(temp_dir) / "public"
            data_dir = pub / "data"
            imagery_dir = data_dir / "imagery"
            imagery_dir.mkdir(parents=True)

            # Copy manifest and create a truncated image
            manifest_file = data_dir / "manifest.json"
            manifest_file.write_bytes(REAL_MANIFEST.read_bytes())

            image_file = imagery_dir / "PIA26306_derived_2048.jpg"
            original_bytes = REAL_IMAGE.read_bytes()
            image_file.write_bytes(original_bytes[: len(original_bytes) // 4])

            # Pre-seed an existing output file
            out_file = data_dir / "image-pack.json"
            sentinel_content = b"PRE_EXISTING_VALID_CONTENT\n"
            out_file.write_bytes(sentinel_content)

            res = self.run_cli(manifest_file, pub, out_file)
            self.assertEqual(res.returncode, 1)
            self.assertIn("Failed to validate image package", res.stderr)
            # Ensure existing output was preserved completely untouched
            self.assertEqual(out_file.read_bytes(), sentinel_content)

    def test_missing_image_fails_and_preserves_existing_output(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            pub = Path(temp_dir) / "public"
            data_dir = pub / "data"
            data_dir.mkdir(parents=True)

            manifest_file = data_dir / "manifest.json"
            manifest_file.write_bytes(REAL_MANIFEST.read_bytes())

            out_file = data_dir / "image-pack.json"
            sentinel_content = b"EXISTING_CONTENT\n"
            out_file.write_bytes(sentinel_content)

            res = self.run_cli(manifest_file, pub, out_file)
            self.assertEqual(res.returncode, 1)
            self.assertEqual(out_file.read_bytes(), sentinel_content)

    def test_output_aliasing_input_is_rejected_safely(self):
        # Attempting to overwrite manifest
        res = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, REAL_MANIFEST)
        self.assertEqual(res.returncode, 1)
        self.assertIn("aliases manifest input", res.stderr)

        # Attempting to overwrite image
        res2 = self.run_cli(REAL_MANIFEST, PUBLIC_ROOT, REAL_IMAGE)
        self.assertEqual(res2.returncode, 1)
        self.assertIn("aliases image input", res2.stderr)

    def test_escaping_path_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            pub = Path(temp_dir) / "public"
            pub.mkdir()
            outside_manifest = Path(temp_dir) / "outside_manifest.json"
            outside_manifest.write_bytes(REAL_MANIFEST.read_bytes())

            out_file = pub / "image-pack.json"
            res = self.run_cli(outside_manifest, pub, out_file)
            self.assertEqual(res.returncode, 1)
            self.assertIn("not contained within public root", res.stderr)


if __name__ == "__main__":
    unittest.main()

