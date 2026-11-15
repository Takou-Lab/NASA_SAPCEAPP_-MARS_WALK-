"""Regression checks for full decoding and verifier process outcomes."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import verify_pack


REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT = REPO_ROOT / "tools/data/verify_pack.py"
REAL_MANIFEST = REPO_ROOT / "public/data/manifest.json"
PUBLIC_ROOT = REPO_ROOT / "public"


class VerifyPackTests(unittest.TestCase):
    def run_cli(self, manifest, public_root=PUBLIC_ROOT, json_output=False, no_site=False):
        command = [sys.executable]
        if no_site:
            command.append("-S")  # Isolate the no-Pillow path from site-packages.
        command += [str(SCRIPT), "--manifest", str(manifest), "--public-root", str(public_root)]
        if json_output:
            command.append("--json")
        return subprocess.run(command, capture_output=True, text=True, check=False)

    def test_real_image_fully_decodes_and_matches_manifest(self):
        success, result = verify_pack.verify_package(str(REAL_MANIFEST), str(PUBLIC_ROOT))
        self.assertTrue(success, result["errors"])
        self.assertTrue(result["success"])
        self.assertEqual(result["decodedDimensions"], (2048, 2048))
        self.assertIn("fully decoded via Pillow", result["decoder"])

    def test_truncated_image_fails_in_both_output_modes(self):
        manifest = json.loads(REAL_MANIFEST.read_text())
        original = (PUBLIC_ROOT / manifest["assetPath"]).read_bytes()
        with tempfile.TemporaryDirectory() as temp_dir:
            public = Path(temp_dir)
            image = public / manifest["assetPath"]
            image.parent.mkdir(parents=True)
            # Retain the original header and dimensions, but remove pixel data.
            image.write_bytes(original[: len(original) // 2])
            local_manifest = public / "manifest.json"
            local_manifest.write_text(json.dumps(manifest))
            for json_output in (False, True):
                with self.subTest(json_output=json_output):
                    result = self.run_cli(local_manifest, public, json_output=json_output)
                    self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                    if json_output:
                        report = json.loads(result.stdout)
                        self.assertFalse(report["success"])
                        self.assertIn("Failed to decode image", report["errors"][0])

    def test_missing_pillow_fails_clearly_in_both_output_modes(self):
        for json_output in (False, True):
            with self.subTest(json_output=json_output):
                result = self.run_cli(REAL_MANIFEST, json_output=json_output, no_site=True)
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn("Pillow is required for full image verification", result.stdout)
                self.assertIn("pip install -r tools/data/requirements.txt", result.stdout)
                if json_output:
                    self.assertFalse(json.loads(result.stdout)["success"])

    def test_missing_manifest_json_returns_failure(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            result = self.run_cli(Path(temp_dir) / "missing.json", json_output=True)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            report = json.loads(result.stdout)
            self.assertFalse(report["success"])
            self.assertIn("Manifest file not found", report["errors"][0])


if __name__ == "__main__":
    unittest.main()
