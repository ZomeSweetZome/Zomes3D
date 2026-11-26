// Sheet scaffold for the Zomes Design Set. ARCH D 24"x36" landscape.
// Coordinate system: viewBox 3600x2400, 1 unit = 0.01" on the printed sheet.
// Rendered SVG carries width/height in pt (2592x1728) so pdfmake places it
// full-page at exact scale.
//
// All strokes use explicit stroke-width attributes (never CSS classes):
// svg-to-pdfkit's stylesheet support is unreliable, and explicit attributes
// keep browser and PDF output identical.

'use strict';

export const SHEET = {
  W: 3600,          // 36.00"
  H: 2400,          // 24.00"
  MARGIN: 50,       // 0.5" border all around
  TB_W: 420,        // title block width (4.2")
  PT_W: 2592,       // 36in * 72pt
  PT_H: 1728,       // 24in * 72pt
};

// Architectural line-weight ladder (units = 0.01", so 2.8 = 0.028" pen).
export const LW = {
  cut: 2.8,      // walls cut in plan/section
  object: 1.4,   // visible edges, silhouettes
  thin: 0.7,     // panel seams, minor edges
  hair: 0.35,    // dimension/extension lines, hatches
};

// Drawing scale 1/2" = 1'-0": one real foot = 0.5 sheet-inch = 50 units.
export const UNITS_PER_FT = 50;
export const UNITS_PER_IN = UNITS_PER_FT / 12;
export const SCALE_LABEL = `1/2" = 1'-0"`;

// Real-world inches -> sheet units at drawing scale.
export function s(realInches) {
  return realInches * UNITS_PER_IN;
}

export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function line(x1, y1, x2, y2, w = LW.thin, dash = null) {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="#000" stroke-width="${w}"${d}/>`;
}

export function poly(points, w = LW.object, { close = true, fill = 'none', dash = null } = {}) {
  const pts = points.map((p) => `${r1(p[0])},${r1(p[1])}`).join(' ');
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const tag = close ? 'polygon' : 'polyline';
  return `<${tag} points="${pts}" fill="${fill}" stroke="#000" stroke-width="${w}"${d}/>`;
}

// anchor: start | middle | end. weight: normal | bold. rotate: degrees about (x,y).
export function text(x, y, str, size = 28, { anchor = 'start', weight = 'normal', rotate = 0 } = {}) {
  const rot = rotate ? ` transform="rotate(${rotate} ${r1(x)} ${r1(y)})"` : '';
  const w = weight === 'bold' ? ' font-weight="bold"' : '';
  return `<text x="${r1(x)}" y="${r1(y)}" font-family="SourceSansPro" font-size="${size}"` +
    ` text-anchor="${anchor}"${w}${rot}>${esc(str)}</text>`;
}

// Greedy word-wrap for SVG (no native wrapping). Returns array of lines.
export function wrap(str, maxChars) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const word of words) {
    if (cur && (cur.length + 1 + word.length) > maxChars) { lines.push(cur); cur = word; }
    else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) lines.push(cur);
  return lines;
}

function r1(n) { return Math.round(n * 10) / 10; }

// Usable drawing area (inside border, left of title block).
export function drawingArea(bare = false) {
  const { W, H, MARGIN, TB_W } = SHEET;
  return {
    x: MARGIN,
    y: MARGIN,
    w: W - 2 * MARGIN - (bare ? 0 : TB_W),
    h: H - 2 * MARGIN,
  };
}

// Wraps rendered content in the full sheet SVG. `meta` feeds the title block;
// `bare: true` renders the drawings-only variant (slim disclaimer strip
// instead of the block — ZOM-74).
export function sheetSVG(meta, contentSVG, { titleBlockSVG = '', bare = false } = {}) {
  const { W, H, MARGIN, PT_W, PT_H } = SHEET;
  const border = `<rect x="${MARGIN}" y="${MARGIN}" width="${W - 2 * MARGIN}" height="${H - 2 * MARGIN}"` +
    ` fill="none" stroke="#000" stroke-width="${LW.object}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PT_W}" height="${PT_H}" viewBox="0 0 ${W} ${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>` +
    border + contentSVG + (bare ? '' : titleBlockSVG) +
    `</svg>`;
}
