// Standalone read-only parser for the configurator's ?config= string.
//
// IMPORTANT: this module deliberately duplicates the wire-format knowledge in
// js/3d-configurator.js (SharedParameterList at :209, ReadURLParameters at
// :2781, GetSharedArrayValues, convertArrayToObject) WITHOUT importing any of
// it — that file is DOM/jQuery-coupled and boots the whole configurator. If
// the config format ever changes there, change it here too, and re-run the
// fixtures in docs/plans/archset-qa-fixtures.md. See the mirror comment next
// to SharedParameterList.
//
// Wire format: the `config` query param is a concatenation of
// `<letter><value>` runs in a FIXED order; values of array params are
// dash-joined. The configurator parses positionally: split on the regex
// M|A|R|E|V|O|U|u|a|q|r|D and take parts[i+1] for the i-th parameter. We
// mirror that exactly, including the two forgiving behaviors: short strings
// keep trailing defaults, and garbage ints keep the default (NaN guard).
//
// This module is pure (no DOM, no fetch) and runs in both browser and Node.

'use strict';

// Order matters — mirrors SharedParameterList exactly.
const PARAMS = [
  { key: 'model',         letter: 'M', type: 'string', def: '0' },
  { key: 'windows',       letter: 'A', type: 'array',  def: ['0', '0', '0'] },
  { key: 'interior',      letter: 'R', type: 'string', def: '0' },
  { key: 'exterior',      letter: 'E', type: 'string', def: '0' },
  { key: 'upgrades',      letter: 'V', type: 'array',  def: ['0', '0', '0'] },
  { key: 'addons',        letter: 'O', type: 'array',  def: ['0', '0'] },
  { key: 'foundation',    letter: 'U', type: 'string', def: '0' },
  { key: 'language',      letter: 'u', type: 'string', def: '0' },
  { key: 'currency',      letter: 'a', type: 'string', def: '0' },
  { key: 'customWindows', letter: 'q', type: 'array',  def: ['c', 'd', 'e', 'f', 'g'] },
  { key: 'qr',            letter: 'r', type: 'int',    def: 0 },
  { key: 'discount',      letter: 'D', type: 'string', def: '0' },
];

const SPLIT_RE = new RegExp(PARAMS.map((p) => p.letter).join('|'));

export const MODELS = {
  '0': { key: 'pod',    name: 'ZomePod',    areaSqFt: 120 },
  '1': { key: 'office', name: 'ZomeOffice', areaSqFt: 170 },
  '2': { key: 'studio', name: 'ZomeStudio', areaSqFt: 300 },
};

export const INTERIORS = { '0': 'Magnesium Oxide Panels', '1': 'Wood Paneling', '2': 'Sound Panels' };
export const EXTERIORS = { '0': 'Dark Grey', '1': 'White' };

// Upgrades array positions follow OPTIONS_ID_ORDER_FOR_UPGRADES = ['5','0','3']
// (js/settings.js:76); addons follow OPTIONS_ID_ORDER_FOR_ADDONS = ['1','4'].
const CUSTOM_WINDOW_ROWS = ['c', 'd', 'e', 'f', 'g'];

// Applies the same one-shot legacy migration as migrateOldConfigURL
// (js/3d-configurator.js:2758): pre-U URLs carried foundation as the first
// addons slot. Returns the input unchanged when already current-format.
export function migrateLegacyConfig(config) {
  if (!config || config.includes('U')) return config;
  return config.replace(/O(\d+)-(\d+)-(\d+)u/, 'O$2-$3U$1u');
}

// Parses a raw config string into a typed design description.
// Never throws: returns { ok: true, design } or { ok: false, error }.
export function parseConfig(rawConfig) {
  if (typeof rawConfig !== 'string' || rawConfig.trim() === '') {
    return { ok: false, error: 'missing', message: 'No config string provided.' };
  }

  const config = migrateLegacyConfig(rawConfig.trim());
  const parts = config.split(SPLIT_RE);

  // parts[0] is whatever precedes 'M' — non-empty means this isn't a config
  // string at all (e.g. a pasted URL or garbage).
  if (parts.length < 2 || parts[0] !== '') {
    return { ok: false, error: 'malformed', message: 'Not a recognizable design code.' };
  }

  const raw = {};
  for (let i = 0; i < PARAMS.length; i++) {
    const p = PARAMS[i];
    const piece = parts[i + 1];
    if (piece === undefined) { raw[p.key] = p.def; continue; } // short/older URL

    switch (p.type) {
      case 'string':
        raw[p.key] = piece;
        break;
      case 'int': {
        const n = parseInt(piece, 10);
        raw[p.key] = Number.isFinite(n) ? n : p.def;
        break;
      }
      case 'array':
        raw[p.key] = piece === '' ? p.def : piece.split('-');
        break;
    }
  }

  const model = MODELS[raw.model];
  if (!model) {
    return { ok: false, error: 'unknown-model', message: `Unknown model id "${raw.model}".` };
  }

  // customWindows wire form is a key-run array: ['c','1','3','d','2','e','f','g']
  // => { c: [1, 3], d: [2], e: [], f: [], g: [] }  (convertArrayToObject mirror).
  const customWindows = Object.fromEntries(CUSTOM_WINDOW_ROWS.map((r) => [r, []]));
  let currentRow = null;
  for (const item of raw.customWindows) {
    if (Number.isNaN(Number(item))) {
      currentRow = CUSTOM_WINDOW_ROWS.includes(item) ? item : null;
    } else if (currentRow !== null && item !== '') {
      customWindows[currentRow].push(parseInt(item, 10));
    }
  }

  const flag = (arr, i) => arr[i] === '1';

  const design = {
    model: { id: raw.model, ...model },
    windows: {
      strip: flag(raw.windows, 0),      // option_1-0
      viewport: flag(raw.windows, 1),   // option_1-1
      custom: flag(raw.windows, 2),     // option_1-2
    },
    customWindows,
    interior: { id: raw.interior, name: INTERIORS[raw.interior] ?? `#${raw.interior}` },
    exterior: { id: raw.exterior, name: EXTERIORS[raw.exterior] ?? `#${raw.exterior}` },
    upgrades: {
      smartGlass: flag(raw.upgrades, 0),      // option_4-5
      extremeWeather: flag(raw.upgrades, 1),  // option_4-0
      extraDoor: flag(raw.upgrades, 2),       // option_4-3
    },
    addons: {
      desk: flag(raw.addons, 0),              // option_5-1
      airConditioning: flag(raw.addons, 1),   // option_5-4
    },
    foundationKit: raw.foundation === '1',    // option_6-1
    discount: raw.discount !== '0' ? raw.discount : null,
    raw,
  };

  return { ok: true, design };
}

// Convenience: pull ?config= off a URL (or the live location) and parse it.
export function parseConfigFromURL(href) {
  let params;
  try {
    params = new URL(href).searchParams;
  } catch {
    return { ok: false, error: 'bad-url', message: 'Unreadable URL.' };
  }
  return parseConfig(params.get('config') ?? '');
}
