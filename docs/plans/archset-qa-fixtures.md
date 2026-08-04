# Architectural Set — QA Fixture URLs

Canonical test configs for the `/plans/` generator (ZOM-59 epic). Every sheet
card QAs against these; `js/plans/config-parse.js` must parse all of them
(mirrored in the parser's Node test). If the config wire format changes in
`js/3d-configurator.js` (SharedParameterList), update the parser, these
fixtures, and re-verify.

Base URL: `https://design.zomes.com/plans/?config=` (locally:
`http://localhost:8317/plans/?config=`). Note: row `g` custom windows are
studio-only (`updateCustomWindows` rejects `g` for pod/office).

| # | Name | Config | Expect |
|---|------|--------|--------|
| 1 | pod-default | `M0A0-0-0R0E0V0-0-0O0-0U0u0a0qc-d-e-f-gr0D0` | Pod 120, no windows, MgO interior, Dark Grey, no kit |
| 2 | pod-strip-foundation | `M0A1-0-0R0E0V0-0-0O0-0U1u0a0qc-d-e-f-gr0D0` | Pod, strip windows, foundation kit ON |
| 3 | pod-custom-smartglass | `M0A0-0-1R1E1V1-0-0O0-0U0u0a0qc-1-3-d-2-e-f-gr0D0` | Pod, custom c:[1,3] d:[2], smart glass, Wood interior, White ext |
| 4 | pod-viewport-extradoor-desk | `M0A0-1-0R0E0V0-0-1O1-0U0u0a0qc-d-e-f-gr0D0` | Pod, viewport, extra door, desk |
| 5 | office-default | `M1A0-0-0R0E0V0-0-0O0-0U0u0a0qc-d-e-f-gr0D0` | Office 170, all defaults |
| 6 | office-viewport-ac | `M1A0-1-0R2E0V0-0-0O0-1U0u0a0qc-d-e-f-gr0D0` | Office, viewport, Sound Panels, air conditioning |
| 7 | office-custom-heavy | `M1A0-0-1R0E1V1-0-1O0-0U1u0a0qc-1-2-3-d-1-4-e-2-f-1-gr0D0` | Office, custom c:[1,2,3] d:[1,4] e:[2] f:[1], smart glass, extra door, kit ON |
| 8 | office-strip-smartglass | `M1A1-0-0R0E0V1-0-0O0-0U0u0a0qc-d-e-f-gr0D0` | Office, strip, smart glass |
| 9 | studio-default | `M2A0-0-0R0E0V0-0-0O0-0U0u0a0qc-d-e-f-gr0D0` | Studio 300, all defaults |
| 10 | studio-custom-g-row | `M2A0-0-1R1E0V0-0-0O0-0U1u0a0qc-d-2-e-f-3-g-6r0D0` | Studio, custom d:[2] f:[3] g:[6], kit ON |
| 11 | studio-extremeweather-extradoor | `M2A0-0-0R0E1V0-1-1O0-0U0u0a0qc-d-e-f-gr0D0` | Studio, extreme weather pkg, extra door |
| 12 | studio-everything | `M2A1-1-1R2E1V1-1-1O1-1U1u0a0qc-1-4-d-2-e-5-f-1-g-3-6r0D0` | Studio, strip+viewport+custom (c:[1,4] d:[2] e:[5] f:[1] g:[3,6]), all upgrades, all addons, kit ON |

Error-path fixtures (viewer must show the friendly error, never a blank page):

| Name | URL suffix | Expect |
|------|-----------|--------|
| missing | `/plans/` (no query) | `missing` error |
| garbage | `?config=hello%20world` | `malformed` error |
| unknown-model | `?config=M9A0-0-0R0E0` | `unknown-model` error |
| legacy-single-O | `?config=M0A0-0-0R0E0V0-0-0-0-0-0-0O0u0a0q0rNaN` | parses ok (defaults), matches configurator's forgiving behavior |
