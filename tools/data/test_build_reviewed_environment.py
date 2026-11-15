"""Excerpt processing checks are not independent archive authentication."""
import csv
import json
from pathlib import Path
import statistics
import unittest
from build_reviewed_environment import build, SOURCE, ROOT

class ReviewedExcerptTests(unittest.TestCase):
    def test_selected_samples_and_units_match_submitted_excerpt_not_daily_summary(self):
        payload = build()
        self.assertEqual(payload['reviewStatus'], 'limited')
        rows = list(csv.reader((SOURCE / 'sol3900.tab').read_text().splitlines(), skipinitialspace=True))
        for reading, col, conf, bit in zip(payload['readings'], [37, 15], [39, 16], [1, 8]):
            selected = [float(r[col]) for r in rows if r[conf].strip()[bit] == '1' and float(r[col]) != -999]
            self.assertEqual(reading['sampleCount'], 25)
            self.assertEqual(reading['value'], round(statistics.mean(selected), 3))
            self.assertEqual((reading['minimum'], reading['maximum']), (min(selected), max(selected)))
            self.assertIn('not a daily mean', reading['qualityNote'])
        self.assertIn('not independently verified', payload['reviewNote'])
        self.assertEqual({r['unit'] for r in payload['readings']}, {'Pa', 'K'})

    def test_runtime_content_is_exactly_reproducible_and_strict_json(self):
        self.assertEqual(json.loads((ROOT / 'public/data/environment.json').read_text()), build())
        json.dumps(build(), allow_nan=False)
