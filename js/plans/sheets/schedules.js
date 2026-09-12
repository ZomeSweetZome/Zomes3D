// A-601 Schedules + Notes: window / door / finish schedules from the parsed
// config, using the window marks assigned by the floor plan.

'use strict';

import { LW, line, text, wrap, drawingArea } from './sheet.js';
import { fmtFtIn } from './dims.js';
import { resolveDoors } from './common.js';

export function schedulesSheet(ctx) {
  const { design, geo, windowMarks } = ctx;
  const a = drawingArea();
  let c = '';
  let y = a.y + 80;

  // ── Window schedule ────────────────────────────────────────────────
  c += text(a.x + 40, y, 'WINDOW SCHEDULE', 32, { weight: 'bold' });
  y += 50;
  const cols = [a.x + 40, a.x + 160, a.x + 300, a.x + 480, a.x + 760, a.x + 1100, a.x + 1400];
  const header = ['MARK', 'ROW', 'SECTOR', 'TYPE', 'NOMINAL GLASS SIZE', 'GLAZING', 'SET'];
  header.forEach((h, i) => { c += text(cols[i], y, h, 24, { weight: 'bold' }); });
  y += 14; c += line(a.x + 40, y, a.x + 1700, y, LW.object); y += 40;

  if (!windowMarks.length) {
    c += text(a.x + 40, y, 'NO GLAZED PANELS CONFIGURED', 24); y += 44;
  }
  for (const w of windowMarks) {
    const glass = nominalGlass(geo, w.row, w.operable);
    const rowVals = [
      w.mark, w.row.toUpperCase(), String(w.sector),
      w.operable ? 'OPERABLE (AWNING)' : 'FIXED',
      glass ? `${fmtFtIn(glass.widthIn)} × ${fmtFtIn(glass.heightIn)}` : '—',
      w.smart ? 'INSULATED SMART GLASS' : 'INSULATED',
      w.kind.toUpperCase(),
    ];
    rowVals.forEach((v, i) => { c += text(cols[i], y, v, 24); });
    y += 38;
  }
  y += 20; c += line(a.x + 40, y, a.x + 1700, y, LW.thin); y += 60;

  // ── Door schedule ──────────────────────────────────────────────────
  c += text(a.x + 40, y, 'DOOR SCHEDULE', 32, { weight: 'bold' });
  y += 50;
  const dcols = [a.x + 40, a.x + 160, a.x + 560, a.x + 900];
  ['MARK', 'TYPE', 'ROUGH SIZE', 'NOTES'].forEach((h, i) => { c += text(dcols[i], y, h, 24, { weight: 'bold' }); });
  y += 14; c += line(a.x + 40, y, a.x + 1700, y, LW.object); y += 40;
  resolveDoors(design, geo).forEach((d, i) => {
    const vals = [
      `D${i + 1}`,
      d.type === 'main' ? 'ENTRY DOOR' : 'EXTRA DOOR (UPGRADE)',
      `${fmtFtIn(d.widthIn)} × ${fmtFtIn(d.heightIn)}`,
      'FACTORY-INSTALLED, LOCKSET INCLUDED',
    ];
    vals.forEach((v, j) => { c += text(dcols[j], y, v, 24); });
    y += 38;
  });
  y += 20; c += line(a.x + 40, y, a.x + 1700, y, LW.thin); y += 60;

  // ── Finish schedule ────────────────────────────────────────────────
  c += text(a.x + 40, y, 'FINISH SCHEDULE', 32, { weight: 'bold' });
  y += 50;
  const finishes = [
    ['EXTERIOR PANELS', design.exterior.name],
    ['INTERIOR WALLS', design.interior.name],
    ['FLOOR', design.foundationKit ? 'Subfloor over Foundation Replacement Kit (moisture barrier)' : 'Base subfloor, finish flooring by owner'],
  ];
  for (const [k, v] of finishes) {
    c += text(a.x + 40, y, k, 24, { weight: 'bold' });
    c += text(a.x + 560, y, v.toUpperCase(), 24);
    y += 38;
  }
  y += 40;

  // ── Options summary + notes ────────────────────────────────────────
  c += text(a.x + 40, y, 'CONFIGURED OPTIONS', 32, { weight: 'bold' });
  y += 50;
  const opts = [
    design.upgrades.smartGlass && 'Insulated Smart Glass (all glazed panels) — tag SG on elevations',
    design.upgrades.extremeWeather && 'Extreme Weather package',
    design.upgrades.extraDoor && 'Extra Door — see D2',
    design.addons.desk && 'Built-in Desk',
    design.addons.airConditioning && 'Air Conditioning (mini-split) — electrical plan pending (E-101)',
  ].filter(Boolean);
  if (!opts.length) { c += text(a.x + 40, y, 'NONE', 24); y += 38; }
  for (const o of opts) { c += text(a.x + 40, y, '· ' + o, 24); y += 38; }

  // Right column: row reference table.
  const rx = a.x + 1900;
  let ry = a.y + 80;
  c += text(rx, ry, 'PANEL ROW REFERENCE', 32, { weight: 'bold' });
  ry += 50;
  ['ROW', 'SILL', 'HEAD', 'POSITIONS'].forEach((h, i) => { c += text(rx + [0, 180, 400, 620][i], ry, h, 24, { weight: 'bold' }); });
  ry += 14; c += line(rx, ry, rx + 900, ry, LW.object); ry += 40;
  for (const [row, r] of Object.entries(geo.rows).sort()) {
    [row.toUpperCase(), fmtFtIn(r.sillIn), fmtFtIn(r.headIn), String(r.sectors)]
      .forEach((v, i) => { c += text(rx + [0, 180, 400, 620][i], ry, v, 24); });
    ry += 38;
  }
  ry += 40;
  c += text(rx, ry, 'ROW C UNITS ARE THE OPERABLE TYPE.', 22); ry += 32;
  c += text(rx, ry, 'ROW G/H CUSTOM GLAZING: STUDIO ONLY.', 22); ry += 32;
  wrap('Glass sizes are nominal per panel row; exact rough openings are set by the factory panel geometry.', 46)
    .forEach((lnTxt) => { c += text(rx, ry, lnTxt, 22); ry += 32; });

  return c;
}

function nominalGlass(geo, row, operable) {
  const match = geo.windowGlass.filter((g) => g.row === row && (g.variant === (operable ? 'operable' : 'fixed')));
  const pool = match.length ? match : geo.windowGlass.filter((g) => g.row === row);
  if (!pool.length) return null;
  return {
    widthIn: pool.reduce((t, g) => t + g.widthIn, 0) / pool.length,
    heightIn: pool.reduce((t, g) => t + g.heightIn, 0) / pool.length,
  };
}
