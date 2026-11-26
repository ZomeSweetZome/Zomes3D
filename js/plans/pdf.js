// PDF assembly for the Design Set: one ARCH D (24"x36" landscape) page per
// sheet SVG. pdfmake + vfs are loaded globally by plans/index.html exactly
// like the main configurator does (spike: ZOM-60 — 6 pages in ~120ms).

'use strict';

const PAGE = { width: 2592, height: 1728 }; // 36in x 24in at 72pt/in

function ensureFonts() {
  /* global pdfMake */
  pdfMake.fonts = {
    SourceSansPro: {
      normal: 'SourceSansPro-Regular.ttf',
      bold: 'SourceSansPro-Bold.ttf',
      italics: 'SourceSansPro-Italic.ttf',
      bolditalics: 'SourceSansPro-BoldItalic.ttf',
    },
  };
}

// sheets: [{ number, name, svg, bareSvg }]; variant: 'full' | 'bare'.
export function downloadSetPDF(sheets, { variant = 'full', modelKey = 'zome', designName = '' } = {}) {
  ensureFonts();
  const doc = {
    pageSize: PAGE,
    pageMargins: [0, 0, 0, 0],
    defaultStyle: { font: 'SourceSansPro' },
    info: {
      title: `Zomes Design Set — ${modelKey}${designName ? ` — ${designName}` : ''}`,
      author: 'Zomes Designer (design.zomes.com)',
      subject: 'PRELIMINARY DESIGN — NOT FOR CONSTRUCTION',
    },
    content: sheets.map((sh, i) => ({
      svg: variant === 'bare' ? sh.bareSvg : sh.svg,
      width: PAGE.width,
      height: PAGE.height,
      pageBreak: i < sheets.length - 1 ? 'after' : undefined,
    })),
  };
  const stamp = new Date().toISOString().slice(0, 10);
  const name = variant === 'bare'
    ? `zomes-${modelKey}-drawings-only-${stamp}.pdf`
    : `zomes-${modelKey}-design-set-${stamp}.pdf`;
  return new Promise((resolve, reject) => {
    try {
      /* global pdfMake */
      pdfMake.createPdf(doc).download(name, () => resolve(name));
    } catch (err) {
      reject(err);
    }
  });
}
