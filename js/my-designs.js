// My Designs popup — vanilla JS module.
//
// Owns the in-page library popup (markup in index.html, classes prefixed
// .my-designs__*) and the small "saved" / "welcome-back" toasts.
//
// Auth model: stateless. The user is "signed in" iff the URL has both
// ?email=… and ?t=…. No localStorage, no cookies — sign-out just strips
// those params. Every API call passes them as query params; the SDR
// backend verifies the HMAC token before doing anything.
//
// Public surface (window.MyDesigns):
//   open()                    — show popup; renders signed-in or signed-out state.
//   close()                   — hide popup.
//   revealHeaderButton()      — show the "My Saved Designs" header button
//                                (called after successful save / when probe
//                                confirms ≥ 1 design exists).
//   hideHeaderButton()        — hide the header button (sign out, no designs).
//   showSavedToast()          — "Saved" toast for silent updates.
//   showWelcomeBackToast()    — toast shown after a save where the server
//                                reported welcome_back: true (returning user
//                                via an old confirmation-email link).
//
// Header-button visibility rule: the button is hidden by default in the
// markup. It's revealed only when the user is signed in (URL has email+t)
// AND we've confirmed they have at least one saved design — either via a
// successful GET /api/designs probe at page load, or because a save just
// succeeded (we know there's a design now).
//
// Talks to: https://sdr.zomes.com/api/{designs,auth/send-link} (CORS-allowed
// in the SDR webhook config). Failures degrade visibly (error pane in the
// popup, never a console-only failure).

const SDR_BASE = 'https://sdr.zomes.com';

// ── DOM refs (resolved once, on first use) ──────────────────────────────────

let dom = null;
function $dom() {
  if (dom) return dom;
  dom = {
    overlay: document.getElementById('my_designs_popup'),
    closeBtn: document.getElementById('my_designs_close'),
    loading: document.getElementById('my_designs_loading'),
    error: document.getElementById('my_designs_error'),
    signedIn: document.getElementById('my_designs_signed_in'),
    signedOut: document.getElementById('my_designs_signed_out'),
    grid: document.getElementById('my_designs_grid'),
    emailLabel: document.getElementById('my_designs_email'),
    signoutBtn: document.getElementById('my_designs_signout'),
    sendLinkForm: document.getElementById('my_designs_send_link_form'),
    sentConfirm: document.getElementById('my_designs_sent_confirm'),
    headerEntry: document.getElementById('my-designs-entry'),
    headerBtn: document.getElementById('my_designs_btn'),
    toast: document.getElementById('my_designs_toast'),
    pickerSection: document.getElementById('saved_designs_picker'),
    pickerList: document.getElementById('saved_designs_picker_list'),
  };
  return dom;
}

function revealHeaderButton() {
  const d = $dom();
  if (d.headerEntry) d.headerEntry.hidden = false;
}

function hideHeaderButton() {
  const d = $dom();
  if (d.headerEntry) d.headerEntry.hidden = true;
}

// ── Auth state from URL ─────────────────────────────────────────────────────

function getAuth() {
  const url = new URL(location.href);
  const email = url.searchParams.get('email');
  const t = url.searchParams.get('t');
  return email && t ? { email, t } : null;
}

function getDesignId() {
  return new URL(location.href).searchParams.get('design_id');
}

// ── API client ──────────────────────────────────────────────────────────────

function authedUrl(path, auth) {
  const u = new URL(`${SDR_BASE}${path}`);
  u.searchParams.set('email', auth.email);
  u.searchParams.set('t', auth.t);
  return u;
}

async function fetchDesigns(auth) {
  const res = await fetch(authedUrl('/api/designs', auth));
  if (res.status === 401) return { unauthorized: true };
  if (res.status === 503) return { unavailable: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return { designs: data.designs ?? [] };
}

async function patchDesign(auth, id, body) {
  const res = await fetch(authedUrl(`/api/designs/${id}`, auth), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).design;
}

async function deleteDesign(auth, id) {
  const res = await fetch(authedUrl(`/api/designs/${id}`, auth), { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function duplicateDesign(auth, id) {
  const res = await fetch(authedUrl(`/api/designs/${id}/duplicate`, auth), { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).design;
}

async function postSendLink(email) {
  // Server always responds { ok: true } regardless of match (anti-enumeration).
  // We don't need to read the body.
  await fetch(`${SDR_BASE}/api/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

// ── Rendering ──────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function relativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.round(ms / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

function renderCards(designs) {
  const d = $dom();
  if (!designs.length) {
    d.grid.innerHTML = `
      <div class="my-designs__empty">
        You haven't saved any designs yet. Configure a Zome and click Save.
      </div>`;
    return;
  }
  d.grid.innerHTML = designs.map((design) => `
    <div class="my-designs__card" data-id="${escapeHtml(design.id)}" data-design-url="${escapeHtml(design.design_url)}" data-zome-type="${escapeHtml(design.zome_type ?? '')}">
      <div class="my-designs__card-icon" data-zome-type="${escapeHtml(design.zome_type ?? 'unknown')}"></div>
      <div class="my-designs__card-name">${escapeHtml(design.name)}</div>
      <div class="my-designs__card-meta">
        ${design.zome_type ? escapeHtml(design.zome_type.charAt(0).toUpperCase() + design.zome_type.slice(1)) + ' · ' : ''}Updated ${relativeTime(design.updated_at)}
      </div>
      <div class="my-designs__card-actions">
        <button type="button" class="my-designs__open-btn" data-action="open">Open</button>
        <button type="button" class="my-designs__more-btn" data-action="menu" aria-label="More actions">⋯</button>
      </div>
      <ul class="my-designs__menu" hidden>
        <li><button type="button" data-action="rename">Rename</button></li>
        <li><button type="button" data-action="duplicate">Duplicate</button></li>
        <li><button type="button" data-action="delete">Delete</button></li>
      </ul>
    </div>`).join('');
}

function showState(which) {
  const d = $dom();
  d.loading.hidden = which !== 'loading';
  d.error.hidden = which !== 'error';
  d.signedIn.hidden = which !== 'signedIn';
  d.signedOut.hidden = which !== 'signedOut';
}

function showError(msg) {
  const d = $dom();
  d.error.textContent = msg;
  showState('error');
}

// ── Card-action handling (event delegation) ─────────────────────────────────

function findCard(el) {
  return el.closest('.my-designs__card');
}

async function handleGridClick(ev) {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const card = findCard(btn);
  if (!card) return;
  const auth = getAuth();
  if (!auth) return;

  const id = card.dataset.id;
  const designUrl = card.dataset.designUrl;
  const name = card.querySelector('.my-designs__card-name')?.textContent ?? '';

  // Close any other open menus.
  $dom().grid.querySelectorAll('.my-designs__menu').forEach((m) => {
    if (m !== card.querySelector('.my-designs__menu')) m.hidden = true;
  });

  if (action === 'open') {
    openSavedDesign(designUrl, id, auth);
    return;
  }
  if (action === 'menu') {
    const menu = card.querySelector('.my-designs__menu');
    menu.hidden = !menu.hidden;
    return;
  }
  if (action === 'rename') {
    const next = window.prompt('Rename design:', name);
    if (next == null) return;
    const trimmed = next.trim();
    if (!trimmed || trimmed === name) return;
    try {
      await patchDesign(auth, id, { name: trimmed });
      await refresh();
    } catch (err) {
      showError(`Couldn't rename: ${err.message}`);
    }
    return;
  }
  if (action === 'duplicate') {
    try {
      await duplicateDesign(auth, id);
      await refresh();
    } catch (err) {
      showError(`Couldn't duplicate: ${err.message}`);
    }
    return;
  }
  if (action === 'delete') {
    if (!window.confirm(`Delete "${name}"? You can't undo this from here.`)) return;
    try {
      await deleteDesign(auth, id);
      await refresh();
    } catch (err) {
      showError(`Couldn't delete: ${err.message}`);
    }
    return;
  }
}

// Click outside any open menu closes them.
function handleDocClick(ev) {
  if (!ev.target.closest('.my-designs__more-btn') && !ev.target.closest('.my-designs__menu')) {
    $dom().grid?.querySelectorAll('.my-designs__menu').forEach((m) => { m.hidden = true; });
  }
}

// ── Open a saved design (route via popstate so the configurator rehydrates) ─

function openSavedDesign(designUrl, designId, auth) {
  const u = new URL(designUrl, location.origin);
  u.searchParams.set('design_id', designId);
  u.searchParams.set('email', auth.email);
  u.searchParams.set('t', auth.t);
  // Use replaceState (not pushState) so the user's back button still goes
  // back to wherever they were before, not into a stack of saved-design URLs.
  history.replaceState(null, '', u.toString());
  // Fire a popstate so any listeners (configurator rehydrate) react.
  // popstate alone won't trigger a hash/page reload — the configurator's
  // listener should call its rehydrate function directly.
  window.dispatchEvent(new PopStateEvent('popstate'));
  // Many configurators rehydrate only on full reload. If the configurator
  // doesn't expose a rehydrate hook, fall back to reload (caller can
  // override via window.MyDesigns.onOpenDesign).
  if (typeof window.MyDesigns?.onOpenDesign === 'function') {
    window.MyDesigns.onOpenDesign();
  } else {
    location.reload();
  }
  close();
}

// ── Lifecycle ───────────────────────────────────────────────────────────────

let refreshing = false;
async function refresh() {
  if (refreshing) return;
  refreshing = true;
  try {
    const auth = getAuth();
    if (!auth) {
      showState('signedOut');
      hideHeaderButton();
      return;
    }
    showState('loading');
    const result = await fetchDesigns(auth);
    if (result.unauthorized) {
      // Token rejected — strip from URL and fall back to signed-out form.
      stripAuthFromUrl();
      hideHeaderButton();
      showState('signedOut');
      return;
    }
    if (result.unavailable) {
      // Backend gate is off (agent_saved_designs_enabled=false). Hide the
      // entry button so the feature looks "not yet available" instead of
      // half-broken; surface a message in the popup for users who got here.
      hideHeaderButton();
      showError('My Saved Designs is temporarily unavailable. Please try again in a few minutes.');
      return;
    }
    if ((result.designs ?? []).length === 0) {
      hideHeaderButton();
    } else {
      revealHeaderButton();
    }
    $dom().emailLabel.textContent = auth.email;
    renderCards(result.designs);
    showState('signedIn');
  } catch (err) {
    showError(`Couldn't load your designs: ${err.message}`);
  } finally {
    refreshing = false;
  }
}

// Lightweight version of refresh() used at page load — runs the probe
// without ever opening the popup. Outcomes:
//   - Should the header button be visible?
//   - Should the model-picker show a "continue a saved design" section?
// Called automatically by init() when signed in.
async function probeForHeaderButton() {
  const auth = getAuth();
  if (!auth) {
    hideHeaderButton();
    renderModelPickerSavedDesigns([], null);
    return;
  }
  try {
    const result = await fetchDesigns(auth);
    if (result.unauthorized) {
      stripAuthFromUrl();
      hideHeaderButton();
      renderModelPickerSavedDesigns([], null);
      return;
    }
    if (result.unavailable) {
      hideHeaderButton();
      renderModelPickerSavedDesigns([], null);
      return;
    }
    const designs = result.designs ?? [];
    if (designs.length > 0) {
      revealHeaderButton();
    } else {
      hideHeaderButton();
    }
    renderModelPickerSavedDesigns(designs, auth);
  } catch (err) {
    // Network error / CORS during local dev. Keep the button hidden — we
    // can't confirm the user has designs, so showing a button that won't
    // work is worse than not showing it.
    console.warn('[my-designs] probe failed:', err);
    hideHeaderButton();
    renderModelPickerSavedDesigns([], null);
  }
}

// Render the user's saved designs into the "Choose a model" interstitial,
// so a returning user can pick up an existing design without going through
// the popup. Hidden when the user has no designs (or isn't signed in).
function renderModelPickerSavedDesigns(designs, auth) {
  const d = $dom();
  if (!d.pickerSection || !d.pickerList) return;
  if (!designs.length || !auth) {
    d.pickerSection.hidden = true;
    d.pickerList.innerHTML = '';
    return;
  }
  d.pickerList.innerHTML = designs.map((design) => `
    <div class="popup_select__saved_item" data-id="${escapeHtml(design.id)}" data-design-url="${escapeHtml(design.design_url)}">
      <div class="popup_select__saved_item_icon" data-zome-type="${escapeHtml(design.zome_type ?? 'unknown')}"></div>
      <button type="button" class="popup_select__saved_item_button">
        <span class="popup_select__saved_item_name">${escapeHtml(design.name)}</span>
        <span class="popup_select__saved_item_meta">
          ${design.zome_type ? escapeHtml(design.zome_type.charAt(0).toUpperCase() + design.zome_type.slice(1)) + ' · ' : ''}Updated ${relativeTime(design.updated_at)}
        </span>
      </button>
    </div>`).join('');
  d.pickerSection.hidden = false;

  // Wire clicks on the cards. The whole card is clickable; we delegate so
  // we can re-render later without rebinding handlers.
  d.pickerList.onclick = (ev) => {
    const item = ev.target.closest('.popup_select__saved_item');
    if (!item) return;
    const url = new URL(item.dataset.designUrl, location.origin);
    url.searchParams.set('design_id', item.dataset.id);
    url.searchParams.set('email', auth.email);
    url.searchParams.set('t', auth.t);
    // Full reload — the configurator initializes from URL params on load.
    location.assign(url.toString());
  };
}

function stripAuthFromUrl() {
  const u = new URL(location.href);
  u.searchParams.delete('email');
  u.searchParams.delete('t');
  u.searchParams.delete('design_id');
  history.replaceState(null, '', u.toString());
}

function open() {
  $dom().overlay.classList.add('active');
  document.body.classList.add('popup-open');
  refresh();
}

function close() {
  $dom().overlay.classList.remove('active');
  document.body.classList.remove('popup-open');
  // Hide any pending "sent confirm" message so re-opens start clean.
  $dom().sentConfirm.hidden = true;
}

async function handleSendLinkSubmit(ev) {
  ev.preventDefault();
  const input = ev.target.querySelector('input[name="email"]');
  const email = input.value.trim();
  if (!email) return;
  // Optimistic: show the "sent" message immediately. Server is intentionally
  // slow-and-silent (~always returns ok) to prevent enumeration.
  $dom().sentConfirm.hidden = false;
  try {
    await postSendLink(email);
  } catch (err) {
    // Network error — log but don't reveal to user (server doesn't either).
    console.warn('[my-designs] send-link failed silently:', err);
  }
  input.value = '';
}

function handleSignOut() {
  stripAuthFromUrl();
  hideHeaderButton();
  close();
}

// ── Toasts ─────────────────────────────────────────────────────────────────

let toastTimeout = null;
function showToast(html, opts = {}) {
  const { timeout = 2500, kind = 'info' } = opts;
  const el = $dom().toast;
  if (!el) return;
  el.className = `my-designs__toast my-designs__toast--${kind}`;
  el.innerHTML = html;
  el.hidden = false;
  // Trigger reflow so the CSS transition catches the show.
  // eslint-disable-next-line no-unused-expressions
  el.offsetHeight;
  el.classList.add('my-designs__toast--show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove('my-designs__toast--show');
    setTimeout(() => { el.hidden = true; }, 300);
  }, timeout);
}

function showSavedToast() {
  showToast('Saved', { timeout: 2000, kind: 'saved' });
}

function showWelcomeBackToast() {
  showToast(
    `Welcome back. Your other designs are in <a href="#" id="my_designs_toast_link">My Saved Designs</a>.`,
    { timeout: 6000, kind: 'welcome-back' }
  );
  // Wire the inline link to open the popup.
  setTimeout(() => {
    const link = document.getElementById('my_designs_toast_link');
    if (link) {
      link.addEventListener('click', (ev) => { ev.preventDefault(); open(); });
    }
  }, 0);
}

// ── Wiring ─────────────────────────────────────────────────────────────────

function init() {
  const d = $dom();
  if (!d.overlay) return; // Markup not on this page; bail safely.

  d.headerBtn?.addEventListener('click', open);
  d.closeBtn?.addEventListener('click', close);
  // Click outside the popup-content (on the overlay) closes it.
  d.overlay.addEventListener('click', (ev) => { if (ev.target === d.overlay) close(); });
  d.signoutBtn?.addEventListener('click', handleSignOut);
  d.sendLinkForm?.addEventListener('submit', handleSendLinkSubmit);
  d.grid?.addEventListener('click', handleGridClick);
  document.addEventListener('click', handleDocClick);
  // Esc closes the popup.
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && d.overlay.classList.contains('active')) close();
  });
}

function bootstrap() {
  init();
  // Probe in the background so the header button only ever appears for
  // signed-in users with at least one design. No spinner, no UI lock —
  // the button just materializes a moment after page load if applicable.
  probeForHeaderButton();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

// ── Public API ─────────────────────────────────────────────────────────────

window.MyDesigns = {
  open,
  close,
  refresh,
  revealHeaderButton,
  hideHeaderButton,
  showSavedToast,
  showWelcomeBackToast,
  // Hook the configurator can register if it can rehydrate from URL params
  // without a full reload. Default behavior is location.reload().
  onOpenDesign: null,
};
