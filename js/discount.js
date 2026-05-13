// Discount mechanism: a URL parameter D{amount}-{hash} overrides the displayed
// total. The hash is HMAC-SHA256(amount, DISCOUNT_SECRET) truncated to 6 hex
// chars. Sales reps generate values via /generatediscount.html; the
// configurator verifies before applying.
//
// Threat model: catches a casual customer who tweaks D54300 → D5430 in the
// address bar. Anyone who reads this file can forge a discount — that's
// accepted. The order webhook should re-validate server-side before
// honoring any discount in fulfillment.
//
// The hex char 'a' collides with the lowercase 'a' splitValue (currency) in
// the configurator's URL parser — every hash is mapped 'a' → 'g' on output
// and back on verify so the value can pass through the parser untouched.

export const DISCOUNT_SECRET = 'zomes-discount-v1';
const HASH_LENGTH = 6;

function escapeHex(hex) { return hex.replaceAll('a', 'g'); }

async function hashAmount(amount) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(DISCOUNT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(String(amount)));
  const hex = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return escapeHex(hex.slice(0, HASH_LENGTH));
}

export async function generateDiscount(amount) {
  const a = parseInt(amount, 10);
  if (!Number.isFinite(a) || a <= 0) throw new Error('amount must be a positive integer');
  return `${a}-${await hashAmount(a)}`;
}

// Returns the amount if `rawValue` parses and the hash verifies; null otherwise.
export async function verifyDiscount(rawValue) {
  if (!rawValue || rawValue === '0') return null;
  const match = /^(\d+)-([0-9b-g]+)$/.exec(rawValue);
  if (!match) return null;
  const amount = parseInt(match[1], 10);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const expected = await hashAmount(amount);
  return match[2] === expected ? amount : null;
}
