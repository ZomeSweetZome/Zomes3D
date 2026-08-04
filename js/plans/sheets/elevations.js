// A-201 / A-202 Exterior Elevations: true orthographic projections of the
// panel outlines. Two views per sheet, stacked left/right.

'use strict';

import { LW, line, poly, text, s, drawingArea } from './sheet.js';
import { vDim, fmtFtIn, scaleBar } from './dims.js';
import { VIEWS, resolveWindows, resolveDoors, panelAt, rowAzimuth, angDist, domeProfile } from './common.js';

export function elevationsSheet(ctx, viewIds) {
  const { design, geo } = ctx;
  const a = drawingArea();
  let c = '';
  viewIds.forEach((id, i) => {
    const view = VIEWS.find((v) => v.id === id);
    const originX = a.x + (i + 0.5) * (a.w / 2) - 60;
    const groundY = a.y + a.h - 320;
    c += drawElevation(design, geo, view, originX, groundY, i === 0);
  });
  c += scaleBar(a.x + 40, a.y + a.h - 90);
  return c;
}

function drawElevation(design, geo, view, originX, groundY, withDims) {
  let c = '';
  const foundationH = design.foundationKit ? (geo.foundation?.bbox.size[1] ?? 0) : 0;
  // Sheet coords: X = originX + s(view.sx(p)), Y = groundY - s(p.y + foundationH lift)
  const px = (p) => originX + s(view.sx(p));
  const py = (p) => groundY - s(p[1] + foundationH);

  // Full silhouette from the revolved profile — the named panels only start
  // at row C (~23" up) and stop below the apex cap, so without this the
  // dome floats above grade and loses its point.
  const profile = domeProfile(geo);
  const sil = [
    ...profile.map(([r, y]) => [originX - s(r), groundY - s(y + foundationH)]),
    ...[...profile].reverse().map(([r, y]) => [originX + s(r), groundY - s(y + foundationH)]),
  ];
  c += poly(sil, LW.object, { fill: '#fff', close: true });

  // Front-facing panels, back to front so nearer seams overdraw cleanly.
  const visible = geo.panels
    .filter((p) => angDist(p.azimuthDeg, view.azimuthDeg) < 88)
    .sort((p, q) => angDist(q.azimuthDeg, view.azimuthDeg) - angDist(p.azimuthDeg, view.azimuthDeg));
  for (const p of visible) {
    c += poly(p.outline.map((pt) => [px(pt), py(pt)]), LW.thin, { fill: '#fff' });
  }

  // Configured windows on their host panel outlines: heavier line, glazing
  // diagonals, tag. Operable row-C units get the hinge-side chevron.
  for (const w of resolveWindows(design, geo)) {
    const az = rowAzimuth(geo, w.row, w.sector);
    if (az === null || angDist(az, view.azimuthDeg) >= 80) continue;
    const host = panelAt(geo, w.row, w.sector);
    if (!host) continue;
    const pts = host.outline.map((pt) => [px(pt), py(pt)]);
    c += poly(pts, LW.object, { fill: '#fff' });
    const cx = pts.reduce((t, p) => t + p[0] / pts.length, 0);
    const cy = pts.reduce((t, p) => t + p[1] / pts.length, 0);
    const r = Math.min(...pts.map(([x, y]) => Math.hypot(x - cx, y - cy))) * 0.55;
    c += line(cx - r, cy + r, cx + r, cy - r, LW.hair);
    if (w.operable) {
      // Awning convention: dashed chevron pointing at the hinge (head).
      const top = pts.reduce((m, p) => (p[1] < m[1] ? p : m));
      c += line(cx - r * 0.8, cy + r * 0.6, top[0], top[1], LW.hair, '10,8');
      c += line(cx + r * 0.8, cy + r * 0.6, top[0], top[1], LW.hair, '10,8');
    }
    if (w.smart) c += text(cx, cy + r + 26, 'SG', 20, { anchor: 'middle' });
  }

  // Doors in this view: project the door's 3D shell position; width
  // foreshortens with the off-axis angle like everything else.
  for (const door of resolveDoors(design, geo)) {
    const off = angDist(door.azimuthDeg, view.azimuthDeg);
    if (off >= 75) continue;
    const az = door.azimuthDeg * Math.PI / 180;
    const R = Math.max(...geo.footprint.vertices.map(([x, z]) => Math.hypot(x, z)));
    const xC = px([Math.cos(az) * R, 0, Math.sin(az) * R]);
    const wEff = door.widthIn * Math.max(0.15, Math.cos(off * Math.PI / 180));
    const x0 = xC - s(wEff / 2), x1 = xC + s(wEff / 2);
    const yTop = groundY - s(door.heightIn + foundationH);
    const yBot = groundY - s(foundationH);
    c += poly([[x0, yBot], [x0, yTop], [x1, yTop], [x1, yBot]], LW.object, { fill: '#fff' });
    c += line(x0 + 14, yBot - 10, x0 + 14, yTop + 10, LW.hair);
    c += text(xC, yBot + 30, door.type === 'main' ? 'D1' : 'D2', 24, { anchor: 'middle', weight: 'bold' });
  }

  // Foundation band + grade line.
  if (foundationH > 0) {
    const halfW = s(geo.overall.widthIn / 2 - 20);
    c += poly([[originX - halfW, groundY], [originX - halfW, groundY - s(foundationH)],
      [originX + halfW, groundY - s(foundationH)], [originX + halfW, groundY]], LW.object, { close: false });
  }
  c += line(originX - s(geo.overall.widthIn / 2) - 60, groundY, originX + s(geo.overall.widthIn / 2) + 60, groundY, LW.cut);

  // Dims (left view only): apex + door head height above grade.
  if (withDims) {
    const apex = geo.overall.heightIn + foundationH;
    const xd = originX - s(geo.overall.widthIn / 2) - 70;
    c += vDim(groundY - s(apex), groundY, xd, fmtFtIn(apex));
  }

  c += text(originX, groundY + 70, view.label, 30, { anchor: 'middle', weight: 'bold' });
  c += text(originX, groundY + 106,
    `EXTERIOR: ${design.exterior.name.toUpperCase()}`, 22, { anchor: 'middle' });
  return c;
}
