# Saved Designs — Design Doc

**Date:** 2026-05-07
**Status:** Validated, ready for implementation planning
**Repos touched:** `Zomes3D` (static configurator, GitHub Pages), `zomes_sdr` (Next.js + Supabase on Vercel)

## Goal

Let users save multiple designs (e.g. an office and a studio), come back later, and update or branch them — without an account-creation step up front. The first save (using the existing lead-capture form) is the implicit account creation. Returning users get back in via a stateless signed URL.

## Guiding decisions

| Decision | Choice |
|---|---|
| Return-user auth | Stateless signed URL — `email + t` query params, where `t = HMAC_SHA256(email, secret)` |
| Backend host | Extend `zomes_sdr` (Next.js + Supabase, already has `design_saves`) |
| First-save UX | Existing name/phone/email/zipcode form is unchanged. Subsequent saves are silent. |
| Save-button behavior | Smart: URL has `design_id` → update; no `design_id` → new design |
| Design naming | Auto-name from zome type (`"My 30ft Pod"`, dedup with `(2)` suffix), editable later |
| Update side-effects | Plain updates: silent. Save-as-new: full lead pipeline (Slack/email/HubSpot). |
| HubSpot "All Saved Designs" property | **Dropped.** Sales uses an admin impersonate link instead. |
| Library UI | In-page popup inside the configurator, not a separate page. |
| Header entry-point | Top-left of `#main-header`, sibling of `#identity`. |
| Soft-delete vs hard-delete | Soft (`archived_at`). |
| Duplicate | In v1. |

## Data model

A new `designs` table owns the user-facing library. Existing `design_saves` keeps being the immutable lead-capture audit log; every save (first or update) writes there too with a back-pointer.

```sql
create table designs (
  id                 uuid primary key default gen_random_uuid(),
  owner_email        text not null,
  name               text not null,
  zome_type          text,                            -- 'pod' | 'office' | 'studio'
  design_url         text not null,                   -- canonical latest state
  hubspot_contact_id text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  archived_at        timestamptz
);
create index idx_designs_owner_active
  on designs (owner_email, updated_at desc) where archived_at is null;
create index idx_designs_owner_all on designs (owner_email);

alter table design_saves
  add column design_id uuid references designs(id) on delete set null;
create index idx_design_saves_design_id on design_saves (design_id);

alter table designs enable row level security;
create policy "service role full access on designs"
  on designs for all to service_role using (true) with check (true);
-- No authenticated/anon policies: all access goes through SDR endpoints
-- that verify the HMAC token before touching the table.
```

**Why two tables.** `design_saves` is the funnel/audit signal — every submission, including spam, kept immutable for marketing metrics. `designs` is the user's mutable library. Keeping them separate means updates don't pollute funnel counts, and the lead-capture pipeline keeps its source of truth.

## Stateless signed-URL auth

A "logged-in" URL carries:

```
…<existing config params>…&design_id=<uuid>&email=<urlencoded>&t=<base64url-hmac>
```

`t = base64url(hmac_sha256("v1:" + email_lowercased, ZOMES_DESIGN_TOKEN_SECRET))[:16 bytes]`. Stable per-email, no expiry, no nonce. Verification = recompute and constant-time compare.

**`zomes_sdr/lib/auth/designToken.ts`:**

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.ZOMES_DESIGN_TOKEN_SECRET!;
const VERSION = "v1";

export function mintToken(email: string): string {
  const norm = email.trim().toLowerCase();
  const mac = createHmac("sha256", SECRET).update(`${VERSION}:${norm}`).digest();
  return mac.subarray(0, 16).toString("base64url");
}

export function verifyToken(email: string, token: string): boolean {
  const expected = Buffer.from(mintToken(email), "base64url");
  let provided: Buffer;
  try { provided = Buffer.from(token, "base64url"); } catch { return false; }
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(expected, provided);
}
```

**`zomes_sdr/lib/auth/requireDesignToken.ts`:**

```ts
export function requireDesignToken(req: NextRequest):
  | { ok: true; email: string }
  | { ok: false; res: NextResponse }
{
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const t = searchParams.get("t") ?? "";
  if (!email || !t || !verifyToken(email, t)) {
    return { ok: false, res: NextResponse.json({ error: "unauthorized" }, { status: 401, headers: cors(req) }) };
  }
  return { ok: true, email };
}
```

**Security model.** Anyone-with-the-URL = the user — equivalent to a permanent magic link. We're explicitly trading security for UX in line with the product brief. Rotating `ZOMES_DESIGN_TOKEN_SECRET` is the global kill switch (signs everyone out). To prevent the token leaking via the `Referer` header on outbound clicks, set `<meta name="referrer" content="strict-origin">` site-wide.

## Save flows

### First-ever save

1. User configures a zome, clicks Save → existing form opens (name/phone/email/zipcode).
2. Frontend POSTs to `/api/webhooks/configurator` (unchanged endpoint) with form fields + `designURL = current page URL`.
3. Server: `recordDesignSave(...)` → INSERT new `designs` row with auto-name `computeAutoName(email, zome_type)` (dedup with `(2)`, `(3)`, …) → backfill `design_saves.design_id` → mint `t = mintToken(email)` → return `{ ok: true, design_id, email, t, welcome_back: false }`.
4. Frontend: `history.replaceState` adds `&design_id=…&email=…&t=…` to the URL. The browser session is now "signed in."
5. Existing pipeline fires (HubSpot upsert, Slack ping, confirmation email). Confirmation email's CTA: `https://design.zomes.com/?<saved-design-config>&design_id=…&email=…&t=…`.

### Subsequent save (URL already has `email + t + design_id`)

1. Click Save → no form. Frontend POSTs `(email, t, design_id, designURL=current URL, totalAmount)` to the same webhook.
2. Server: verify `t`; verify `designs.owner_email === email` for the given `design_id`; UPDATE `designs.design_url` and `updated_at`; INSERT `design_saves` row with `design_id` populated. Skip `processOneDesignSave` (no Slack/email/HubSpot).
3. Frontend: brief "Saved" toast. URL doesn't change.

### Save-as-new (signed-in only)

Secondary "Save as new design" button in the save UI. Same as a subsequent save except `design_id` is omitted from the request → server creates a new `designs` row (auto-name + dedup) and **fires the full lead pipeline** (sales-team Slack ping = "this lead is exploring a new variant"). After response, frontend `replaceState`s the new `design_id` onto the URL.

### Subsequent save without a known prior submission

If the URL has `email + t` but the user has never submitted the form (impersonation, edge case), the webhook validation will reject because `name/phone/zipcode` are required. Server falls back to: look up the most recent `design_saves` row for that email, copy those fields onto the new submission. If no prior row exists, return `{ requires_form: true }`; frontend opens the form.

## API surface (zomes_sdr)

All endpoints take `(email, t)` as query params and call `requireDesignToken(req)` first.

| Method + path | Body / Query | Behavior |
|---|---|---|
| `GET /api/designs` | `email + t` | Returns non-archived designs for `email`, newest-first: `[{ id, name, zome_type, design_url, updated_at }, …]`. Verifies `owner_email === email` (defense in depth). |
| `PATCH /api/designs/:id` | `email + t`; body `{ name }` | Rename. |
| `DELETE /api/designs/:id` | `email + t` | Soft delete: `update designs set archived_at = now()`. |
| `POST /api/designs/:id/duplicate` | `email + t` | INSERT sibling row with same `design_url`, name + " (copy)". Return new row. |
| `POST /api/auth/send-link` | `{ email }` (no token) | Lookup → if any non-archived `designs` exist for `email`, mint `t` and email `https://design.zomes.com/?<placeholder>&email=…&t=…&design_id=<their-most-recent>`. **Always** respond `{ ok: true }` regardless (no email enumeration). |
| `GET /admin/impersonate?email=…` | SDR admin auth (not the design token) | 302 → `https://design.zomes.com/?email=…&t=<minted>&design_id=<their-most-recent>`. Replaces the need for the HubSpot "All Saved Designs" property. |

**Webhook update — `POST /api/webhooks/configurator` ([route.ts:57](../../../zomes_sdr/app/api/webhooks/configurator/route.ts#L57)):**

- Read optional `design_id`, `email_token` (`t`) from form data.
- After `recordDesignSave`, branch:
  - **Has valid `(email, t, design_id)`** → verify ownership → UPDATE `designs.design_url`. Skip `processOneDesignSave`.
  - **Has valid `(email, t)` but no `design_id`** (save-as-new from a signed-in session) → INSERT new `designs` row, run `processOneDesignSave`.
  - **No `t`** (anonymous first save, or pre-feature old-link save) → INSERT new `designs` row, run `processOneDesignSave`. Mint `t` from email and include in response.
- Backfill `design_saves.design_id` with the resolved id either way.
- Response: `{ ok: true, design_id, email, t, welcome_back }`.

`welcome_back` is `true` when `count(*) from design_saves where email = $1 and id <> <just-inserted>` is non-zero — i.e. this email has been seen before. Used by the frontend to show a one-shot toast.

## Frontend (Zomes3D)

### Files touched

| File | Change |
|---|---|
| `index.html` | Add `<meta name="referrer" content="strict-origin">`. Add `<div id="my-designs-entry">` button next to `#identity` in `#main-header`. Add popup overlay markup at end of body. |
| `js/my-designs.js` | **New** module (~250 lines). Owns the popup: open/close, fetch list, rename/duplicate/delete/open, signed-out email entry, "send link" submit. Public surface: `MyDesigns.open()`, `MyDesigns.close()`. |
| `js/3d-configurator.js` | Modify form-submit handler (around [3d-configurator.js:3161](../../js/3d-configurator.js#L3161)) — `await fetch(...).json()` instead of native form POST, then `replaceState` `{design_id, email, t}` onto URL. Add `getSignedInState()`. Add silent `sessionSave()` path for signed-in updates that bypasses the form. |
| `css/3d_ar.css` | Popup styles, reusing tokens from existing `.contact_form__popup-*` classes. |

No new dependencies.

### Click flow for the Save button

```
Click "Save"
   │
   ├── URL has email + t ?
   │       ├── yes → POST webhook with (email, t, design_id?, designURL, totals)
   │       │           — no form modal, no extra clicks
   │       │           response: {design_id, email, t} → replaceState
   │       │
   │       └── no  → existing flow: open form, user fills name/email/phone/zip,
   │                  submit → webhook → response includes {design_id, email, t}
   │                  → replaceState. From now on, we're signed in.
   │
   └── "Save as new" button (signed-in only) → same as above but omit design_id
```

### My Designs popup — layout

**Signed-in (URL has `email + t`):**

```
┌── My designs ─────────────────────────── ✕ ──┐
│  ┌──────────────┐ ┌──────────────┐ ┌──────┐ │
│  │ [icon]       │ │ [icon]       │ │  +   │ │
│  │ My Office    │ │ My 30ft Pod  │ │ New  │ │
│  │ Updated 2d   │ │ Updated 5h   │ │design│ │
│  │ Open · ⋯    │ │ Open · ⋯    │ │      │ │
│  └──────────────┘ └──────────────┘ └──────┘ │
│  [Sign out]                                  │
└──────────────────────────────────────────────┘
```

`⋯` menu per card: **Rename · Duplicate · Delete**. v1 uses static zome-type icons; thumbnails deferred to v2.

**Signed-out (no `email + t` in URL):**

```
┌── My designs ─────────────────────────── ✕ ──┐
│  Enter your email and we'll send you a       │
│  link to your saved designs.                 │
│                                              │
│  [______________________]   [Send link]      │
│                                              │
│  Don't have any saved yet? Just configure    │
│  and click Save.                             │
└──────────────────────────────────────────────┘
```

### Open-from-popup

```js
function openDesign(card) {
  const u = new URL(card.design_url, location.origin);
  u.searchParams.set('design_id', card.id);
  u.searchParams.set('email', currentEmail);
  u.searchParams.set('t', currentToken);
  history.pushState(null, '', u);
  window.dispatchEvent(new PopStateEvent('popstate')); // configurator already listens
  MyDesigns.close();
}
```

No full reload — the 3D scene stays warm and re-applies the saved config via the existing rehydrate code path.

### Sign out

Strip `email`, `t`, `design_id` from URL via `replaceState`; close popup. No server call; the token is HMAC-derived. To invalidate everyone at once, rotate `ZOMES_DESIGN_TOKEN_SECRET` server-side.

## Backwards compatibility (old confirmation-email links)

Old links carry `email + name + phone + zipcode` in the query string ([3d-configurator.js:3161-3165](../../js/3d-configurator.js#L3161-L3165)) but no `t` and no `design_id`.

| URL state | Behavior |
|---|---|
| `?config…&email=X&phone=…&zipcode=…&name=…` (post-form-era link) | Loads design; Save shows form pre-filled. Server detects "email X already has designs in DB" → response includes `welcome_back: true`. Frontend shows 6-second toast: **"Welcome back — your other designs are in [My designs]"**. |
| `?config…` only (pre-form-era / shared-by-friend link) | Loads design; Save shows empty form. Anonymous first-save flow as designed. |
| `?config…&email=X&t=…&design_id=…` (new feature URL) | Loads design as the signed-in user editing that design. |

**Pre-launch backfill is strongly recommended:** for each distinct `(email, zome_type)` in `design_saves`, INSERT a `designs` row with the most recent URL and a deduped name. Without it, "welcome back" surfaces only the design the user just re-saved; with it, they see their full historic library.

**Acknowledged edge case (not solved in v1):** a user clicks an old link, doesn't click Save, and leaves. They never become signed in and never discover the My Designs button means anything for them. Same outcome as today; acceptable.

## Migration & rollout

### Migration file

`zomes_sdr/supabase/migrations/20260507300000_designs_table.sql` — see "Data model" section above.

### Rollout sequence

| # | Step | Risk if it fails |
|---|---|---|
| 1 | Generate `ZOMES_DESIGN_TOKEN_SECRET` (`openssl rand -base64 32`); set in Vercel env (preview + prod). | None — until step 3 nothing reads it. |
| 2 | Apply migration on staging Supabase; smoke-test by hand-inserting a `designs` row and querying. | Trivially reversible (`drop table designs;`). |
| 3 | Merge & deploy `zomes_sdr` PR: `lib/auth/designToken.ts`, `requireDesignToken` helper, the five new routes, the webhook update, the impersonate redirect. Existing `/api/webhooks/configurator` stays backwards-compatible (new fields are optional). | If the webhook update has a bug, *existing* form submissions could break — mitigate by deploying to a Vercel preview URL first and running the existing form against it before promoting. |
| 4 | Apply migration to prod Supabase. | Same as #2; can drop and re-apply. |
| 5 | Run pre-launch backfill (`scripts/backfill-designs.ts`). | Pure read-mostly side job; safe to re-run idempotently. |
| 6 | Merge & deploy `Zomes3D` PR: header button, popup module, configurator integration, `<meta referrer>`. GitHub Pages auto-deploys on `main`. | Old emails' links still work (pre-`design_id` URLs load anonymous-mode, save = first-save flow with `welcome_back` toast). |

The whole rollout is **additive** — no removed columns, no breaking endpoint signatures, no historic URL stops working.

## Out of scope for v1, on the radar for v1.x

- **Thumbnails** — needs a headless render or screenshot pipeline.
- **Folders / multi-zome grouping** — e.g. "Property A" containing both an office and a studio.
- **Sharing / collaboration** — a design owned by two emails. Token model accommodates this (owner_email becomes a join table) but no UX yet.
- **Email-change flow** — token rotation when a user changes email; today they create a new account.
- **Token expiry / explicit revocation** — currently the only kill switch is global secret rotation.
