# Science, Geological Coverage, and Presentation — MARSWALK

## 1. Selected Region & Active Manifest Reference

- **Target Region:** Mount Sharp (*Aeolis Mons*) boxwork formations, Gale Crater, Mars (`~5.4° S, 137.8° E`).
- **Active Raster Reference:** `hirise-mro-pia26306-boxwork-2048x1042-v1` (HiRISE observation PSP_001752_1750 / PIA26306).
- **Position Status:** All three Curiosity science records in `public/data/markers.json` maintain `position: null` and `positionStatus: "unavailable"`. Precise pixel coordinates on this orbital mosaic remain unavailable until geodetic rover-to-orbital tie-points are formally verified. No coordinates are fabricated.

## 2. Geological Map Coverage & Legend Notes

- **Global / Regional Context:** USGS Scientific Investigations Map 3292 (*Geologic Map of Mars*, Tanaka et al., 2014) provides global chronostratigraphic context at **1:20,000,000** scale, placing Gale Crater within the Aeolis quadrangle (MC-23).
- **Local / Traverse Mapping:** USGS Astrogeology Science Center produces high-resolution HiRISE-derived DEMs and orthophotos for Curiosity's traverse, but a standalone, uniform-scale USGS SIM geological map legend specifically for the Mount Sharp boxwork AOI is **not** included in the current repository.
- **Coverage Limitation:** Orbital/global geological units provide regional stratigraphic context only and cannot be used to infer local rover-scale traversability, surface roughness, or mechanical hazards.

## 3. Curiosity Observations (Sourced Findings & Instrument Attribution)

1. **Mount Sharp Boxwork Ridges** (`curiosity-mount-sharp-boxwork`)
   - **Observation:** Crisscrossing mineral-cemented bedrock fracture ridges standing 1–2 m tall forming extensive boxwork networks across Mount Sharp.
   - **Interpretation:** Indicates that the ancient groundwater table remained high much later into Gale Crater's history than previously recognized, with wind subsequently eroding the softer unmineralized surrounding rock.
   - **Evidence Type:** `interpreted`
   - **Instruments:** Mastcam (context imaging), ChemCam (laser-induced breakdown spectroscopy), APXS (alpha particle X-ray spectrometer for bulk chemistry). `date: null` (active multi-sol campaign).
   - **Primary Source:** [NASA's Curiosity Rover Explores a 'Spiderweb' on Mars](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-explores-a-spiderweb-on-mars/) (Credit: NASA/JPL-Caltech).
   - **Scientific Boundary:** Ancient groundwater cementation does not demonstrate current liquid water.

2. **Vera Rubin Ridge Hematite & Calcium Sulfate Veins** (`curiosity-vera-rubin-ridge-hematite`)
   - **Observation:** Measured crystalline hematite and crosscutting calcium sulfate mineral veins in layered lacustrine mudstone bedrock along Vera Rubin Ridge.
   - **Interpretation:** Records multiple distinct episodes of diagenetic subsurface fluid alteration in an ancient lakebed setting.
   - **Evidence Type:** `measured`
   - **Instruments:** ChemCam, CheMin (X-ray diffraction), APXS. `date: null`.
   - **Primary Source:** [NASA Science — Curiosity's Proposed Path Up Mount Sharp](https://science.nasa.gov/resource/curiositys-proposed-path-up-mount-sharp/) (Credit: NASA/JPL-Caltech/MSSS).
   - **Scientific Boundary:** Ground-truth fluid alteration measurements at the ridge do not determine regional trafficability or hazard clearance.

3. **Mount Sharp Sulfate-Bearing Unit Transition** (`curiosity-sulfate-bearing-unit`)
   - **Observation:** Stratigraphic mineral transition from clay-rich lakebed mudstones (Glen Torridon) to overlying layered strata enriched in salty magnesium and calcium sulfates.
   - **Interpretation:** Records a major planetary climate transition from persistent ancient lakes to increasingly arid, drying environmental conditions.
   - **Evidence Type:** `derived`
   - **Instruments:** CheMin (mineralogy), SAM (sample analysis at Mars), Mastcam (multispectral imaging). `date: null`.
   - **Primary Source:** [NASA Science — Mars Science Laboratory (Curiosity)](https://science.nasa.gov/mission/msl-curiosity/) (Credit: NASA/JPL-Caltech).
   - **Scientific Boundary:** Regional paleoclimate transition interpretations do not provide route-level slope stability or route safety guarantees.

## 4. English Project Summary (50–200 words)

**MARSWALK** is an offline-capable mission-planning and science-provenance web application focused on **Aeolis Mons (Mount Sharp)** in **Gale Crater, Mars**. Designed for tablet and desktop exploration, the application allows mission planners to inspect high-resolution orbital imagery (HiRISE PIA26306), review verified science records from NASA's Curiosity rover, and evaluate exploration confidence. Every scientific marker is strictly attributed to primary NASA and USGS sources, rigorously separating measured observations from geological interpretations. Unverified marker positions, uncalibrated pixel distances, and missing terrain relief are explicitly communicated as unavailable rather than simulated. While interactive map routing and offline caching are planned features under active integration, the core scientific records and provenance contracts provide transparent, traceable planetary exploration data.

## 5. Concise Demo Story & Planned Implementation Status

- **Target Region:** Aeolis Mons (Mount Sharp) boxwork formations and sulfate-bearing strata, Gale Crater.
- **Implemented Foundation & Data:** Verified science records (`public/data/markers.json`), image contract (`docs/data/IMAGE_CONTRACT.md`), core domain contracts (`src/app/core/models.ts`), and mission service state management (`src/app/core/mission.service.ts`).
- **Planned Map Features:** Interactive Leaflet canvas (`CRS.Simple`), route creation (start, destination, waypoints, undo/clear), and layer visibility toggles are planned map features assigned to Willy and Enzo.
- **Planned Offline Features:** Offline application caching, local IndexedDB/localStorage route and observation persistence, and standalone offline export packages are planned features assigned to Coordinator and Enzo.
- **Planned 3D Prototype:** Rehearsal visualization in Three.js is a planned prototype (Longla) explicitly labeled **Prototype: 3D training view** without claiming unverified elevation relief.
