// Dimension strings, ticks, and the graphic scale bar.
// All coordinates are sheet units (0.01"); callers convert real-world
// measurements via s() from sheet.js before dimensioning.

'use strict';

import { LW, line, text, UNITS_PER_FT, SCALE_LABEL } from './sheet.js';

// Formats real-world inches as feet-inches to the nearest 1/4":
// 90.5 -> 7'-6½"   6.25 -> 6¼"   144 -> 12'-0"
export function fmtFtIn(realInches) {
  const FRACTIONS = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' };
  let quarters = Math.round(realInches * 4) / 4;
  let ft = Math.floor(quarters / 12);
  let rem = quarters - ft * 12;
  const whole = Math.floor(rem);
  const frac = FRACTIONS[Math.round((rem - whole) * 4) / 4];
  const inStr = `${whole}${frac}"`;
  return ft > 0 ? `${ft}'-${inStr}` : inStr;
}

const TICK = 12;      // 45-degree architectural tick half-length
const EXT_GAP = 8;    // gap between object and extension-line start
const EXT_OVER = 12;  // extension line overshoot past the dim line
const TEXT_LIFT = 10; // text baseline above the dim line

function tick(x, y) {
  return line(x - TICK, y + TICK, x + TICK, y - TICK, LW.object);
}

// Horizontal dimension: measures x1..x2 along a dim line at y.
// yObj: where the measured object edge is (extension lines start near it).
export function hDim(x1, x2, y, label, yObj = null) {
  const from = yObj === null ? y - 40 : yObj + Math.sign(y - yObj) * EXT_GAP;
  const over = Math.sign(y - from) * EXT_OVER;
  let svg = '';
  svg += line(x1, from, x1, y + over, LW.hair);
  svg += line(x2, from, x2, y + over, LW.hair);
  svg += line(x1, y, x2, y, LW.hair);
  svg += tick(x1, y) + tick(x2, y);
  svg += text((x1 + x2) / 2, y - TEXT_LIFT, label, 26, { anchor: 'middle' });
  return svg;
}

// Vertical dimension: measures y1..y2 along a dim line at x. Text reads
// bottom-up (rotated -90), the drafting convention for vertical strings.
export function vDim(y1, y2, x, label, xObj = null) {
  const from = xObj === null ? x - 40 : xObj + Math.sign(x - xObj) * EXT_GAP;
  const over = Math.sign(x - from) * EXT_OVER;
  let svg = '';
  svg += line(from, y1, x + over, y1, LW.hair);
  svg += line(from, y2, x + over, y2, LW.hair);
  svg += line(x, y1, x, y2, LW.hair);
  svg += tick(x, y1) + tick(x, y2);
  svg += text(x - TEXT_LIFT, (y1 + y2) / 2, label, 26, { anchor: 'middle', rotate: -90 });
  return svg;
}

// Graphic scale bar at 1/2" = 1'-0": alternating filled 1-ft blocks 0..4 ft
// plus an open 4..8 ft run. Stays truthful on reduced-size prints.
export function scaleBar(x, y) {
  const h = 16;
  let svg = text(x, y - 14, `SCALE: ${SCALE_LABEL}`, 24, { weight: 'bold' });
  for (let ft = 0; ft < 4; ft++) {
    const fill = ft % 2 === 0 ? '#000' : 'none';
    svg += `<rect x="${x + ft * UNITS_PER_FT}" y="${y}" width="${UNITS_PER_FT}" height="${h}"` +
      ` fill="${fill}" stroke="#000" stroke-width="${LW.hair}"/>`;
  }
  svg += `<rect x="${x + 4 * UNITS_PER_FT}" y="${y}" width="${4 * UNITS_PER_FT}" height="${h}"` +
    ` fill="none" stroke="#000" stroke-width="${LW.hair}"/>`;
  for (const ft of [0, 1, 2, 3, 4, 8]) {
    svg += text(x + ft * UNITS_PER_FT, y + h + 26, String(ft), 22, { anchor: 'middle' });
  }
  svg += text(x + 8 * UNITS_PER_FT + 20, y + h + 26, 'FEET', 22);
  return svg;
}
