// A-101 Floor Plan. Cut plane ~4'-0" AFF: rows C/D glazing drawn solid,
// higher rows dashed (above cut plane, standard convention).

'use strict';

import { SHEET, LW, line, poly, text, s, drawingArea } from './sheet.js';
import { hDim, vDim, fmtFtIn, scaleBar } from './dims.js';
import { resolveWindows, resolveDoors, rowAzimuth, ringCount, normDeg, WALL_THICKNESS_IN } from './common.js';

export function floorPlanSheet(design, geo) {
  const a = drawingArea();
  // Center of the drawing area, leaving headroom for dims (top/left).
  const cx = a.x + a.w / 2 - 100;
  const cy = a.y + a.h / 2 - 40;

  const verts = geo.footprint.vertices; // inches, model XZ
  const X = (p) => cx + s(p[0]);
  const Y = (p) => cy + s(p[1]);

  let c = '';

  // Outer wall + inner face (uniform inward offset approximated by scaling
  // about the centroid — footprint is a near-regular polygon).
  const cen = verts.reduce((acc, v) => [acc[0] + v[0] / verts.length, acc[1] + v[1] / verts.length], [0, 0]);
  const meanR = verts.reduce((acc, v) => acc + Math.hypot(v[0] - cen[0], v[1] - cen[1]), 0) / verts.length;
  const k = Math.max(0, 1 - WALL_THICKNESS_IN / meanR);
  const inner = verts.map((v) => [cen[0] + (v[0] - cen[0]) * k, cen[1] + (v[1] - cen[1]) * k]);

  c += poly(verts.map((v) => [X([v[0], v[1]]), Y([v[0], v[1]])]), LW.cut);
  c += poly(inner.map((v) => [X([v[0], v[1]]), Y([v[0], v[1]])]), LW.cut);

  // Doors: opening jambs + leaf + 90° swing arc, at each door azimuth.
  for (const door of resolveDoors(design, geo)) {
    const az = door.azimuthDeg * Math.PI / 180;
    const dir = [Math.cos(az), Math.sin(az)];
    const tan = [-Math.sin(az), Math.cos(az)];
    const rOut = radiusAt(verts, cen, az) + 2;
    const rIn = rOut - WALL_THICKNESS_IN - 4;
    const hw = door.widthIn / 2;
    const jamb = (sign) => [
      [cen[0] + dir[0] * rIn + tan[0] * hw * sign, cen[1] + dir[1] * rIn + tan[1] * hw * sign],
      [cen[0] + dir[0] * rOut + tan[0] * hw * sign, cen[1] + dir[1] * rOut + tan[1] * hw * sign],
    ];
    // Mask the wall across the opening with a white quad, then jambs.
    const gap = [jamb(-1)[0], jamb(-1)[1], jamb(1)[1], jamb(1)[0]];
    c += poly(gap.map((v) => [X(v), Y(v)]), 0, { fill: '#fff' });
    for (const sign of [-1, 1]) {
      const [p1, p2] = jamb(sign);
      c += line(X(p1), Y(p1), X(p2), Y(p2), LW.cut);
    }
    // Leaf (from one jamb, opening inward) + quarter-circle swing arc.
    const hinge = jamb(-1)[0];
    const leafEnd = [hinge[0] - dir[0] * door.widthIn, hinge[1] - dir[1] * door.widthIn];
    c += line(X(hinge), Y(hinge), X(leafEnd), Y(leafEnd), LW.object);
    const a0 = Math.atan2(jamb(1)[0][1] - hinge[1], jamb(1)[0][0] - hinge[0]);
    const a1 = Math.atan2(leafEnd[1] - hinge[1], leafEnd[0] - hinge[0]);
    c += arcPath(X(hinge), Y(hinge), s(door.widthIn), a0, a1);
    c += text(X([cen[0] + dir[0] * (rOut + 24), cen[1] + dir[1] * (rOut + 24)]),
      Y([cen[0] + dir[0] * (rOut + 24), cen[1] + dir[1] * (rOut + 24)]) + 8,
      door.type === 'main' ? 'D1' : 'D2', 26, { anchor: 'middle', weight: 'bold' });
  }

  // Windows: glazing arcs on the wall at each unit's angular span.
  const ring = ringCount(geo);
  const half = (360 / ring / 2 - 2) * Math.PI / 180; // small gap between units
  let wMark = 0;
  const marks = [];
  for (const w of resolveWindows(design, geo).sort((p, q) => p.row.localeCompare(q.row) || p.sector - q.sector)) {
    const azDeg = rowAzimuth(geo, w.row, w.sector);
    if (azDeg === null) continue;
    const az = azDeg * Math.PI / 180;
    const rMid = radiusAt(verts, cen, az) - WALL_THICKNESS_IN / 2;
    const solid = w.row === 'c' || w.row === 'd'; // cut plane crosses C/D
    const dash = solid ? null : '14,10';
    c += arcPath(X(cen), Y(cen), s(rMid), az - half, az + half, solid ? LW.object : LW.thin, dash);
    c += arcPath(X(cen), Y(cen), s(rMid - 3), az - half, az + half, LW.hair, dash);
    wMark++;
    const lx = cen[0] + Math.cos(az) * (radiusAt(verts, cen, az) + 26);
    const ly = cen[1] + Math.sin(az) * (radiusAt(verts, cen, az) + 26);
    c += text(X([lx, ly]), Y([lx, ly]) + 8, `W${wMark}`, 22, { anchor: 'middle' });
    marks.push({ mark: `W${wMark}`, ...w });
  }

  // Overall dimensions.
  const xs = verts.map((v) => v[0]), zs = verts.map((v) => v[1]);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minZ, maxZ] = [Math.min(...zs), Math.max(...zs)];
  c += hDim(X([minX, 0]), X([maxX, 0]), Y([0, minZ]) - 80, fmtFtIn(maxX - minX), Y([0, minZ]));
  c += vDim(Y([0, minZ]), Y([0, maxZ]), X([minX, 0]) - 80, fmtFtIn(maxZ - minZ), X([minX, 0]));

  // Area table + notes.
  const tx = a.x + a.w - 560, ty = a.y + 60;
  c += text(tx, ty, 'FLOOR AREA', 26, { weight: 'bold' });
  c += text(tx, ty + 40, `${geo.footprint.areaSqFt} SQ FT (measured at base)`, 24);
  c += text(tx, ty + 74, `${design.model.name} — nominal ${design.model.areaSqFt} SQ FT`, 24);
  c += text(tx, ty + 108, `Openings above 4'-0" cut plane shown dashed`, 22);
  c += text(tx, ty + 136, design.foundationKit
    ? 'Foundation Replacement Kit: see A-103' : 'Base subfloor; foundation by others (A-103)', 22);

  // Plan-north arrow (site orientation is the owner's; entry faces "south"
  // by sheet convention).
  const nx = a.x + a.w - 120, ny = a.y + a.h - 200;
  c += line(nx, ny + 60, nx, ny, LW.object);
  c += poly([[nx - 12, ny + 18], [nx, ny], [nx + 12, ny + 18]], LW.object, { fill: '#000' });
  c += text(nx, ny + 96, 'PLAN N', 22, { anchor: 'middle' });

  c += scaleBar(a.x + 40, a.y + a.h - 90);
  c += text(cx, a.y + a.h - 90, 'FLOOR PLAN — CUT AT 4\'-0" AFF', 30, { anchor: 'middle', weight: 'bold' });

  return { content: c, windowMarks: marks };
}

function radiusAt(verts, cen, az) {
  // Distance from centroid to polygon boundary along direction az.
  const dir = [Math.cos(az), Math.sin(az)];
  let best = 0;
  for (let i = 0; i < verts.length; i++) {
    const p = verts[i], q = verts[(i + 1) % verts.length];
    const hit = raySegment(cen, dir, p, q);
    if (hit !== null) best = Math.max(best, hit);
  }
  return best;
}

function raySegment(o, d, p, q) {
  const vx = q[0] - p[0], vy = q[1] - p[1];
  const det = d[0] * -vy - d[1] * -vx;
  if (Math.abs(det) < 1e-9) return null;
  const t = ((p[0] - o[0]) * -vy - (p[1] - o[1]) * -vx) / det;
  const u = (d[0] * (p[1] - o[1]) - d[1] * (p[0] - o[0])) / -det;
  return t >= 0 && u >= -1e-9 && u <= 1 + 1e-9 ? t : null;
}

function arcPath(cx, cy, r, a0, a1, w = LW.object, dash = null) {
  while (a1 < a0) a1 += Math.PI * 2;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  return `<path d="M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${large} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="#000" stroke-width="${w}"${d}/>`;
}

export { arcPath, radiusAt };
