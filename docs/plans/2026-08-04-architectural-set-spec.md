# Architectural Set Generator — Spec (DRAFT, pending review)

**Date:** 2026-08-04
**Status:** Draft for review
**Repo:** `Zomes3D` (static configurator, GitHub Pages, no build step)
**Feature name:** "Zomes Design Set" (working title)

## Context

Clients ask Zomes for "the architectural drawings" a few times per month. There is
no standardized set today; sales improvises per request. Meanwhile competitors
(Studio Shed, Modern Shed) sell permit plan sets as a product. None of them
generate sets dynamically from a configurator, and for a zome the drawings
genuinely vary per design: window rows c–g, extra door, skylights, foundation
kit, and finishes all change the elevations and schedules.

This feature adds a small button on the **summary popup** (the screen shown after
the lead form, next to Download PDF). It opens a new tab at `/plans/` that
renders a 6-sheet architectural "Design Set" for the exact configured zome,
viewable in the browser and downloadable as a single PDF on ARCH D (24"x36")
sheets. Clients self-serve; sales stops producing one-off drawings.

**Legal positioning (decided):** this is a *Design Set*, not a construction
document. Every sheet carries a "PRELIMINARY DESIGN — NOT FOR CONSTRUCTION"
notice. Stamped/engineered documentation remains a sales-assisted step. See
Disclaimer wording below.

**Access (decided):** fully open. Anyone with a `/plans/?config=...` URL can view
and download. No auth params (`email`/`t`) are ever propagated to this page. The
button's placement inside the post-form summary is the only soft gate.

## Current State (verified 2026-08-04)

- The entire design serializes into the URL `?config=` string. Parameters
  (`SharedParameterList`, `js/3d-configurator.js:209`): `M` model (0 pod / 1
  office / 2 studio), `A` windows [strip, viewport, custom], `R` interior, `E`
  exterior, `V` upgrades (order `['5','0','3']` = smart glass, _, extra door),
  `O` addons (order `['1','4']`), `U` foundation kit, `u` language, `a`
  currency, `q` custom windows (rows `c`–`g`, e.g. `c1-3` = panels 1 and 3 on
  row c), `r` qr flag, `D` discount.
- Custom window placement is letter+number addressed and resolved against mesh
  names (`findMeshByLetterAndNumber`, `js/3d-configurator.js:4992`). This maps
  1:1 to elevation openings and the window schedule.
- Dimensions shown in the configurator come from the loaded GLB bounding box
  (`getHouseDimensions`, `js/3d-configurator.js:5515`). There is **no
  authoritative dimensions table** in the repo. GLB scale appears to be meters
  (`HUMAN_HEIGHT = 2.0` in `js/settings.js`).
- pdfmake 0.2.7 + custom vfs fonts are already loaded site-wide
  (`index.html:1047-1049`); `js/pdf-maker.js` generates the existing summary PDF.
- The summary popup has two `summary_buttons__wrapper` blocks (top and bottom,
  `index.html:540` and `index.html:658`) holding Download PDF / Book time / Pay
  deposit. Handlers bind by class in `summaryBtnsHandler()`
  (`js/3d-configurator.js:3803`).
- `pod/`, `office/`, `studio/`, `select-zome/` are redirect stubs; `/plans/`
  is unclaimed.
- No package.json, no build, no test infra. Node is used only by
  `scripts/refresh-data.js` (built-ins only) via GitHub Actions.

## Permit workflow findings (2026-08-04)

A client's architect sent Zomes their required-drawings list (items 5–8 of
their checklist): floor plan / roof plan / foundation plan, all four proposed
elevations, standard details (module connection, door, window, foundation,
structural — tied to structural calcs), and an electrical plan (lighting,
receptacles, mini-split power). Each marked "Done by: Zomes — we'll take your
drawings and insert them into our titleblocked sheet."

Implications adopted into this spec:
- **Roof plan and foundation plan** join the generated lineup (both derivable
  from the geometry JSON).
- **Details and electrical** are demanded but content-gated: they need source
  material / standardized layouts from Zomes. Tracked as separate cards; not
  launch-blocking for the self-serve set.
- Professionals consume **bare drawings** and re-frame them in their own title
  blocks, so the viewer gets a second export: drawings only, no title block,
  exact scale.

## Proposed Change

### 1. Sheet lineup (Core 8, decided; extended per permit workflow findings)

| # | Sheet | Contents |
|---|-------|----------|
| 1 | **G-001 Cover** | Project title, model name, floor area, config ID + full config URL, sheet index, symbols/abbreviations legend, general notes, disclaimer block |
| 2 | **A-101 Floor Plan** | Dimensioned footprint polygon at cut plane ~4' AFF, door(s) with swing arcs, window openings on wall segments (openings above cut plane dashed, standard convention), floor area table, scale bar |
| 3 | **A-102 Roof Plan** | Panel courses viewed from above keyed to row letters, seam layout, skylight locations, slope/drainage note |
| 4 | **A-103 Foundation Plan** | Foundation kit layout when configured (subfloor outline, kit components, anchor points); "no foundation kit — by others" variant otherwise; reference-only note |
| 5 | **A-201 Elevations (N, E)** | True orthographic projections: silhouette, panel seam lines, config-specific openings, grade line, overall height + head/sill dimension strings, exterior finish keynotes |
| 6 | **A-202 Elevations (S, W)** | Same as A-201 for remaining views |
| 7 | **A-301 Building Section** | Cut through door axis: interior height, row band heights, wall assembly callout, foundation kit shown when configured (on/off variants), insulation/finish keynotes |
| 8 | **A-601 Schedules & Notes** | Window schedule (mark, row, qty, type fixed/operable/smart glass, nominal opening size), door schedule (main + extra door), finish schedule (exterior color, interior finish, floor), general notes |

Content-gated follow-ups (cards exist, need Zomes source material): **A-401
Details** (module/door/window/foundation connection details from engineering)
and **E-101 Electrical Plan** (standard lighting/receptacle/mini-split layout
per model).

Sheet format: ARCH D 24"x36" landscape, right-edge title block (project, sheet
number/name, date, scale, config ID, disclaimer). Drawing scale 1/2" = 1'-0"
for plans/elevations/sections (largest model ~20 ft across = 10" of sheet;
fits). Graphic scale bar on every drawing so half-size prints stay readable.

### 2. Geometry pipeline (decided: extract from GLB, Zomes verifies)

A **dev-only extraction page** `plans/dev-extract.html` loads the three house
GLBs with the same CDN three.js the site already uses, and computes per model:

- footprint polygon vertices (floor outline)
- overall diameter/height; row band heights (rows a–g)
- per-sector azimuth; per-panel 3D outline polygons keyed `row+sector`
  (matching the `customWindows` addressing)
- door location(s) + rough opening; window opening sizes per row
- foundation kit height (cross-check `FOUNDATION_HEIGHT = 0.116` m,
  `js/settings.js:30`)

Scale calibration: measured footprint area is checked against nominal 120 /
170 / 300 sq ft to derive the meters-to-feet factor; discrepancy > 3% fails
extraction loudly.

Output: `data/plans-geometry/{pod,office,studio}.json`, committed to the repo.
Each file carries `"verified": false` until Zomes reviews a generated dimension
summary; **flipping to `true` is a launch gate**. Runtime never touches the
GLBs; sheets render purely from these JSON files.

```jsonc
// data/plans-geometry/pod.json (schema sketch)
{
  "model": "pod",
  "units": "inches",
  "verified": false,
  "scaleCalibration": { "nominalAreaSqFt": 120, "measuredAreaSqFt": 0, "factor": 0 },
  "footprint": { "vertices": [[x, y]], "areaSqFt": 120 },
  "overall": { "diameterIn": 0, "heightIn": 0, "foundationHeightIn": 4.57 },
  "rows": { "c": { "sillIn": 0, "headIn": 0 } },
  "panels": [ { "row": "c", "sector": 1, "azimuthDeg": 0, "outline": [[x,y,z]],
                "opening": { "widthIn": 0, "heightIn": 0 } } ],
  "doors": [ { "type": "main", "sector": 0, "roughOpening": { "widthIn": 0, "heightIn": 0 } } ]
}
```

### 3. Rendering approach

Each sheet is a generated **SVG** at ARCH D proportions (viewBox 3600x2400,
1 unit = 0.01"). Elevations and the floor plan are true orthographic
projections of the panel outline polygons from the geometry JSON (front-facing
panels only, silhouette outline, openings drawn on their host panel). This
yields real architectural linework: heavy cut lines, medium object lines, light
dimension/seam lines. No runtime mesh processing, no screenshots.

Openings come from the parsed config:
- strip / viewport windows: fixed panel sets per model (mirror
  `VIEWPORT_AND_STRIP_SECTORS` from `js/settings.js`)
- custom windows: exactly the `q` parameter rows/panels
- smart glass: annotation on affected windows + schedule column
- extra door: additional door symbol at its sector (studio placement per
  `STUDIO_EXTRADOOR_SECTORS`)
- skylights/addons: shown dashed on plan, noted in schedules

### 4. Config parsing

New standalone read-only parser `js/plans/config-parse.js` for the `?config=`
string (the split-letter format above). **We do not extract or modify the
configurator's parser** (`ReadURLParameters` is DOM-coupled; touching a 5.7k-line
file for a read-only consumer is worse than disciplined duplication). Sync risk
is managed by:
- a comment in both files cross-referencing each other, and
- QA fixture URLs (below) that fail visibly if the format drifts.

Invalid/missing/legacy-format config: the page shows a friendly error with a
link to the configurator ("open your design and click Architectural Set").
The button always emits the current format, so the normal path never hits this.

### 5. PDF generation

pdfmake (already loaded) with custom page size `{width: 2592, height: 1728}` pt
(36"x24" at 72 pt/in); each sheet is one full-page SVG node. Fonts: Satoshi via
the existing vfs pattern, Roboto fallback.

**Spike first (task 1):** pdfmake's SVG path (svg-to-pdfkit) must prove it
embeds text + line work correctly at this page size. Go/no-go after a
half-day spike; fallback is jsPDF + svg2pdf.js (both CDN-loadable, no build).
Budget: full set generates in < 10 s, file < 5 MB.

### 6. Entry point button

Small ghost-style button/link "Architectural Set ↗" appended to **both**
`.summary_buttons__wrapper` blocks in the summary popup (matches existing
`summary_btn` styling, visually secondary to Download PDF). On click:
`window.open('/plans/?config=' + current serialized config, '_blank')`, built
after `WriteURLParameters()` settles (same 150 ms debounce-wait pattern as
`silentSaveDesign`, `js/3d-configurator.js:3950`). When editing a saved design,
append display-only `&dn=<design name>` (never `email`/`t`/`design_id`).
Fire `gtag('event', 'arch_set_opened')`; `arch_set_pdf_downloaded` on PDF click.

### 7. Viewer page UX

`plans/index.html`: left sidebar with 8 sheet thumbnails, main pane showing the
selected sheet (fit-to-width, zoom in/out buttons, drag to pan), sticky header
with model/design name and one primary button "Download PDF (full set)". Reuses
the site loader styles while geometry JSON + fonts load. Mobile: sheets stack
vertically, pinch zoom native.

Secondary export, "Drawings only": same sheets minus title block and border at
exact scale, for architects who insert Zomes drawings into their own
titleblocked sheets (the stated consumption mode in the permit workflow
findings). Same PDF pipeline, alternate sheet wrapper.

### Disclaimer wording (draft, review before launch)

> PRELIMINARY DESIGN — NOT FOR CONSTRUCTION. Generated from a Zomes Designer
> configuration for planning and reference only. This is not a construction
> document, has not been prepared or reviewed by a licensed architect or
> engineer, and is not approved for permit submission. Dimensions are nominal;
> verify all conditions on site. Engineered documentation is available from
> Zomes: hello@zomes.com.

Rendered in the title block of every sheet and in the PDF footer metadata.

## Acceptance Criteria

1. On all 3 models: complete the contact form, open the summary, and the
   Architectural Set button is visible in both button rows; clicking opens
   `/plans/` in a new tab carrying the current config string.
2. All 8 sheets render for all 3 models across the QA matrix (below) with
   correct model name, floor area, and opening placement.
3. Window schedule totals exactly match the configurator state for a fixture
   URL with custom windows `c:2, d:1, f:3` plus smart glass; door schedule
   shows the extra door if and only if configured.
4. Download PDF yields one 8-page vector PDF at 24"x36" landscape, selectable
   text, < 5 MB, generated in < 10 s on a mid-tier laptop. "Drawings only"
   export yields the same pages without title block/border at identical scale.
5. Every sheet shows: title block, sheet number + name, date, scale + graphic
   scale bar, config ID, and the disclaimer verbatim.
6. Dimension strings on A-101/A-201/A-301 come from geometry JSON files whose
   `verified` flag is `true` (launch gate: Zomes signs off on the generated
   dimension summary for all 3 models).
7. Opening `/plans/` with a missing, truncated, or legacy-format config shows
   the friendly error + configurator link; never a blank page or console-only
   failure.
8. `/plans/` URLs never contain `email`, `t`, or `design_id`; page makes no
   network requests beyond same-origin assets and the CDN libs already used
   by the site.
9. `arch_set_opened` and `arch_set_pdf_downloaded` events visible in GA4
   DebugView.
10. Existing configurator behavior unchanged (summary PDF, save flow, share).

## Testing Plan

No test infra exists in this repo; testing is fixture-driven manual/browser QA.

| Layer | What | How |
|-------|------|-----|
| Fixtures | 12 config URLs committed to `docs/plans/archset-qa-fixtures.md`: 3 models x {default, strip, viewport, custom c–g mix, extra door, foundation off, smart glass, addons}; each checked across all 8 sheets | Open each, eyeball against configurator side-by-side |
| Geometry | Extraction re-run reproduces committed JSON byte-identical; area calibration within 3% | dev-extract page report |
| Schedules | Window/door counts vs configurator for each fixture | manual cross-check, counts must be exact |
| PDF | Print-scale check: measure a known dimension on a 24x36 print (or full-size PDF measure tool) = stated scale | once per model |
| Regression | Summary popup buttons, PDF download, save flow on all 3 models | existing flows, browser QA |

## Rollback Plan

Feature is fully additive. Rollback = remove the button markup/wiring from
`index.html` + `js/3d-configurator.js` (the `/plans/` page goes dark but is
harmless standalone). No data, no backend, no migrations.

## Effort Estimate (human / Claude Code-assisted)

| Component | Human | CC-assisted |
|-----------|-------|-------------|
| PDF spike (pdfmake SVG @ ARCH D, go/no-go) | 0.5 d | ~30 min |
| Geometry extraction tool + 3 JSON files | 2 d | 1–2 h |
| Sheet framework: SVG scaffold, title block, dims, line weights | 1 d | ~1 h |
| A-101 floor plan | 1.5 d | 1–2 h |
| A-102 roof plan + A-103 foundation plan | 1.5 d | 1–2 h |
| A-201/202 elevations (projection + openings) | 2.5 d | 2–3 h |
| A-301 section | 1 d | ~1 h |
| G-001 cover + A-601 schedules | 1 d | ~1 h |
| Viewer page, button wiring, analytics | 1 d | ~1 h |
| "Drawings only" export | 0.25 d | ~30 min |
| QA matrix across models/configs + dimension verification round | 1 d | ~2 h |
| **Total** | **~13 d** | **~2 days of sessions** |

Sequencing: spike → extraction (+ send dimension summary for verification, async)
→ framework → sheets → viewer/button → QA. The verification round with Zomes is
the only external dependency and runs in parallel from week 1.

## Files Reference

| File | Change |
|------|--------|
| `plans/index.html` | New: viewer page |
| `css/plans.css` | New: viewer + sheet styles |
| `js/plans/config-parse.js` | New: standalone read-only `?config=` parser |
| `js/plans/geometry.js` | New: loads/validates geometry JSON |
| `js/plans/sheets/{titleblock,dims,cover,floorplan,roofplan,foundationplan,elevations,section,schedules}.js` | New: SVG generators |
| `js/plans/pdf.js` | New: sheet SVGs → single ARCH D PDF |
| `js/plans/main.js` | New: boot, sheet nav, zoom/pan, download |
| `plans/dev-extract.html` + `js/plans/dev/extract-geometry.js` | New: dev-only geometry extraction |
| `data/plans-geometry/{pod,office,studio}.json` | New: committed geometry (verified flag) |
| `index.html:540,658` | Add button to both `summary_buttons__wrapper` blocks |
| `js/3d-configurator.js` (~3803 `summaryBtnsHandler`) | Wire button href + analytics events |
| `docs/plans/archset-qa-fixtures.md` | New: QA fixture URLs |

## Out of Scope (v1)

- Structural sheets (S-), foundation engineering, design loads
- A-401 Details and E-101 Electrical Plan: demanded per permit workflow
  findings but gated on Zomes source material — separate cards, not v1
  launch-blocking
- Title 24 / energy compliance, plumbing/mechanical
- Site plan (client's lot; template sheet is a v2 candidate)
- Stamped or jurisdiction-specific sets; any per-state logic
- i18n (English only), prices on sheets
- Dynamic 3D hero render on the cover; CMS-edited notes via Google Sheets
- Gating/auth of any kind on `/plans/`

## Open Items

1. Disclaimer wording: Shereef reviews (decided owner); flag to counsel if ever
   marketed as "permit plans".
2. Dimension verification: who at Zomes signs off on the generated dimension
   summary (blocks flipping `verified: true`).
3. Zomes to provide the standard details package (module/door/window/foundation
   connections, per structural calcs) and standardized electrical layouts per
   model — these unblock the content-gated A-401 / E-101 cards.
4. v2 candidates, in observed-demand order: site-plan template sheet, CMS notes,
   DXF export of bare drawings.

## Related

- `docs/plans/2026-05-07-saved-designs-design.md` (summary popup, auth model)
- Market refs: Studio Shed permit plan sets, Maxable ADU permit-set anatomy
