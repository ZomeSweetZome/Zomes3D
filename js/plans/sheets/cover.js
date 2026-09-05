// G-001 Cover Sheet: project data, sheet index, symbols legend, general
// notes, disclaimer, footprint key plan.

'use strict';

import { LW, line, poly, text, s, wrap, drawingArea } from './sheet.js';
import { DISCLAIMER } from './titleblock.js';
import { resolveWindows, resolveDoors } from './common.js';

const GENERAL_NOTES = [
  'This Design Set describes a factory-built Zomes structure as configured by the purchaser at design.zomes.com.',
  'All dimensions are nominal manufacturer geometry. Verify all dimensions and site conditions before any site work.',
  'Structure is engineered for 140 MPH wind and regional snow loads; engineered documentation available from Zomes.',
  'Site plan, utility connections, permits, and code compliance are the responsibility of the owner.',
  'Panel rows are lettered A (base) through H (apex, model-dependent); sectors numbered clockwise from the entry axis.',
  'Glazed panels are factory-installed; row C units are operable (awning). See schedule, sheet A-601.',
];

export function coverSheet(ctx) {
  const { design, geo, designName, configString, sheetIndex, date } = ctx;
  const a = drawingArea();
  let c = '';

  // Header
  c += text(a.x + 60, a.y + 130, 'ZOMES DESIGN SET', 92, { weight: 'bold' });
  c += text(a.x + 60, a.y + 200, `${design.model.name} — ${design.model.areaSqFt} SQ FT NOMINAL`, 44);
  if (designName) c += text(a.x + 60, a.y + 256, `"${designName}"`, 34);
  c += line(a.x + 60, a.y + 290, a.x + a.w - 60, a.y + 290, LW.object);

  // Project data block
  const px = a.x + 60;
  let py = a.y + 360;
  const windows = resolveWindows(design, geo);
  const doors = resolveDoors(design, geo);
  const rowsData = [
    ['MODEL', `${design.model.name} (${design.model.areaSqFt} sq ft nominal, ${geo.footprint.areaSqFt} sq ft measured at base)`],
    ['DATE GENERATED', date],
    ['EXTERIOR / INTERIOR', `${design.exterior.name} / ${design.interior.name}`],
    ['GLAZED PANELS', windows.length ? `${windows.length} (${design.windows.strip ? 'Strip ' : ''}${design.windows.viewport ? 'ViewPort ' : ''}${design.windows.custom ? 'Custom' : ''})`.trim() : 'None'],
    ['DOORS', doors.map((d) => `${d.type} ${Math.round(d.widthIn)}"×${Math.round(d.heightIn)}"`).join(', ')],
    ['FOUNDATION', design.foundationKit ? 'Foundation Replacement Kit' : 'Base subfloor (foundation by others)'],
    ['UPGRADES', [design.upgrades.smartGlass && 'Insulated Smart Glass', design.upgrades.extremeWeather && 'Extreme Weather', design.upgrades.extraDoor && 'Extra Door'].filter(Boolean).join(', ') || 'None'],
    ['ADD-ONS', [design.addons.desk && 'Built-in Desk', design.addons.airConditioning && 'Air Conditioning'].filter(Boolean).join(', ') || 'None'],
    ['DESIGN CODE', configString || '(none)'],
  ];
  c += text(px, py - 44, 'PROJECT DATA', 30, { weight: 'bold' });
  for (const [k, v] of rowsData) {
    c += text(px, py, k, 24, { weight: 'bold' });
    wrap(String(v), 60).slice(0, 2).forEach((lnTxt, i) => { c += text(px + 460, py + i * 30, lnTxt, 24); });
    py += Math.max(40, 30 * Math.min(2, wrap(String(v), 60).length) + 10);
  }

  // Sheet index
  const ix = a.x + 60;
  let iy = py + 60;
  c += text(ix, iy - 40, 'SHEET INDEX', 30, { weight: 'bold' });
  for (const sh of sheetIndex) {
    c += text(ix, iy, sh.number, 24, { weight: 'bold' });
    c += text(ix + 180, iy, sh.name, 24);
    iy += 36;
  }

  // Key plan: footprint mini-map, entry marked.
  const kx = a.x + a.w - 800, ky = a.y + 520;
  const scaleK = 0.45;
  c += poly(geo.footprint.vertices.map(([x, z]) => [kx + s(x) * scaleK, ky + s(z) * scaleK]), LW.object);
  c += text(kx, ky + s(geo.footprint.vertices.reduce((m, v) => Math.max(m, v[1]), 0)) * scaleK + 44,
    'KEY PLAN — ENTRY FACES SHEET-SOUTH', 22, { anchor: 'middle' });
  c += text(kx, ky + s(105) * scaleK, '▼ ENTRY', 22, { anchor: 'middle' });

  // Symbols legend
  const lx = a.x + a.w - 800, ly = a.y + 900;
  c += text(lx - 200, ly - 40, 'SYMBOLS', 30, { weight: 'bold' });
  c += line(lx - 200, ly, lx - 60, ly, LW.cut); c += text(lx - 30, ly + 8, 'CUT / WALL', 22);
  c += line(lx - 200, ly + 40, lx - 60, ly + 40, LW.object); c += text(lx - 30, ly + 48, 'VISIBLE EDGE', 22);
  c += line(lx - 200, ly + 80, lx - 60, ly + 80, LW.thin); c += text(lx - 30, ly + 88, 'PANEL SEAM', 22);
  c += line(lx - 200, ly + 120, lx - 60, ly + 120, LW.thin, '14,10'); c += text(lx - 30, ly + 128, 'ABOVE CUT PLANE / GLAZED', 22);
  c += text(lx - 200, ly + 170, 'W# WINDOW MARK    D# DOOR MARK    SG SMART GLASS', 22);

  // General notes
  const gx = a.x + a.w - 800, gy = a.y + 1160;
  c += text(gx - 200, gy - 40, 'GENERAL NOTES', 30, { weight: 'bold' });
  let ny = gy;
  GENERAL_NOTES.forEach((n, i) => {
    const lines = wrap(`${i + 1}. ${n}`, 62);
    lines.forEach((lnTxt) => { c += text(gx - 200, ny, lnTxt, 22); ny += 30; });
    ny += 8;
  });

  // Big disclaimer band
  const dy = a.y + a.h - 200;
  c += poly([[a.x + 40, dy - 50], [a.x + a.w - 40, dy - 50], [a.x + a.w - 40, dy + 130], [a.x + 40, dy + 130]], LW.object);
  c += text(a.x + 60, dy, 'PRELIMINARY DESIGN — NOT FOR CONSTRUCTION', 34, { weight: 'bold' });
  wrap(DISCLAIMER.replace('PRELIMINARY DESIGN — NOT FOR CONSTRUCTION. ', ''), 130).slice(0, 3)
    .forEach((lnTxt, i) => { c += text(a.x + 60, dy + 40 + i * 30, lnTxt, 22); });

  return c;
}
