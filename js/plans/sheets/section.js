// A-301 Building Section: cut through the entry-door axis (world Z), looking
// west. Revolved profile from the geometry JSON; foundation kit variant.

'use strict';

import { LW, line, poly, text, s, drawingArea } from './sheet.js';
import { vDim, hDim, fmtFtIn, scaleBar } from './dims.js';
import { domeProfile, resolveDoors, WALL_THICKNESS_IN } from './common.js';

export function sectionSheet(ctx) {
  const { design, geo } = ctx;
  const a = drawingArea();
  const originX = a.x + a.w / 2 - 80;
  const groundY = a.y + a.h - 360;
  const foundationH = design.foundationKit ? (geo.foundation?.bbox.size[1] ?? 0) : 0;
  const lift = foundationH;
  let c = '';

  const profile = domeProfile(geo); // [radiusIn, yIn] ascending
  const outer = [
    ...profile.map(([r, y]) => [originX - s(r), groundY - s(y + lift)]),
    ...[...profile].reverse().map(([r, y]) => [originX + s(r), groundY - s(y + lift)]),
  ];
  c += poly(outer, LW.cut, { close: false });
  const innerProfile = profile.map(([r, y]) => [Math.max(0, r - WALL_THICKNESS_IN), y]);
  const inner = [
    ...innerProfile.map(([r, y]) => [originX - s(r), groundY - s(y + lift)]),
    ...[...innerProfile].reverse().map(([r, y]) => [originX + s(r), groundY - s(y + lift)]),
  ];
  c += poly(inner, LW.cut, { close: false });

  // Floor line + foundation.
  const baseR = profile[0][0];
  c += line(originX - s(baseR), groundY - s(lift), originX + s(baseR), groundY - s(lift), LW.cut);
  if (foundationH > 0) {
    c += poly([
      [originX - s(baseR), groundY], [originX - s(baseR), groundY - s(foundationH)],
      [originX + s(baseR), groundY - s(foundationH)], [originX + s(baseR), groundY],
    ], LW.cut);
    c += text(originX + s(baseR) + 30, groundY - s(foundationH / 2) + 8,
      `FOUNDATION KIT — ${fmtFtIn(foundationH)}`, 22);
  } else {
    c += text(originX + s(baseR) + 30, groundY - 12, 'BASE SUBFLOOR — FOUNDATION BY OTHERS', 22);
  }
  // Grade.
  c += line(a.x + 60, groundY, a.x + a.w - 60, groundY, LW.object);

  // Door cut (section passes through the entry): opening on the right side.
  const main = resolveDoors(design, geo).find((d) => d.type === 'main');
  if (main) {
    const doorX = originX + s(baseR - WALL_THICKNESS_IN);
    c += line(doorX, groundY - s(lift), doorX, groundY - s(lift + main.heightIn), LW.object);
    c += line(doorX - 30, groundY - s(lift + main.heightIn), doorX + 30, groundY - s(lift + main.heightIn), LW.object);
    c += text(doorX + 40, groundY - s(lift + main.heightIn) + 8, `DOOR HEAD ${fmtFtIn(main.heightIn)}`, 22);
  }

  // Human figure: simple scale reference at 5'-9".
  const manH = geo.scaleCalibration.manHeightIn ?? 69;
  const mx = originX - s(60), mh = s(manH);
  c += `<circle cx="${mx}" cy="${groundY - s(lift) - mh + s(4.5)}" r="${s(4.5)}" fill="none" stroke="#000" stroke-width="${LW.thin}"/>`;
  c += line(mx, groundY - s(lift) - mh + s(9), mx, groundY - s(lift) - mh * 0.35, LW.thin);
  c += line(mx - s(8), groundY - s(lift) - mh * 0.72, mx + s(8), groundY - s(lift) - mh * 0.72, LW.thin);
  c += line(mx, groundY - s(lift) - mh * 0.35, mx - s(7), groundY - s(lift), LW.thin);
  c += line(mx, groundY - s(lift) - mh * 0.35, mx + s(7), groundY - s(lift), LW.thin);

  // Dims: apex above grade, interior clear height, overall width.
  const apex = geo.overall.heightIn + lift;
  c += vDim(groundY - s(apex), groundY, originX - s(baseR) - 90, fmtFtIn(apex));
  c += hDim(originX - s(baseR), originX + s(baseR), groundY + 90, fmtFtIn(baseR * 2), groundY);

  // Row band ticks on the left.
  for (const [row, r] of Object.entries(ctx.geo.rows)) {
    const y = groundY - s(r.headIn + lift);
    c += line(originX - s(baseR) - 26, y, originX - s(baseR), y, LW.hair);
    c += text(originX - s(baseR) - 36, y + 8, row.toUpperCase(), 20, { anchor: 'end' });
  }

  // Assembly keynotes.
  const kx = a.x + a.w - 620, ky = a.y + 80;
  const notes = [
    'WALL ASSEMBLY (TYP):',
    '· Structural insulated zome panel, lapped joints',
    `· Exterior finish: ${design.exterior.name}`,
    `· Interior finish: ${design.interior.name}`,
    design.upgrades.extremeWeather ? '· Extreme Weather package' : null,
    design.addons.airConditioning ? '· Mini-split (see E-101, when available)' : null,
  ].filter(Boolean);
  notes.forEach((n, i) => { c += text(kx, ky + i * 36, n, i === 0 ? 26 : 24, i === 0 ? { weight: 'bold' } : {}); });

  c += text(originX, groundY + 170, 'BUILDING SECTION THROUGH ENTRY', 30, { anchor: 'middle', weight: 'bold' });
  c += scaleBar(a.x + 40, a.y + a.h - 90);
  return c;
}
