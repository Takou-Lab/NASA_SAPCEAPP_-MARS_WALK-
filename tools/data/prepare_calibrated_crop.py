"""Rebuild display pixels/manifest from the preserved user-supplied georeferenced crop. Requires requirements-spatial.txt. No geometric resampling."""
import sys,json,hashlib
import tifffile,numpy as np
from PIL import Image
from pathlib import Path
root=Path(__file__).resolve().parents[2];path=root/'data/imagery/calibrated-source/marswalk_crop.tif'
with tifffile.TiffFile(path) as t:
 a=t.asarray();g=t.geotiff_metadata
 assert g['ProjCoordTransGeoKey']==17 and g['GeogSemiMajorAxisGeoKey']==3396190.0 and g['ProjCenterLatGeoKey']==0.0
 assert a.shape==(2048,2048) and g['ModelPixelScale']==[0.25,0.25,0.0]
 assert g['ProjLinearUnitsGeoKey']==9001 and g['ProjCenterLongGeoKey']==180.0
 tie=g['ModelTiepoint'];assert tie[3:5]==[-2531487.0,-286803.75]
lo,hi=np.percentile(a,[2,98]);pixels=np.clip((a.astype(float)-lo)*255/(hi-lo),0,255).astype('uint8')
out=root/'public/data/imagery/PSP_001752_1750_RED_crop_2048.jpg';Image.fromarray(pixels).save(out,quality=90,optimize=True)
ref='hirise-psp001752-red-center-2048-025m-v2'
manifest=json.loads((root/'public/data/manifest.json').read_text());manifest.update(imageRef=ref,assetPath='data/imagery/'+out.name,width=2048,height=2048)
manifest['source']={'title':'HiRISE PSP_001752_1750_RED — 512 m projected central crop','url':'https://www.uahirise.org/PSP_001752_1750','credit':'NASA/JPL-Caltech/University of Arizona'}
manifest['calibration']={'verified':True,'metersPerPixel':0.25,'sourceUrl':'https://hirise-pds.lpl.arizona.edu/download/PDS/RDR/PSP/ORB_001700_001799/PSP_001752_1750/PSP_001752_1750_RED.JP2','method':'User-supplied GeoTIFF crop: Mars equirectangular CRS in meters, 0.25 m square pixels; 2048x2048 display conversion without geometric resampling. Distances are projected planar lengths, not terrain-following or safety assessments.'}
manifest['limitations']=['Central 512 x 512 projected-meter crop of HiRISE PSP_001752_1750_RED; exact boxwork target and rover/science-site overlap are unverified.','Distance is derived in the Mars equirectangular map plane, not a geodesic or terrain-following length; projection distortion and source positional uncertainty remain.','No DEM, elevation, slope, obstacle clearance or route safety classification is supplied. Optical brightness is not elevation.','GeoTIFF and label supplied by user from local QGIS/GDAL workflow; original full JP2 was not independently downloaded here.','Science records and historical REMS excerpt are regional context, not verified measurements at the drawn route.']
(root/'public/data/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
markers=json.loads((root/'public/data/markers.json').read_text())
for m in markers:m['imageRef']=ref
(root/'public/data/markers.json').write_text(json.dumps(markers,indent=2,ensure_ascii=False)+'\n')
report={'imageRef':ref,'sourceProduct':'PSP_001752_1750_RED','cropSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'displaySha256':hashlib.sha256(out.read_bytes()).hexdigest(),'sourceDimensions':[28417,58616],'sourcePixelWindow':[13184,28284,2048,2048],'dimensions':[2048,2048],'pixelSizeMeters':[0.25,-0.25],'upperLeftProjectedMeters':tie[3:5],'boundsProjectedMeters':[-2531487.0,-287315.75,-2530975.0,-286803.75],'displayConversion':'2nd–98th percentile 8-bit grayscale stretch; JPEG quality90; no crop/resample/rotation beyond source window','stretchBounds':[float(lo),float(hi)],'crs':{'name':g['GTCitationGeoKey'],'radiusMeters':g['GeogSemiMajorAxisGeoKey'],'centerLongitude':180,'centerLatitude':0,'units':'meters'},'oldImageRef':'hirise-mro-pia26306-boxwork-2048x1042-v1','compatibility':'New storage key; old missions not transformed or deleted. Old-image imports rejected.'}
(root/'docs/data/evidence/CALIBRATED_CROP.json').write_text(json.dumps(report,indent=2)+'\n')
print('Prepared',out.stat().st_size,'bytes; stretch',lo,hi)
