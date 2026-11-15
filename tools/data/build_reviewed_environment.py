"""Build limited, contributor-supplied excerpt context; never certify NASA download provenance."""
import csv
import hashlib
import json
import math
from pathlib import Path
import re
import statistics

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'data/environment/reviewed-excerpt'
URL = 'https://atmos.nmsu.edu/PDS/data/mslrem_1001/DATA/SOL_03779_03902/SOL03900/RME_743666663RMD39000000000_______P2.TAB'

def build():
    table = (SOURCE / 'sol3900.tab').read_bytes()
    label = (SOURCE / 'sol3900.lbl').read_bytes()
    if hashlib.sha256(table).hexdigest() != 'ee30442b528cae1fbc67372ce380968992eac92e9bfdf6b64606be754a1abe62':
        raise ValueError('Submitted excerpt bytes changed')
    if hashlib.sha256(label).hexdigest() != 'a59e3dc793a2a0454f4fba4894439f711c1bd68b7b275077ccc2195ecbe6fbad':
        raise ValueError('Normalized label bytes changed')
    text = label.decode('ascii')
    def field(name):
        match = re.search(r'^' + name + r'\s*=\s*(.+)$', text, re.MULTILINE)
        if not match: raise ValueError('Missing label field ' + name)
        return match[1].strip().strip('"')
    if field('PLANET_DAY_NUMBER') != '3900' or field('PRODUCT_ID') != 'RME_743666663RMD39000000000_______P2':
        raise ValueError('Unexpected product')
    rows = list(csv.reader(table.decode('ascii').splitlines(), skipinitialspace=True))
    if len(rows) != 25 or any(len(r) != 40 for r in rows): raise ValueError('Expected 25 complete excerpt rows')
    readings = []
    for quantity, unit, column, confidence, bit, width in [('pressure','Pa',37,39,1,2), ('air-temperature','K',15,16,8,9)]:
        values = []
        for row in rows:
            mask = row[confidence].strip()
            value = float(row[column])
            if not math.isfinite(value): raise ValueError('Nonfinite excerpt measurement')
            if value == -999: continue
            if value < 0 or len(mask) != width or any(c not in '01X' for c in mask): raise ValueError('Invalid value or mask')
            if mask[bit] == '1': values.append(value)
        if not values: raise ValueError('No acceptable excerpt samples')
        readings.append(dict(quantity=quantity, unit=unit, value=round(statistics.mean(values),3), minimum=min(values), maximum=max(values), sampleCount=len(values), sol=3900, startUtc=field('START_TIME')+'Z', endUtc=field('STOP_TIME')+'Z', sourceUrl=URL, qualityNote='Contributor-supplied rows 1–25 only. Bounds above are the parent product interval, not exact excerpt times. '+('PS_CONFIDENCE_LEVEL shadow flag = 1.' if quantity=='pressure' else 'AMBIENT_TEMP_CONFIDENCE_LEVEL reliability flag = 1.')+' Other instrument flags/calibration are not independently certified. Unweighted excerpt mean; not a daily mean.'))
    return dict(schemaVersion=1, reviewStatus='limited', scope='historical-rover-context', instrument='REMS', sourceUrl=URL, reviewNote='Limited source review: calculated from Gaddielle’s submitted 25-row Sol 3900 excerpt and normalized product label. Original archive download is blocked here, so NASA byte provenance is not independently verified. This is not a full-sol dataset, current weather, or conditions across the mapped route.', readings=readings)

if __name__ == '__main__':
    # All input checks finish before output is touched; no archive measurements are guessed.
    payload = json.dumps(build(), indent=2, allow_nan=False) + '\n'
    destination = ROOT / 'public/data/environment.json'
    temporary = destination.with_suffix('.json.tmp')
    try:
        temporary.write_text(payload, encoding='utf-8', newline='\n')
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)
