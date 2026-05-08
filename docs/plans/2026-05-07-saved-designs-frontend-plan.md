# Saved Designs — Frontend Implementation Plan (Zomes3D)

**Date:** 2026-05-07
**Pairs with:** the design doc at [docs/plans/2026-05-07-saved-designs-design.md](2026-05-07-saved-designs-design.md) (commit `3e5dc83`). Backend half: in the `zomes_sdr` repo at `docs/plans/2026-05-07-saved-designs-backend-plan.md`.

## What this plan delivers

- A "My designs" library popup inside the configurator (no separate page).
- A header entry-point button (top-left, sibling of `#identity`).
- Silent subsequent saves once the URL has `email + t + design_id` — no form modal.
- A "Save as new" secondary button on the existing save UI for signed-in users.
- A "Welcome back" toast when an old confirmation-email link triggers a re-save and the server reports the email already has prior designs.

## Prerequisites

- [ ] Backend deployed: new `/api/designs/*` routes live, webhook returns `{ design_id, email, t, welcome_back }`, email template includes the new "View / edit my designs" CTA. (Tracked in backend plan.)

## Task list

### 1. `<head>` change — referrer policy

**File:** [index.html](../../index.html)

Add inside `<head>`:

```html
<meta name="referrer" content="strict-origin">
```

**Why:** prevents `email` and `t` query params from leaking via the `Referer` header on outbound clicks (e.g. the social-media links in the header, the Homepage link).

**Acceptance:** click any header outbound link with `?email=…&t=…` in the URL; in the network panel of the destination request, the Referer header should be `https://design.zomes.com/` (no query string).

---

### 2. Header entry-point button

**File:** [index.html](../../index.html) — inside `#main-header` ([line 105](../../index.html#L105)), as a sibling immediately after `#identity`.

```html
<div id="my-designs-entry" class="top-frame-panel top-frame-panel__my-designs">
  <button type="button" id="my_designs_btn" class="my-designs-entry__btn">
    <span class="my-designs-entry__icon"></span>
    <span class="my-designs-entry__label">My designs</span>
  </button>
</div>
```

**JS:** in `js/my-designs.js` (see task 4), wire `#my_designs_btn` click → `MyDesigns.open()`.

**Acceptance:** button visible top-left next to the logo, both signed-in and signed-out. Click opens the popup.

---

### 3. Popup overlay markup

**File:** [index.html](../../index.html) — at end of body, near the existing `.contact_form__popup-overlay` ([line 652](../../index.html#L652)).

```html
<div class="my-designs__popup-overlay">
  <div class="my-designs__popup-content">
    <div class="my-designs__close_btn" id="my_designs_close">×</div>

    <!-- Signed-in state -->
    <div class="my-designs__signed-in" hidden>
      <h2 class="my-designs__title">My designs</h2>
      <div class="my-designs__grid" id="my_designs_grid"></div>
      <div class="my-designs__footer">
        <button type="button" id="my_designs_signout" class="my-designs__signout">Sign out</button>
      </div>
    </div>

    <!-- Signed-out state -->
    <div class="my-designs__signed-out" hidden>
      <h2 class="my-designs__title">My designs</h2>
      <p class="my-designs__hint">
        Enter your email and we'll send you a link to your saved designs.
      </p>
      <form id="my_designs_send_link_form" class="my-designs__send-form">
        <input type="email" name="email" required placeholder="you@example.com" />
        <button type="submit">Send link</button>
      </form>
      <p class="my-designs__hint my-designs__hint--small">
        Don't have any saved yet? Just configure and click Save.
      </p>
      <div class="my-designs__sent-confirm" hidden>
        If you have saved designs, we just emailed you a link.
      </div>
    </div>

    <!-- Loading + error overlays -->
    <div class="my-designs__loading" hidden>Loading…</div>
    <div class="my-designs__error" hidden></div>
  </div>
</div>
```

Card template (rendered by JS into `#my_designs_grid`):

```html
<div class="my-designs__card" data-id="…" data-design-url="…">
  <div class="my-designs__card-icon" data-zome-type="…"></div>
  <div class="my-designs__card-name" contenteditable="false">My Office</div>
  <div class="my-designs__card-meta">Updated 2d ago</div>
  <div class="my-designs__card-actions">
    <button class="my-designs__open-btn">Open</button>
    <button class="my-designs__more-btn" aria-haspopup="menu">⋯</button>
  </div>
</div>
```

`⋯` opens a small menu: **Rename · Duplicate · Delete**. Implement as a `<ul>` positioned absolutely; toggle visibility on button click; close on outside click.

---

### 4. New module — `js/my-designs.js`

**File:** `js/my-designs.js` — new file, ~250 lines, vanilla JS, no new deps.

Public surface:

```js
// Globally exposed for index.html to wire the header button
window.MyDesigns = {
  open() { /* fetch + render */ },
  close() { /* hide overlay */ },
  showWelcomeBackToast() { /* called by configurator after a save with welcome_back=true */ },
};
```

Internals:

```js
const SDR_BASE = 'https://sdr.zomes.com';

function getAuth() {
  const url = new URL(location.href);
  const email = url.searchParams.get('email');
  const t = url.searchParams.get('t');
  return email && t ? { email, t } : null;
}

async function fetchDesigns(auth) {
  const u = new URL(`${SDR_BASE}/api/designs`);
  u.searchParams.set('email', auth.email);
  u.searchParams.set('t', auth.t);
  const res = await fetch(u);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).designs;
}

async function renameDesign(auth, id, name) { /* PATCH */ }
async function deleteDesign(auth, id)       { /* DELETE — soft */ }
async function duplicateDesign(auth, id)    { /* POST .../duplicate */ }

function openDesign(card, auth) {
  const u = new URL(card.dataset.designUrl, location.origin);
  u.searchParams.set('design_id', card.dataset.id);
  u.searchParams.set('email', auth.email);
  u.searchParams.set('t', auth.t);
  history.pushState(null, '', u);
  window.dispatchEvent(new PopStateEvent('popstate')); // configurator listens
  window.MyDesigns.close();
}

async function sendLink(email) {
  await fetch(`${SDR_BASE}/api/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  // Always show the same confirmation regardless of response — backend
  // intentionally returns ok: true for non-existent emails to prevent
  // email enumeration.
}

function signOut() {
  const u = new URL(location.href);
  u.searchParams.delete('email');
  u.searchParams.delete('t');
  u.searchParams.delete('design_id');
  history.replaceState(null, '', u);
  window.MyDesigns.close();
  // Update header button label if needed.
}
```

`open()` flow:
1. Show overlay + loading state.
2. `auth = getAuth()`. If no auth → render signed-out form, hide loading.
3. Else: `try { designs = await fetchDesigns(auth) }` → render cards. On 401 (token rejected — secret rotated, etc.), strip auth params from URL and re-render signed-out form.

**Acceptance:** opening the popup with `email + t` in URL fetches and renders cards within ~1s. Without auth, shows the email entry form. Sending a link shows the generic "if you have designs, we emailed you" message. Sign-out clears URL params and closes popup.

---

### 5. Configurator integration

**File:** [js/3d-configurator.js](../../js/3d-configurator.js)

**5a. Form-submit handler** (around [line 3161](../../js/3d-configurator.js#L3161)):

Replace native form POST with `fetch(...).json()`, then act on the response:

```js
const formData = new FormData(form);
formData.append('designURL', window.location.href);
// New: pass design_id and t if we have them (silent updates / save-as-new)
const url = new URL(location.href);
if (url.searchParams.get('design_id')) formData.append('design_id', url.searchParams.get('design_id'));
if (url.searchParams.get('t'))         formData.append('t',         url.searchParams.get('t'));

const res = await fetch(form.action, { method: 'POST', body: formData });
const data = await res.json();
if (!res.ok || !data.ok) { /* existing error handling */ return; }

// Update URL with the new identity + design_id → we're now "signed in"
const newUrl = new URL(location.href);
if (data.email)     newUrl.searchParams.set('email',     data.email);
if (data.t)         newUrl.searchParams.set('t',         data.t);
if (data.design_id) newUrl.searchParams.set('design_id', data.design_id);
history.replaceState(null, '', newUrl);

if (data.welcome_back) window.MyDesigns?.showWelcomeBackToast();
```

**5b. Silent-save path** — when the user clicks Save and `getAuth() && URL has design_id`, skip the form modal entirely and POST directly:

```js
async function silentSave({ saveAsNew = false } = {}) {
  const auth = getAuth();
  const url = new URL(location.href);
  const designId = saveAsNew ? null : url.searchParams.get('design_id');

  const fd = new FormData();
  fd.append('email', auth.email);
  fd.append('t', auth.t);
  if (designId) fd.append('design_id', designId);
  fd.append('designURL', window.location.href);
  fd.append('totalamount_number', /* current total */);
  fd.append('totalamount_string', /* current total formatted */);
  // name/phone/zipcode omitted — server pulls them from prior design_saves.

  const res = await fetch('https://sdr.zomes.com/api/webhooks/configurator', {
    method: 'POST', body: fd,
  });
  const data = await res.json();
  // Apply the same URL-update logic as the form-submit handler.
  // Show a "Saved" toast.
}
```

Wire the existing Save button: if `getAuth()` is non-null, call `silentSave()`; else open the form as today. Add a "Save as new" secondary button that calls `silentSave({ saveAsNew: true })` (visible only when `getAuth()` is truthy).

**5c. `popstate` listener** — when My Designs popup pushes a new URL, the configurator should re-rehydrate from query params. Confirm the existing rehydrate code is reachable via `popstate`; if not, refactor it into a callable function (`rehydrateFromUrl()`) and wire `window.addEventListener('popstate', rehydrateFromUrl)`.

**Acceptance:**
- First save (anonymous): existing form opens, submits, page becomes signed-in (URL gets `email + t + design_id`), toast says "Saved".
- Second save in same session: no form, just a "Saved" toast. URL unchanged.
- Save-as-new: no form, "Saved" toast, URL `design_id` updates to the new design.
- Old confirmation-email link (`?config…&email=X&phone=…`): existing form opens (pre-filled), submits, response includes `welcome_back: true`, "Welcome back" toast appears with link to My Designs.

---

### 6. CSS

**File:** [css/3d_ar.css](../../css/3d_ar.css)

Reuse existing tokens from `.contact_form__popup-*` classes for consistency. Add:

- `.top-frame-panel__my-designs` — header button styling matching the other top-frame panels.
- `.my-designs__popup-overlay`, `.my-designs__popup-content`, `.my-designs__close_btn` — modeled on the existing contact-form popup.
- `.my-designs__grid` — CSS grid, `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`, gap.
- `.my-designs__card` — bordered card with hover lift.
- `.my-designs__card-icon[data-zome-type="pod"|"office"|"studio"]` — small icon per type (reuse existing zome-type icons if any; otherwise emoji or a simple SVG).
- Toast: `.my-designs__toast`, `.my-designs__toast--welcome-back` — fixed-positioned, top-center, 6s auto-dismiss.

**Acceptance:** popup styling matches the existing form popup at a glance (same border radius, shadow, padding). Cards reflow gracefully on mobile (single column < 480px).

---

### 7. Script tag wiring

**File:** [index.html](../../index.html) — somewhere in the `<script>` block at the bottom that loads the other JS modules.

```html
<script src="./js/my-designs.js"></script>
```

Place it before any code that might call `window.MyDesigns` (i.e. before `js/3d-configurator.js` if the configurator references the welcome-back toast).

---

## Rollout sequence (frontend)

| # | Step | Reversibility |
|---|---|---|
| 1 | Backend live in prod (verify via `curl https://sdr.zomes.com/api/designs?email=test&t=garbage` returns 401) | n/a |
| 2 | Merge frontend PR to `main` → GitHub Pages auto-deploys to design.zomes.com | git revert → redeploy |
| 3 | Smoke test on prod: anonymous save → verify URL gets `email + t + design_id`; My designs button shows the design; old-email-link click → "Welcome back" toast | n/a |

## Decisions still open

- **Save button label change** for signed-in users — is the existing "Save" copy fine, or should it become "Save changes" when editing an existing design vs "Save" for new? Lean: keep "Save" everywhere; the secondary "Save as new" button signals branching.
- **Toast timing** — 6 seconds for "Welcome back" feels right for a one-shot, but worth user-testing. The "Saved" silent-save toast is shorter (~2s).
- **Mobile layout for the My Designs popup** — full-screen vs the same overlay style. Mobile traffic is significant for the configurator; lean: full-screen on < 600px width, overlay otherwise.

## Out of scope for v1, on the radar for v1.x

- Thumbnails — defer until we have a headless screenshot pipeline.
- Drag-to-reorder, folders, multi-select.
- Confirmation modal on Delete (v1: just soft-delete with an "Undo" toast for 6s, server-side undelete via PATCH `archived_at = null`).
- Inline name editing on the card — v1 uses a Rename action in the `⋯` menu that prompts via `window.prompt()`; v1.1 can do a nicer inline editor.
