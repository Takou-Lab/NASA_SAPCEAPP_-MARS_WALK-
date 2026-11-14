# Science, Geological Coverage, and Presentation — MARSWALK

## 1. Selected Region & AOI Status

- **Target Region:** Mount Sharp (*Aeolis Mons*) boxwork formations, Gale Crater, Mars (`~5.4° S, 137.8° E`).
- **AOI Status:** `public/data/manifest.json` has not yet been finalized in this repository. All markers in `public/data/markers.json` therefore use `position: null` and `positionStatus: "unavailable"`. No coordinates have been invented.

## 2. Geological Map Coverage & Legend Notes

- **Global / Regional Context:** USGS Scientific Investigations Map 3292 (*Geologic Map of Mars*, Tanaka et al., 2014) provides global stratigraphic context at **1:20,000,000** scale, placing Gale Crater within the Aeolis quadrangle (MC-23).
- **Local / Traverse Mapping:** USGS Astrogeology Science Center produces high-resolution HiRISE-derived DEMs and orthophotos for Curiosity's traverse, but a standalone, uniform-scale USGS SIM geological map legend specifically for the Mount Sharp boxwork AOI is **not** included in the current repository.
- **Coverage Limitation:** Orbital/global geological units cannot be used to infer local rover-scale traversability or surface hazards.

## 3. Curiosity Observations (Observation vs. Interpretation)

1. **Mount Sharp Boxwork Ridges** (`curiosity-mount-sharp-boxwork`)
   - **Observation:** Crisscrossing 1–2 m tall mineral-cemented ridges spanning 10–20 km on Mount Sharp.
   - **Interpretation:** Formed by ancient groundwater depositing minerals in bedrock fractures before softer surrounding rock eroded away.
   - **Instrument / Date:** Mastcam / MAHLI / APXS (exact sol/date not pinned to a single sample in this summary; `date: null`).
   - **Source:** [NASA Science — Curiosity](https://science.nasa.gov/mission/msl-curiosity/) (Credit: NASA / JPL-Caltech).
   - **Boundary:** Ancient groundwater evidence does not establish current liquid water.

2. **Vera Rubin Ridge Hematite & Calcium Sulfate Veins** (`curiosity-vera-rubin-ridge-hematite`)
   - **Observation:** Stratified sedimentary rocks with hematite and calcium sulfate veins on Vera Rubin Ridge.
   - **Interpretation:** Deposited in an ancient lake and later altered by multiple episodes of subsurface fluid flow.
   - **Instrument / Date:** ChemCam / CheMin / Mastcam (`date: null`).
   - **Source:** [NASA Science — Curiosity's Proposed Path Up Mount Sharp](https://science.nasa.gov/resource/curiositys-proposed-path-up-mount-sharp/) (Credit: NASA / JPL-Caltech / MSSS).

3. **Mount Sharp Sulfate-Bearing Unit Transition** (`curiosity-sulfate-bearing-unit`)
   - **Observation:** Salty, sulfate-rich mineral strata overlying the clay-bearing Glen Torridon unit.
   - **Interpretation:** Records a planetary climate transition from wetter ancient lakes to drier, more arid conditions.
   - **Instrument / Date:** CheMin / SAM / Mastcam (`date: null`).
   - **Source:** [NASA Science — Curiosity](https://science.nasa.gov/mission/msl-curiosity/) (Credit: NASA / JPL-Caltech).

## 4. English Project Summary (50–200 words)

**MARSWALK** is an offline-capable mission-planning and science-provenance web application focused on **Aeolis Mons (Mount Sharp)** in **Gale Crater, Mars**. Designed for tablet and desktop use, the application lets users inspect orbital imagery, toggle map layers, draw and edit candidate rover traverse routes (start, waypoints, destination, undo/clear), and record local field observations in a persistent notebook. Every scientific marker is strictly tied to primary NASA/USGS sources, separating measured observations from geological interpretations and explicitly flagging unverified locations, missing terrain elevation, or unavailable metric calibration. By pairing interactive route planning with an Exploration Confidence Panel, MARSWALK helps teams rehearse planetary traverses while remaining transparent about data coverage and scientific limitations.

## 5. Concise Demo / Slide Text

- **Target:** Aeolis Mons (Mount Sharp) boxwork & sulfate-bearing strata, Gale Crater.
- **Mission Flow:** Select target → Draw/edit route → Review Exploration Confidence & data limitations → Inspect sourced Curiosity science markers → Save offline observations.
- **3D/VR Note:** Any 3D/VR rehearsal view is labeled **Prototype: 3D training view** and does not represent measured terrain unless a verified DEM is loaded.
