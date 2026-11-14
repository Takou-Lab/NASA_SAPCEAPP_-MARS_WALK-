# Science, Geological Coverage, and Presentation — MARSWALK

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

## 1. Selected Region & Active Manifest Reference

- **Target Region:** Mount Sharp (*Aeolis Mons*) boxwork formations, Gale Crater, Mars (`~5.4° S, 137.8° E`).
- **Active Raster Reference:** `hirise-mro-pia26306-boxwork-2048x1042-v1` (HiRISE observation PSP_001752_1750 / PIA26306, captured Dec. 10, 2006).
- **Position Status:** All three Curiosity science records in `public/data/markers.json` maintain `position: null` and `positionStatus: "unavailable"`. Exact pixel coordinates on the prepared PIA26306 raster remain unverified until rover-to-orbital geodetic tie-points are independently established. No coordinates are invented.

## 2. Geological Map Coverage & Legend Notes

- **Global / Regional Context:** USGS Scientific Investigations Map 3292 (*Geologic Map of Mars*, Tanaka et al., 2014) provides global chronostratigraphic context at **1:20,000,000** scale, placing Gale Crater within the Aeolis quadrangle (MC-23).
- **Orbital Context Mapping:** NASA's *Curiosity's Proposed Path up Mount Sharp* resource documents orbital mapping from MRO HiRISE, CRISM, CTX, and Mars Express HRSC.
- **Local AOI Limitation:** No standalone USGS geological map sheet or uniform AOI-scale map legend specifically for the Mount Sharp boxwork pixel frame is bundled in this repository. Orbital units do not determine rover-scale traversability or surface hazards.

## 3. Curiosity Observations (Observation vs. Derivation vs. Interpretation)

Full record-by-record source passages and verification gaps are documented in [docs/SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md).

1. **Mount Sharp Boxwork Ridges and Hollows** (`curiosity-mount-sharp-boxwork`)
   - **Observation:** Curiosity imaged the "Nevado Sajama 2" drill hole with MAHLI on Sol 4803 (`2026-02-09`) and planned APXS and MAHLI bedrock observations ("Mollecita", "Monte Cielo") along wide boxwork ridges and hollows; orbital HiRISE (PIA26306) observed the 10–20 km weblike ridge network on lower Mount Sharp.
   - **Interpretation (`evidenceType: "interpreted"`):** Scientists interpret the boxwork ridges as ancient groundwater-deposited minerals in bedrock fractures left standing after softer rock eroded.
   - **Instruments / Date:** MAHLI / APXS (Curiosity); HiRISE (MRO context) | `date: "2026-02-09"`.
   - **Source:** [Curiosity Blog, Sols 4804–4811](https://science.nasa.gov/blog/curiosity-blog-sols-4804-4811-kicking-off-the-final-phase-of-boxwork-exploration/) (Credit: NASA/JPL-Caltech/MSSS).
   - **Scientific Boundary:** Ancient groundwater mineralization does not establish current liquid water.

2. **Vera Rubin Ridge ("Pettegrove Point" / "Ailsa Craig" Target)** (`curiosity-vera-rubin-ridge-hematite`)
   - **Observation (`evidenceType: "measured"`):** On Sol 2121 on Vera Rubin Ridge ("Pettegrove Point" member), Curiosity brushed drill target "Ailsa Craig" with the Dust Removal Tool (DRT) and characterized it using MAHLI and APXS.
   - **Derivation:** Orbital data indicated a varying hematite signal across Vera Rubin Ridge drill sites.
   - **Instruments / Date:** MAHLI / APXS / DRT | `date: null` (Earth UTC acquisition date not stated in source body).
   - **Source:** [Curiosity Mission Update — Sol 2121: Blackjack!](https://science.nasa.gov/blog/sol-2121-blackjack/) (Credit: NASA/JPL-Caltech).
   - **Scientific Boundary:** Regional ridge measurements do not establish surface trafficability or hazard clearance at a route marker.

3. **Glen Torridon Clay-Bearing Unit to Sulfate-Rich Strata Transition** (`curiosity-sulfate-bearing-unit`)
   - **Observation:** Curiosity sampled the mudstone-dominated Murray formation and clay-bearing Glen Torridon region (drill sample #22 "Glen Etive" and drill hole #33 "Maria Gordon" near Greenheugh Pediment on Sol 3251, imaged by Left Navcam on Sol 3247), delivering drilled samples to CheMin and SAM.
   - **Interpretation (`evidenceType: "derived"`):** The ascent from clay-rich Glen Torridon rocks toward the sulfate-rich layers higher on Mount Sharp tracks a major environmental transition.
   - **Instruments / Date:** Left Navigation Camera / Drill / CheMin / SAM | `date: null` (multi-sol summary spanning Sols 236–3251).
   - **Source:** [Curiosity Mission Update — Sols 3251–3253: Celebrating Another Go Around](https://science.nasa.gov/blog/sols-3251-3253-celebrating-another-go-around/) (Credit: NASA/JPL-Caltech).
   - **Scientific Boundary:** Stratigraphic transition context does not provide route-level slope or hazard safety guarantees.

## 4. English Project Summary (50–200 words)

**MARSWALK** is an Angular PWA project for exploration rehearsal in the **Mount Sharp boxwork region of Gale Crater, Mars**. Current main displays a real prepared HiRISE image, lets users inspect three sourced Curiosity contextual records, and supports validated mission-file import/export with shared route, observation and uncertainty state. Record positions, image metric scale and terrain relief remain unavailable where unverified; no map pins, calibrated distances, slopes or safety classifications are invented. Enzo's functional route/notebook interface and Longla's corrected optional flat viewer are verified on their feature branches, with final integration tracked separately. Installation and the complete prepared offline close/reopen workflow still require implementation and actual-device acceptance. By making provenance and missing evidence visible alongside portable rehearsal missions, MARSWALK targets science education, analogue mission practice and outreach rather than validated operational navigation.

## 5. Presentation Notes

- **Internal Rehearsal Script:** See [docs/DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the current-main 60-second internal rehearsal, distinguishing working main features, branch-only interfaces and pending installed offline acceptance.
- **3D Rehearsal Note:** Longla's corrected optional flat viewer is verified on `feature/longla-3d-rehearsal` (`9d794e2`, code `2a6dbba`), pending main integration and device evidence. It is labeled **Prototype: 3D training view** and supplies no verified terrain or immersive VR.

## 6. Use Cases & Emma / Enzo UI Handoff (Contextual vs. Geolocated Records)

- **Near-Term Use Cases vs. Long-Term Vision:** MARSWALK's near-term use cases are planetary-science education, analogue mission rehearsal, science outreach, and human decision-making research under incomplete evidence. Operational astronaut or rover navigation is a long-term future vision, not a capability of the current prototype.
- **UI Ownership:** Emma owns science/evidence component implementation; Enzo integrates it in his shell and owns the notebook. The science list is already mounted on main. All three records in `public/data/markers.json` (`curiosity-mount-sharp-boxwork`, `curiosity-vera-rubin-ridge-hematite`, and `curiosity-sulfate-bearing-unit`) currently carry `position: null` and `positionStatus: "unavailable"`. In the UI science list and Data Passport, present these as **readable regional contextual science records** (reusing their `name`, `instrument`, `date`, `evidenceType`, `finding`, `source`, and `limitations` fields) rather than hiding them or placing invented map pins. Users must be able to draw route endpoints visually on the imagery without requiring a geolocated science marker.
