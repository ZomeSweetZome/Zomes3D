// Shared design/geometry interpretation for all sheet generators.
// A "design" comes from config-parse.js; "geo" is data/plans-geometry/*.json.

'use strict';

// Mirrors VIEWPORT_AND_STRIP_SECTORS in js/settings.js:369 (read-only copy —
// the /plans/ page must not boot the configurator; cross-ref comment there).
export const WINDOW_SETS = {
  pod: {
    viewport: { c: [7], d: [6, 7], e: [7] },
    strip: { c: [4], d: [4], e: [5], f: [6] },
  },
  office: {
    viewport: { c: [7], d: [6, 7], e: [7] },
    strip: { c: [4], d: [4], e: [5], f: [6] },
  },
  studio: {
    viewport: { c: [10], d: [9, 10], e: [10] },
    strip: { c: [7], d: [7], e: [8], f: [9], g: [10] },
  },
};

// Full ring size per row = highest sector index present in the model.
export function ringCount(geo) {
  return Math.max(...geo.panels.map((p) => p.sector));
}

// Azimuth of (row, sector), interpolated from known panels in that row —
// window/door positions may have no panel node of their own.
export function rowAzimuth(geo, row, sector) {
  const ring = ringCount(geo);
  const step = 360 / ring;
  const known = geo.panels.filter((p) => p.row === row);
  if (!known.length) return null;
  const ref = known[0];
  let az = ref.azimuthDeg + (sector - ref.sector) * step;
  while (az > 180) az -= 360;
  while (az <= -180) az += 360;
  return az;
}

export function panelAt(geo, row, sector) {
  return geo.panels.find((p) => p.row === row && p.sector === sector) ?? null;
}

// Resolves the configured windows into a flat, deduped list of
// { row, sector, kind: strip|viewport|custom, operable, smart }.
export function resolveWindows(design, geo) {
  const out = new Map();
  const add = (row, sector, kind) => {
    const key = `${row}-${sector}`;
    if (!out.has(key)) {
      out.set(key, {
        row, sector, kind,
        operable: row === 'c',                 // row-C units are the operable type
        smart: design.upgrades.smartGlass,     // upgrade applies set-wide
      });
    }
  };
  for (const kind of ['strip', 'viewport']) {
    if (!design.windows[kind]) continue;
    const set = WINDOW_SETS[design.model.key]?.[kind] ?? {};
    for (const [row, sectors] of Object.entries(set)) {
      for (const s of sectors) add(row, s, kind);
    }
  }
  if (design.windows.custom) {
    for (const [row, sectors] of Object.entries(design.customWindows)) {
      for (const s of sectors) add(row, s, 'custom');
    }
  }
  return [...out.values()];
}

// Door positions: main from geometry; extra door mirrors the main azimuth on
// pod/office (single door node in those GLBs), uses door-back on studio.
export function resolveDoors(design, geo) {
  const doors = [];
  const main = geo.doors.find((d) => d.type === 'main');
  if (main) doors.push({ type: 'main', ...doorFacts(main) });
  if (design.upgrades.extraDoor) {
    const back = geo.doors.find((d) => d.type === 'extra');
    if (back) doors.push({ type: 'extra', ...doorFacts(back) });
    else if (main) {
      const f = doorFacts(main);
      doors.push({ ...f, type: 'extra', azimuthDeg: normDeg(f.azimuthDeg + 180) });
    }
  }
  return doors;
}

function doorFacts(door) {
  const { min, max, size } = door.bbox;
  const cx = (min[0] + max[0]) / 2;
  const cz = (min[2] + max[2]) / 2;
  return {
    azimuthDeg: +(Math.atan2(cz, cx) * 180 / Math.PI).toFixed(2),
    widthIn: +Math.max(size[0], size[2]).toFixed(2),
    heightIn: size[1],
  };
}

export function normDeg(a) {
  while (a > 180) a -= 360;
  while (a <= -180) a += 360;
  return a;
}

export function angDist(a, b) {
  return Math.abs(normDeg(a - b));
}

// The four elevation views. Model convention: the main door faces +Z
// (azimuth +90°), which we call SOUTH (front). sx maps world → screen-right.
export const VIEWS = [
  { id: 'south', label: 'SOUTH ELEVATION (ENTRY)', azimuthDeg: 90, sx: (p) => p[0] },
  { id: 'east', label: 'EAST ELEVATION', azimuthDeg: 0, sx: (p) => -p[2] },
  { id: 'north', label: 'NORTH ELEVATION', azimuthDeg: -90, sx: (p) => -p[0] },
  { id: 'west', label: 'WEST ELEVATION', azimuthDeg: 180, sx: (p) => p[2] },
];

// Revolved profile for sections: (radiusIn, yIn) pairs from footprint base
// through each row boundary to the apex, sorted by height.
export function domeProfile(geo) {
  const baseR = Math.max(...geo.footprint.vertices.map(([x, z]) => Math.hypot(x, z)));
  const samples = [[baseR, 0]];
  const heights = new Set();
  for (const r of Object.values(geo.rows)) { heights.add(r.sillIn); heights.add(r.headIn); }
  for (const h of [...heights].sort((a, b) => a - b)) {
    let maxR = 0;
    for (const p of geo.panels) {
      for (const pt of p.outline) {
        if (Math.abs(pt[1] - h) < 2) maxR = Math.max(maxR, Math.hypot(pt[0], pt[2]));
      }
    }
    if (maxR > 0) samples.push([maxR, h]);
  }
  samples.push([0, geo.overall.heightIn]);
  return samples;
}

export const WALL_THICKNESS_IN = 4.5; // nominal panel thickness for plan/section poche
