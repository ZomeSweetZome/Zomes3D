// /plans/ viewer bootstrap: parse config → load geometry → build sheets →
// sidebar + zoom/pan viewer + PDF downloads (full set and drawings-only).

'use strict';

import { parseConfigFromURL } from './config-parse.js';
import { buildSheets } from './sheets/index.js';
import { downloadSetPDF } from './pdf.js';

const $ = (id) => document.getElementById(id);

function track(event, params = {}) {
  try { window.gtag?.('event', event, params); } catch { /* analytics is best-effort */ }
}

function showError(title, detail) {
  $('loading').hidden = true;
  $('viewer').hidden = true;
  $('error').hidden = false;
  $('error_title').textContent = title;
  $('error_detail').textContent = detail;
}

async function boot() {
  const params = new URLSearchParams(location.search);
  const parsed = parseConfigFromURL(location.href);
  if (!parsed.ok) {
    const messages = {
      missing: 'This page needs a design to draw. Open your design in the Zomes configurator and click "Architectural Set".',
      malformed: 'This link does not contain a readable design code. Open your design in the configurator and click "Architectural Set" for a fresh link.',
      'unknown-model': 'This design code references a model this page does not know. Open the design in the configurator and try again.',
      'bad-url': 'This link could not be read. Open your design in the configurator and click "Architectural Set".',
    };
    track('arch_set_error', { reason: parsed.error });
    showError('No design to draw', messages[parsed.error] ?? parsed.message);
    return;
  }
  const design = parsed.design;

  let geo;
  try {
    const res = await fetch(`../data/plans-geometry/${design.model.key}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    geo = await res.json();
  } catch (err) {
    showError('Drawing data unavailable', `The geometry data for ${design.model.name} could not be loaded (${err.message}). Please try again in a minute.`);
    return;
  }

  const designName = params.get('dn') ?? '';
  const configString = params.get('config') ?? '';
  const sheets = buildSheets(design, geo, { designName, configString });

  // Header
  $('hdr_model').textContent = `${design.model.name} — ${design.model.areaSqFt} sq ft`;
  $('hdr_design').textContent = designName || '';
  if (!geo.verified) $('unverified_badge').hidden = false;

  // Sidebar thumbnails
  const list = $('sheet_list');
  sheets.forEach((sh, i) => {
    const btn = document.createElement('button');
    btn.className = 'sheet-thumb';
    btn.innerHTML = `<div class="sheet-thumb__svg">${sh.svg}</div>
      <div class="sheet-thumb__label"><b>${sh.number}</b> ${sh.name}</div>`;
    btn.addEventListener('click', () => select(i));
    list.appendChild(btn);
  });

  // Main pane with zoom/pan
  const pane = $('sheet_pane');
  const inner = $('sheet_inner');
  let zoom = 1;
  let current = 0;

  function select(i) {
    current = i;
    inner.innerHTML = sheets[i].svg;
    [...list.children].forEach((el, j) => el.classList.toggle('active', j === i));
    zoom = 1;
    applyZoom();
    pane.scrollTo(0, 0);
    $('hdr_sheet').textContent = `${sheets[i].number} — ${sheets[i].name}`;
  }
  function applyZoom() {
    inner.style.width = `${zoom * 100}%`;
  }
  $('zoom_in').addEventListener('click', () => { zoom = Math.min(6, zoom * 1.4); applyZoom(); });
  $('zoom_out').addEventListener('click', () => { zoom = Math.max(1, zoom / 1.4); applyZoom(); });
  $('zoom_fit').addEventListener('click', () => { zoom = 1; applyZoom(); });
  $('prev_sheet').addEventListener('click', () => select((current + sheets.length - 1) % sheets.length));
  $('next_sheet').addEventListener('click', () => select((current + 1) % sheets.length));

  // Drag to pan (scrolls the pane).
  let drag = null;
  pane.addEventListener('mousedown', (e) => { drag = { x: e.clientX, y: e.clientY, sx: pane.scrollLeft, sy: pane.scrollTop }; });
  window.addEventListener('mousemove', (e) => {
    if (!drag) return;
    pane.scrollLeft = drag.sx - (e.clientX - drag.x);
    pane.scrollTop = drag.sy - (e.clientY - drag.y);
  });
  window.addEventListener('mouseup', () => { drag = null; });

  // Downloads
  async function download(variant, btn) {
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Generating…';
    try {
      const name = await downloadSetPDF(sheets, { variant, modelKey: design.model.key, designName });
      track('arch_set_pdf_downloaded', { variant, model: design.model.key, file: name });
    } catch (err) {
      alert(`PDF generation failed: ${err.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }
  $('dl_full').addEventListener('click', (e) => download('full', e.currentTarget));
  $('dl_bare').addEventListener('click', (e) => download('bare', e.currentTarget));

  $('loading').hidden = true;
  $('viewer').hidden = false;
  select(0);
  window.__SHEETS = sheets; // QA hook (docs/plans/archset-qa-fixtures.md checks)
  track('arch_set_viewed', { model: design.model.key, sheets: sheets.length });
  console.log('PLANS_READY ' + JSON.stringify({ model: design.model.key, sheets: sheets.length }));
}

boot().catch((err) => {
  showError('Something went wrong', err.message);
  console.log('PLANS_FATAL ' + err.message);
});
