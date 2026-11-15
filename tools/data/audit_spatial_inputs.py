"""Read-only inventory for calibration review; pixel/DPI metadata never establishes ground scale."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[2]

def inspect(path):
    raw = path.read_bytes()
    with Image.open(path) as im:
        im.load()
        return dict(path=str(path.relative_to(ROOT)) if path.is_relative_to(ROOT) else str(path), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(), width=im.width, height=im.height, mode=im.mode, exifTagIds=sorted(im.getexif().keys()), metadataKeys=sorted(im.info.keys()))

def audit(master, derivative):
    source = inspect(master)
    output = inspect(derivative)
    comparisons = []
    with Image.open(master) as a, Image.open(derivative) as b:
        a, b = a.convert('RGB'), b.convert('RGB')
        for name, resampling in [('LANCZOS',Image.Resampling.LANCZOS),('BICUBIC',Image.Resampling.BICUBIC),('BILINEAR',Image.Resampling.BILINEAR)]:
            stats = ImageStat.Stat(ImageChops.difference(a.resize(b.size,resampling),b))
            comparisons.append(dict(filter=name,meanAbsoluteDifference=stats.mean,rmsDifference=stats.rms))
    return dict(schemaVersion=1, master=source, derivative=output, resizeComparisons=comparisons, comparisonMeaning='Image similarity only; does not verify exact processing, crop, rotation, map projection, meters per pixel or terrain alignment.', calibrationAccepted=False, metersPerPixel=None, terrainAccepted=False, requiredEvidence=['Original map-projected image product and label with CRS, grid scale/offsets and footprint','Exact processing/crop/resize/reprojection linking that grid to displayed pixels, or reviewed registration/control points','Original compatible DTM label/raster with horizontal and vertical units/reference, nodata and verified overlap','Independent control-point/known-distance validation and terrain sampling checks before runtime admission'])

def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--master',type=Path,default=ROOT/'public/data/imagery/PIA26306.jpg')
    p.add_argument('--derivative',type=Path,default=ROOT/'public/data/imagery/PIA26306_derived_2048.jpg')
    args=p.parse_args(argv)
    try:
        report=audit(args.master.resolve(),args.derivative.resolve())
        print(json.dumps(report,indent=2,allow_nan=False));return 0
    except (OSError,ValueError) as error:
        print('Spatial inventory failed: '+str(error),file=sys.stderr);return 1

if __name__=='__main__': sys.exit(main())
