// Title block for the Zomes Design Set (right edge, full height) and the
// slim disclaimer strip used by the drawings-only export.

'use strict';

import { SHEET, LW, line, text, wrap, esc } from './sheet.js';

export const DISCLAIMER =
  'PRELIMINARY DESIGN — NOT FOR CONSTRUCTION. Generated from a Zomes ' +
  'Designer configuration for planning and reference only. This is not a ' +
  'construction document, has not been prepared or reviewed by a licensed ' +
  'architect or engineer, and is not approved for permit submission. ' +
  'Dimensions are nominal; verify all conditions on site. Engineered ' +
  'documentation is available from Zomes: hello@zomes.com.';

// meta: { number, name, model, designName, configId, date, scaleLabel }
export function titleBlockSVG(meta) {
  const { W, H, MARGIN, TB_W } = SHEET;
  const x0 = W - MARGIN - TB_W;
  const x1 = W - MARGIN;
  const cx = x0 + TB_W / 2;
  const pad = 24;
  let svg = line(x0, MARGIN, x0, H - MARGIN, LW.object);

  // Section dividers, top to bottom (sheet units from top border).
  const rows = {
    brandB: MARGIN + 220,
    projectB: MARGIN + 480,
    metaB: MARGIN + 680,
    disclaimerB: H - MARGIN - 560,
    nameB: H - MARGIN - 300,
  };
  for (const y of Object.values(rows)) svg += line(x0, y, x1, y, LW.thin);

  // Brand
  svg += text(cx, MARGIN + 130, 'ZOMES', 84, { anchor: 'middle', weight: 'bold' });
  svg += text(cx, MARGIN + 180, 'design.zomes.com', 26, { anchor: 'middle' });

  // Project
  svg += text(x0 + pad, rows.brandB + 50, 'PROJECT', 22);
  const model = wrap(meta.model, 22).slice(0, 2);
  model.forEach((ln, i) => { svg += text(x0 + pad, rows.brandB + 100 + i * 40, ln, 32, { weight: 'bold' }); });
  const dn = wrap(meta.designName || 'Untitled design', 28).slice(0, 2);
  dn.forEach((ln, i) => { svg += text(x0 + pad, rows.brandB + 190 + i * 38, ln, 28); });

  // Meta
  svg += text(x0 + pad, rows.projectB + 50, `DATE: ${meta.date}`, 26);
  svg += text(x0 + pad, rows.projectB + 95, `SCALE: ${meta.scaleLabel}`, 26);
  const cfg = meta.configId.length > 24 ? meta.configId.slice(0, 24) + '…' : meta.configId;
  svg += text(x0 + pad, rows.projectB + 140, `DESIGN CODE: ${cfg}`, 22);

  // Disclaimer (fills the flexible middle band, anchored to its bottom)
  const lines = wrap(DISCLAIMER, 34);
  const lineH = 30;
  let dy = rows.disclaimerB - lines.length * lineH - 16;
  svg += text(x0 + pad, dy, 'NOTICE', 22, { weight: 'bold' });
  lines.forEach((ln, i) => { svg += text(x0 + pad, dy + 36 + i * lineH, ln, 22); });

  // Sheet name + number
  const nm = wrap(meta.name, 17).slice(0, 3);
  nm.forEach((ln, i) => { svg += text(cx, rows.disclaimerB + 80 + i * 48, ln, 38, { anchor: 'middle', weight: 'bold' }); });
  svg += text(cx, H - MARGIN - 90, meta.number, 120, { anchor: 'middle', weight: 'bold' });
  return svg;
}

// Drawings-only variant: slim strip along the bottom so exported drawings
// stay usable in third-party title blocks but are never unlabeled.
export function bareStripSVG(meta) {
  const { W, H, MARGIN } = SHEET;
  const y = H - MARGIN - 44;
  let svg = line(MARGIN, y, W - MARGIN, y, LW.thin);
  svg += text(MARGIN + 16, y + 32,
    `ZOMES — ${meta.model} — ${meta.name} — ${meta.date} — ${DISCLAIMER}`.slice(0, 300), 18);
  return svg;
}
