// Sheet registry: builds the full Design Set for a parsed design + geometry.
// Each entry returns { number, name, content } — content is inner SVG for
// sheetSVG(). Extended as sheet generators land (ZOM-64/65/66/67/71).

'use strict';

import { sheetSVG, SCALE_LABEL } from './sheet.js';
import { titleBlockSVG, bareStripSVG } from './titleblock.js';
import { floorPlanSheet } from './floorplan.js';
import { elevationsSheet } from './elevations.js';
import { sectionSheet } from './section.js';
import { roofPlanSheet, foundationPlanSheet } from './roofplan.js';
import { coverSheet } from './cover.js';
import { schedulesSheet } from './schedules.js';

export function buildSheets(design, geo, { designName = '', configString = '' } = {}) {
  const date = new Date().toLocaleDateString('en-US');
  // Floor plan first: it assigns window marks reused by the schedule + cover.
  const fp = floorPlanSheet(design, geo);
  const ctx = { design, geo, designName, configString, windowMarks: fp.windowMarks, date };

  const defs = [
    { number: 'G-001', name: 'COVER SHEET', scale: 'AS NOTED', gen: () => coverSheet(ctx) },
    { number: 'A-101', name: 'FLOOR PLAN', scale: SCALE_LABEL, gen: () => fp.content },
    { number: 'A-102', name: 'ROOF PLAN', scale: SCALE_LABEL, gen: () => roofPlanSheet(ctx) },
    { number: 'A-103', name: 'FOUNDATION PLAN', scale: SCALE_LABEL, gen: () => foundationPlanSheet(ctx) },
    { number: 'A-201', name: 'ELEVATIONS SOUTH + EAST', scale: SCALE_LABEL, gen: () => elevationsSheet(ctx, ['south', 'east']) },
    { number: 'A-202', name: 'ELEVATIONS NORTH + WEST', scale: SCALE_LABEL, gen: () => elevationsSheet(ctx, ['north', 'west']) },
    { number: 'A-301', name: 'BUILDING SECTION', scale: SCALE_LABEL, gen: () => sectionSheet(ctx) },
    { number: 'A-601', name: 'SCHEDULES + NOTES', scale: 'N/A', gen: () => schedulesSheet(ctx) },
  ];
  ctx.sheetIndex = defs.map((d) => ({ number: d.number, name: d.name }));

  return defs.map((d) => {
    const meta = {
      number: d.number,
      name: d.name,
      model: `${design.model.name} — ${design.model.areaSqFt} SQ FT`,
      designName,
      configId: configString,
      date,
      scaleLabel: d.scale,
    };
    const content = d.gen();
    return {
      number: d.number,
      name: d.name,
      svg: sheetSVG(meta, content, { titleBlockSVG: titleBlockSVG(meta) }),
      bareSvg: sheetSVG(meta, content + bareStripSVG(meta), { bare: true }),
    };
  });
}
