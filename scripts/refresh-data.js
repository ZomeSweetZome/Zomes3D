#!/usr/bin/env node
// Fetches the four Google Sheets CSVs and writes pre-parsed JSON snapshots
// into data/. The browser loads these via loadData() in js/ui-controller.js
// with the original CSV URLs as a fallback.
//
// Parser must stay byte-equivalent to parseCSV() in js/ui-controller.js so
// runtime consumers see identical row shapes whether data came from the
// snapshot or the live fallback.

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const MAIN_SHEET = 'https://docs.google.com/spreadsheets/d/1hU0H-7k5TqUaMsO5IgSG8SCk64Vf73_uzAKGlmT5HyI/export?format=csv&gid=';
const ZIPTAX_SHEET = 'https://docs.google.com/spreadsheets/d/1r2yclrOnu-h9EjJjuYAYK9NbmKgITAaKCjFZmTea1bY/export?format=csv&gid=1261074691';

const SOURCES = [
  { name: 'ui',          url: MAIN_SHEET + '911871288' },
  { name: 'price',       url: MAIN_SHEET + '608401970' },
  { name: 'annotations', url: MAIN_SHEET + '1110711170' },
  // The runtime only reads ZipCode + StateRate (see getTaxRate). Dropping
  // the other 7 columns shrinks this snapshot ~4×. Then gzip on top brings
  // it down another ~7×; the browser decompresses via DecompressionStream
  // so this works on any static host without server-side encoding config.
  { name: 'ziptax',      url: ZIPTAX_SHEET, pickColumns: ['ZipCode', 'StateRate'], compress: true },
];

// Returns rows narrowed to the named columns (header preserved). Order of
// the input `columns` array becomes the output column order.
function pickColumns(rows, columns) {
  const header = rows[0];
  const indexes = columns.map((name) => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`column "${name}" not found in header [${header.join(', ')}]`);
    return i;
  });
  return rows.map((row) => indexes.map((i) => row[i]));
}

function parseCSV(text) {
  const output = [];
  const lines = text.split('\n');

  lines.forEach((line) => {
    line = line.trim();
    if (line.length === 0) return;

    const skipIndexes = {};
    const columns = line.split(',');

    output.push(
      columns.reduce((result, item, index) => {
        if (skipIndexes[index]) return result;

        if (item?.startsWith('"') && !item?.endsWith('"')) {
          while (!columns[index + 1].endsWith('"')) {
            index++;
            item += `,${columns[index]}`;
            skipIndexes[index] = true;
          }
          index++;
          skipIndexes[index] = true;
          item += `,${columns[index]}`;
        }

        result.push(item);
        return result;
      }, []),
    );
  });

  return output;
}

async function fetchCSV(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

async function refresh() {
  await mkdir(DATA_DIR, { recursive: true });

  const results = await Promise.all(
    SOURCES.map(async ({ name, url, pickColumns: cols, compress }) => {
      const csv = await fetchCSV(url);
      let rows = parseCSV(csv);
      if (cols) rows = pickColumns(rows, cols);
      const json = JSON.stringify(rows);

      const target = join(DATA_DIR, compress ? `${name}.json.gz` : `${name}.json`);
      // gzipSync with default options is deterministic for identical input,
      // so a byte-level diff against the previous file is reliable.
      const next = compress ? gzipSync(json, { level: 9 }) : Buffer.from(json);
      let prev = null;
      try { prev = await readFile(target); } catch { /* first run */ }

      const changed = !prev || !next.equals(prev);
      if (changed) await writeFile(target, next);

      return { name, rows: rows.length, rawBytes: json.length, bytes: next.length, changed, compress };
    }),
  );

  for (const r of results) {
    const flag = r.changed ? 'updated' : 'unchanged';
    const ratio = r.compress ? ` (${(r.rawBytes / r.bytes).toFixed(1)}x gzip from ${r.rawBytes})` : '';
    console.log(`  ${r.name.padEnd(12)} ${String(r.rows).padStart(5)} rows  ${String(r.bytes).padStart(8)} bytes  ${flag}${ratio}`);
  }
}

refresh().catch((err) => {
  console.error(err);
  process.exit(1);
});
