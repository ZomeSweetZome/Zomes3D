# Architectural Set — Dimension Verification Summary

Generated from `scripts/extract-plans-geometry.mjs` (GLB-derived, ZOM-61).
**Please verify each number against manufacturing reality.** When all three
models are confirmed, flip `"verified": true` in `data/plans-geometry/*.json`
— that flag is the launch gate for the /plans/ generator (ZOM-70).

Scale check: the 'man' figure in every model measures **5'-9"** — consistent
with meters-scale GLBs. Note the marketing sq-ft labels do not match measured
geometry consistently (see per-model deviation); flag if that's unexpected.

## Pod (nominal 120 sq ft)

- Overall (incl. roof): 20'-7¾" W × 19'-7½" D × 12'-10¾" H
- Footprint at base: 15'-1½" × 14'-4½", area **178.7 sq ft** (panel-base-hull; +48.9% vs nominal)
- Foundation kit height: 4½"

| Row | Sill | Head | Panels |
|---|---|---|---|
| C | 1'-11¼" | 5'-6¾" | 9 |
| D | 3'-8¾" | 7'-4" | 8 |
| E | 5'-5¾" | 9'-0½" | 9 |
| F | 7'-1¾" | 10'-9" | 10 |
| G | 8'-9½" | 12'-6¼" | 10 |

- Door (main): 3'-4" W × 6'-8" H
- Window glass row C: ≈5'-4" × 3'-7½", 9 positions (+9 operable variant)
- Window glass row D: ≈5'-1¾" × 3'-7", 8 positions
- Window glass row E: ≈4'-5¼" × 3'-6¾", 9 positions
- Window glass row F: ≈5'-1¾" × 3'-7¼", 10 positions
- Window glass row G: ≈5'-6½" × 3'-8¾", 10 positions

## Office (nominal 170 sq ft)

- Overall (incl. roof): 22'-6½" W × 21'-5¼" D × 12'-6¼" H
- Footprint at base: 17'-0¼" × 16'-2¼", area **226.8 sq ft** (panel-base-hull; +33.4% vs nominal)
- Foundation kit height: 4½"

| Row | Sill | Head | Panels |
|---|---|---|---|
| C | 1'-10¾" | 5'-5" | 9 |
| D | 3'-7¾" | 7'-1½" | 8 |
| E | 5'-3¾" | 8'-9½" | 9 |
| F | 6'-11¼" | 10'-5¼" | 10 |
| G | 8'-6¾" | 12'-1¾" | 10 |

- Door (main): 3'-4" W × 6'-8" H
- Window glass row C: ≈5'-11¾" × 3'-6¼", 9 positions (+9 operable variant)
- Window glass row D: ≈5'-9¼" × 3'-5½", 8 positions
- Window glass row E: ≈4'-11½" × 3'-5½", 9 positions
- Window glass row F: ≈5'-9" × 3'-5¾", 10 positions
- Window glass row G: ≈6'-2¾" × 3'-7", 10 positions

## Studio (nominal 300 sq ft)

- Overall (incl. roof): 26'-9" W × 26'-1½" D × 13'-6¼" H
- Footprint at base: 18'-3" × 17'-9½", area **266.2 sq ft** (floor-mesh; -11.3% vs nominal)
- Foundation kit height: 4½"

| Row | Sill | Head | Panels |
|---|---|---|---|
| C | 1'-11½" | 5'-3¼" | 11 |
| D | 3'-7¼" | 6'-10¾" | 10 |
| E | 5'-2¼" | 8'-5" | 11 |
| F | 6'-8½" | 10'-0" | 12 |
| G | 8'-2¾" | 11'-6½" | 12 |
| H | 9'-8¼" | 13'-1½" | 12 |

- Door (main): 3'-4" W × 6'-8" H
- Door (extra): 3'-4" W × 6'-8" H
- Window glass row C: ≈6'-0½" × 3'-3¾", 11 positions (+11 operable variant)
- Window glass row D: ≈5'-11½" × 3'-3¼", 10 positions
- Window glass row E: ≈5'-4" × 3'-2¾", 11 positions
- Window glass row F: ≈5'-10¾" × 3'-3½", 12 positions
- Window glass row G: ≈6'-2" × 3'-3¾", 12 positions
- Window glass row H: ≈6'-3" × 3'-5¼", 12 positions

