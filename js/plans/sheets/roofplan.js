// A-102 Roof Plan (panel courses from above) and A-103 Foundation Plan.

'use strict';

import { LW, line, poly, text, s, drawingArea } from './sheet.js';
import { hDim, fmtFtIn, scaleBar } from './dims.js';
import { resolveWindows, rowAzimuth, panelAt, WALL_THICKNESS_IN } from './common.js';

export function roofPlanSheet(ctx) {
  const { design, geo } = ctx;
  const a = drawingArea();
  const cx = a.x + a.w / 2 - 100;
  const cy = a.y + a.h / 2 - 20;
  const X = (p) => cx + s(p[0]);
  const Y = (p) => cy + s(p[2]); // top-down: world Z maps to sheet down
  let c = '';

  // All panels projected from above — nested courses read as the roof plan.
  for (const p of [...geo.panels].sort((m, n) => m.row.localeCompare(n.row))) {
    c += poly(p.outline.map((pt) => [X(pt), Y(pt)]), LW.thin);
  }
  // Footprint (eave line).
  c += poly(geo.footprint.vertices.map(([x, z]) => [cx + s(x), cy + s(z)]), LW.object);

  // Row labels along the entry axis (+Z, sheet-down).
  for (const [row, r] of Object.entries(geo.rows)) {
    let bestR = 0;
    for (const p of geo.panels.filter((p) => p.row === row)) {
      for (const pt of p.outline) bestR = Math.max(bestR, Math.hypot(pt[0], pt[2]));
    }
    const mid = bestR * 0.86;
    c += text(cx, cy + s(mid) + 8, row.toUpperCase(), 22, { anchor: 'middle' });
  }

  // Configured windows on upper rows, marked from above (dashed = glazing).
  for (const w of resolveWindows(design, geo)) {
    const host = panelAt(geo, w.row, w.sector);
    if (!host) continue;
    const pts = host.outline.map((pt) => [X(pt), Y(pt)]);
    c += poly(pts, LW.object, { dash: '12,8' });
  }

  const xs = geo.footprint.vertices.map((v) => v[0]);
  c += hDim(cx + s(Math.min(...xs)), cx + s(Math.max(...xs)),
    cy + s(Math.max(...geo.footprint.vertices.map((v) => v[1]))) + 100,
    fmtFtIn(Math.max(...xs) - Math.min(...xs)), cy);

  const nx = a.x + a.w - 120, ny = a.y + a.h - 200;
  c += line(nx, ny + 60, nx, ny, LW.object);
  c += poly([[nx - 12, ny + 18], [nx, ny], [nx + 12, ny + 18]], LW.object, { fill: '#000' });
  c += text(nx, ny + 96, 'PLAN N', 22, { anchor: 'middle' });

  c += text(a.x + a.w - 620, a.y + 60, 'PANEL COURSES KEYED BY ROW LETTER.', 24);
  c += text(a.x + a.w - 620, a.y + 96, 'DASHED PANELS = GLAZED (SEE A-601).', 24);
  c += text(a.x + a.w - 620, a.y + 132, 'SELF-SHEDDING GEOMETRY; NO GUTTERS REQ\'D.', 24);
  c += text(cx, a.y + a.h - 90, 'ROOF PLAN', 30, { anchor: 'middle', weight: 'bold' });
  c += scaleBar(a.x + 40, a.y + a.h - 90);
  return c;
}

export function foundationPlanSheet(ctx) {
  const { design, geo } = ctx;
  const a = drawingArea();
  const cx = a.x + a.w / 2 - 100;
  const cy = a.y + a.h / 2 - 20;
  let c = '';
  const verts = geo.footprint.vertices;
  const pts = verts.map(([x, z]) => [cx + s(x), cy + s(z)]);

  if (design.foundationKit) {
    c += poly(pts, LW.cut);
    // Simple diagonal hatch clipped to the polygon bbox (reference drawing).
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
    const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
    c += `<defs><clipPath id="fnd-clip"><polygon points="${pts.map((p) => p.join(',')).join(' ')}"/></clipPath></defs>`;
    let h = '';
    for (let x = x0 - (y1 - y0); x < x1; x += 46) {
      h += line(x, y1, x + (y1 - y0), y0, LW.hair);
    }
    c += `<g clip-path="url(#fnd-clip)">${h}</g>`;
    const f = geo.foundation.bbox;
    c += text(cx, cy - 20, 'FOUNDATION REPLACEMENT KIT', 30, { anchor: 'middle', weight: 'bold' });
    c += text(cx, cy + 24, `HEIGHT ${fmtFtIn(f.size[1])} — MOISTURE-BARRIER SUBFLOOR`, 24, { anchor: 'middle' });
    c += text(cx, cy + 60, 'ANCHORING PER MANUFACTURER INSTRUCTIONS', 22, { anchor: 'middle' });
  } else {
    c += poly(pts, LW.object, { dash: '16,10' });
    c += text(cx, cy - 20, 'NO FOUNDATION KIT CONFIGURED', 30, { anchor: 'middle', weight: 'bold' });
    c += text(cx, cy + 24, 'FOUNDATION BY OTHERS — SLAB, PIERS, OR GRAVEL PAD', 24, { anchor: 'middle' });
    c += text(cx, cy + 60, 'PER SITE CONDITIONS AND LOCAL CODE', 22, { anchor: 'middle' });
  }

  const xs2 = verts.map((v) => v[0]);
  const zs2 = verts.map((v) => v[1]);
  c += hDim(cx + s(Math.min(...xs2)), cx + s(Math.max(...xs2)),
    cy + s(Math.max(...zs2)) + 100, fmtFtIn(Math.max(...xs2) - Math.min(...xs2)), cy);

  c += text(a.x + a.w - 680, a.y + 60, 'REFERENCE LAYOUT ONLY — NOT AN ENGINEERED', 24);
  c += text(a.x + a.w - 680, a.y + 96, 'FOUNDATION DESIGN. SEE NOTICE THIS SHEET.', 24);
  c += text(cx, a.y + a.h - 90, 'FOUNDATION PLAN', 30, { anchor: 'middle', weight: 'bold' });
  c += scaleBar(a.x + 40, a.y + a.h - 90);
  return c;
}
