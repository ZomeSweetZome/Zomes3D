#!/usr/bin/env node
// Extracts architectural-set geometry from the three house GLBs into
// data/plans-geometry/{pod,office,studio}.json (ZOM-61).
//
// Zero dependencies: parses the GLB container + glTF node graph directly
// (no Draco in these files — verified). Deterministic: re-running on the
// same GLBs reproduces the JSON byte-identical, which is the regression
// guard for model updates.
//
// Math mirrors the exploratory browser tool plans/dev-extract.html. Units:
// GLB is meters (man mesh measures 68.99" ≈ 5'-9"); output is inches.
//
// Panel naming differs per model (same wire rows as the configurator's
// customWindows): office `panel-wall-c-1`, studio `panel-L1-C-1` (rows C–H,
// 12 sectors), pod `panel-L3-G-4`.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'data', 'plans-geometry');

const M_TO_IN = 39.3701;
const MODELS = [
  { key: 'pod',    file: 'zomes-pod2.glb',    nominalSqFt: 120 },
  { key: 'office', file: 'zomes-office2.glb', nominalSqFt: 170 },
  { key: 'studio', file: 'zomes-studio2.glb', nominalSqFt: 300 },
];
const PANEL_RE = /^panel-(?:wall|L\d)-([a-h])-(\d+)$/i;
// Trailing `.001` = Blender duplicate suffix: the row-C operable-window
// glass variants (cf. option_1-2_operable pricing in the configurator).
const GLASS_RE = /^(?:window-)?glass(?:-L\d)?-([a-h])-(\d+)(\.\d+)?$/i;

// ── GLB / glTF ──────────────────────────────────────────────────────────────

function parseGLB(buf) {
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB');
  let off = 12, json = null, bin = null;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off);
    const type = buf.readUInt32LE(off + 4);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8'));
    else if (type === 0x004e4942) bin = data;
    off += 8 + len;
  }
  if (!json || !bin) throw new Error('GLB missing JSON or BIN chunk');
  return { json, bin };
}

function readPositions(gltf, bin, accessorIdx) {
  const acc = gltf.accessors[accessorIdx];
  if (acc.componentType !== 5126 || acc.type !== 'VEC3') return [];
  const bv = gltf.bufferViews[acc.bufferView];
  const stride = bv.byteStride || 12;
  const base = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const out = new Array(acc.count);
  for (let i = 0; i < acc.count; i++) {
    const o = base + i * stride;
    out[i] = [bin.readFloatLE(o), bin.readFloatLE(o + 4), bin.readFloatLE(o + 8)];
  }
  return out;
}

// ── mat4 (column-major, glTF convention) ────────────────────────────────────

const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

function matMul(a, b) {
  const r = new Array(16);
  for (let c = 0; c < 4; c++) {
    for (let ro = 0; ro < 4; ro++) {
      r[c * 4 + ro] = a[ro] * b[c * 4] + a[4 + ro] * b[c * 4 + 1] + a[8 + ro] * b[c * 4 + 2] + a[12 + ro] * b[c * 4 + 3];
    }
  }
  return r;
}

function matFromTRS(t = [0, 0, 0], q = [0, 0, 0, 1], s = [1, 1, 1]) {
  const [x, y, z, w] = q;
  const [sx, sy, sz] = s;
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    t[0], t[1], t[2], 1,
  ];
}

function nodeLocal(node) {
  if (node.matrix) return node.matrix;
  return matFromTRS(node.translation, node.rotation, node.scale);
}

function applyMat(m, [x, y, z]) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

// Collects world-space vertices of every mesh in the subtree rooted at node i.
function subtreeVertices(gltf, bin, i, parentMat, out) {
  const node = gltf.nodes[i];
  const world = matMul(parentMat, nodeLocal(node));
  if (node.mesh !== undefined) {
    for (const prim of gltf.meshes[node.mesh].primitives) {
      if (prim.attributes?.POSITION === undefined) continue;
      for (const p of readPositions(gltf, bin, prim.attributes.POSITION)) {
        out.push(applyMat(world, p));
      }
    }
  }
  for (const c of node.children || []) subtreeVertices(gltf, bin, c, world, out);
}

// Walks the default scene, invoking cb(node, worldVertsGetter) per named node.
function walkNamed(gltf, bin, cb) {
  const visit = (i, parentMat) => {
    const node = gltf.nodes[i];
    const world = matMul(parentMat, nodeLocal(node));
    // three.js falls back to the mesh name when the node itself is unnamed —
    // the wide strip/viewport glass panes are named that way in these GLBs.
    const name = node.name || (node.mesh !== undefined ? gltf.meshes[node.mesh]?.name : '');
    if (name) {
      cb(name, () => {
        const out = [];
        subtreeVertices(gltf, bin, i, parentMat, out);
        return out;
      });
    }
    for (const c of node.children || []) visit(c, world);
  };
  for (const root of gltf.scenes[gltf.scene ?? 0].nodes) visit(root, IDENT);
}

// ── geometry helpers (ported from plans/dev-extract.html) ───────────────────

function hullIndices(pts) {
  const idx = pts.map((_, i) => i).sort((a, b) => pts[a][0] - pts[b][0] || pts[a][1] - pts[b][1]);
  const cross = (o, a, b) =>
    (pts[a][0] - pts[o][0]) * (pts[b][1] - pts[o][1]) - (pts[a][1] - pts[o][1]) * (pts[b][0] - pts[o][0]);
  const lower = [], upper = [];
  for (const i of idx) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], i) <= 0) lower.pop();
    lower.push(i);
  }
  for (const i of idx.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], i) <= 0) upper.pop();
    upper.push(i);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function polygonAreaM2(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

function outline3d(pts) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cz = pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const az0 = Math.atan2(cz, cx);
  const rMean = pts.reduce((s, p) => s + Math.hypot(p[0], p[2]), 0) / pts.length;
  const unrolled = pts.map((p) => {
    let dth = Math.atan2(p[2], p[0]) - az0;
    while (dth > Math.PI) dth -= 2 * Math.PI;
    while (dth < -Math.PI) dth += 2 * Math.PI;
    return [dth * rMean, p[1]];
  });
  const seen = new Map();
  for (let i = 0; i < unrolled.length; i++) {
    const k = `${Math.round(unrolled[i][0] * 200)},${Math.round(unrolled[i][1] * 200)}`;
    if (!seen.has(k)) seen.set(k, i);
  }
  const keep = [...seen.values()];
  let hull = hullIndices(keep.map((i) => unrolled[i]));
  const area3 = (a, b, c) => Math.abs(
    (unrolled[keep[b]][0] - unrolled[keep[a]][0]) * (unrolled[keep[c]][1] - unrolled[keep[a]][1]) -
    (unrolled[keep[c]][0] - unrolled[keep[a]][0]) * (unrolled[keep[b]][1] - unrolled[keep[a]][1])) / 2;
  let changed = true;
  while (changed || hull.length > 16) {
    changed = false;
    if (hull.length <= 4) break;
    let minA = Infinity, minI = -1;
    for (let i = 0; i < hull.length; i++) {
      const a = area3(hull[(i + hull.length - 1) % hull.length], hull[i], hull[(i + 1) % hull.length]);
      if (a < minA) { minA = a; minI = i; }
    }
    if (minA < 0.005 || hull.length > 16) { hull.splice(minI, 1); changed = minA < 0.005; }
  }
  return {
    azimuthDeg: +(az0 * 180 / Math.PI).toFixed(2),
    outline: hull.map((h) => pts[keep[h]].map((v) => +(v * M_TO_IN).toFixed(2))),
    yMinIn: +(Math.min(...pts.map((p) => p[1])) * M_TO_IN).toFixed(2),
    yMaxIn: +(Math.max(...pts.map((p) => p[1])) * M_TO_IN).toFixed(2),
  };
}

function bboxIn(pts) {
  const mins = [Infinity, Infinity, Infinity], maxs = [-Infinity, -Infinity, -Infinity];
  for (const p of pts) {
    for (let i = 0; i < 3; i++) {
      if (p[i] < mins[i]) mins[i] = p[i];
      if (p[i] > maxs[i]) maxs[i] = p[i];
    }
  }
  return {
    min: mins.map((v) => +(v * M_TO_IN).toFixed(2)),
    max: maxs.map((v) => +(v * M_TO_IN).toFixed(2)),
    size: maxs.map((v, i) => +((v - mins[i]) * M_TO_IN).toFixed(2)),
  };
}

// ── extraction ──────────────────────────────────────────────────────────────

async function extract(m) {
  const { json: gltf, bin } = parseGLB(await readFile(join(ROOT, 'src', 'models', m.file)));

  const panels = [], glass = [];
  const named = {};
  walkNamed(gltf, bin, (name, getVerts) => {
    const pm = name.match(PANEL_RE);
    if (pm) { panels.push({ row: pm[1].toLowerCase(), sector: +pm[2], getVerts }); return; }
    const gm = name.match(GLASS_RE);
    if (gm) { glass.push({ row: gm[1].toLowerCase(), sector: +gm[2], variant: gm[3] ? 'operable' : 'fixed', getVerts }); return; }
    if (['door', 'door-back', 'floor', 'foundation', 'man'].includes(name) && !named[name]) {
      named[name] = getVerts;
    }
  });

  let floorPts;
  let floorSource;
  if (named.floor) {
    floorPts = named.floor();
    floorSource = 'floor-mesh';
  } else {
    const all = panels.flatMap((p) => p.getVerts());
    const yMin = Math.min(...all.map((p) => p[1]));
    floorPts = all.filter((p) => p[1] < yMin + 0.15);
    floorSource = 'panel-base-hull';
  }
  const xz = floorPts.map((p) => [p[0], p[2]]);
  const fHull = hullIndices(xz).map((i) => xz[i]);
  const areaSqFt = polygonAreaM2(fHull) * 10.7639;

  const rows = {};
  const panelsOut = panels
    .map((p) => {
      const o = outline3d(p.getVerts());
      const r = rows[p.row] ??= { sillIn: Infinity, headIn: -Infinity, sectors: 0 };
      r.sillIn = Math.min(r.sillIn, o.yMinIn);
      r.headIn = Math.max(r.headIn, o.yMaxIn);
      r.sectors++;
      return { row: p.row, sector: p.sector, ...o };
    })
    .sort((a, b) => a.row.localeCompare(b.row) || a.sector - b.sector);
  const glassOut = glass
    .map((g) => {
      const bb = bboxIn(g.getVerts());
      return { row: g.row, sector: g.sector, variant: g.variant, widthIn: +Math.hypot(bb.size[0], bb.size[2]).toFixed(2), heightIn: bb.size[1] };
    })
    .sort((a, b) => a.row.localeCompare(b.row) || a.sector - b.sector || a.variant.localeCompare(b.variant));

  const allScenePts = [];
  for (const root of gltf.scenes[gltf.scene ?? 0].nodes) subtreeVertices(gltf, bin, root, IDENT, allScenePts);

  return {
    model: m.key,
    units: 'inches',
    verified: false,
    extractedFrom: m.file,
    scaleCalibration: {
      nominalAreaSqFt: m.nominalSqFt,
      measuredFloorAreaSqFt: +areaSqFt.toFixed(1),
      // Marketing sq ft does not match either interior or exterior geometry
      // consistently (office measures larger, studio smaller). The man mesh
      // (~5'-9") is the meters-scale check; area deviation is recorded for
      // the human verification round rather than gated.
      deviationFromNominal: +(areaSqFt / m.nominalSqFt - 1).toFixed(3),
      floorSource,
      manHeightIn: named.man ? bboxIn(named.man()).size[1] : null,
    },
    footprint: {
      vertices: fHull.map((p) => p.map((v) => +(v * M_TO_IN).toFixed(2))),
      areaSqFt: +areaSqFt.toFixed(1),
    },
    overall: (() => { const bb = bboxIn(allScenePts); return { widthIn: bb.size[0], heightIn: bb.size[1], depthIn: bb.size[2] }; })(),
    rows: Object.fromEntries(Object.entries(rows).sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, { sillIn: +v.sillIn.toFixed(2), headIn: +v.headIn.toFixed(2), sectors: v.sectors }])),
    panels: panelsOut,
    windowGlass: glassOut,
    doors: [
      named.door ? { type: 'main', bbox: bboxIn(named.door()) } : null,
      named['door-back'] ? { type: 'extra', bbox: bboxIn(named['door-back']()) } : null,
    ].filter(Boolean),
    foundation: named.foundation ? { bbox: bboxIn(named.foundation()) } : null,
  };
}

await mkdir(OUT_DIR, { recursive: true });
for (const m of MODELS) {
  const r = await extract(m);
  await writeFile(join(OUT_DIR, `${m.key}.json`), JSON.stringify(r, null, 1) + '\n');
  const c = r.scaleCalibration;
  console.log(
    `${m.key.padEnd(7)} panels=${r.panels.length} glass=${r.windowGlass.length} ` +
    `rows=${Object.keys(r.rows).join(',')} floor=${c.measuredFloorAreaSqFt}sqft (${c.floorSource}, ` +
    `${(c.deviationFromNominal * 100).toFixed(1)}% vs nominal ${c.nominalAreaSqFt}) ` +
    `man=${c.manHeightIn}in doors=${r.doors.length} foundation=${r.foundation ? 'yes' : 'no'}`,
  );
}
console.log('done');
