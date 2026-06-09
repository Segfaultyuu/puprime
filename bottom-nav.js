/**
 * VT Bottom Nav — global script.
 *
 * Usage: include <script src="bottom-nav.js" defer></script> on any page that
 * has a `.phone` container (or any element marked `data-bottom-nav`). The
 * script self-injects styles + markup and wires up click-to-activate behaviour.
 *
 * Design: VT-demo Figma node 121:20467
 */
(function () {
  'use strict';

  // ─── ICONS (20x20) ─────────────────────────────────────────────────────
  const ICONS = {
    home: `
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8.2L10 2.5L17 8.2V16.5C17 17.05 16.55 17.5 16 17.5H12.8V12.5H7.2V17.5H4C3.45 17.5 3 17.05 3 16.5V8.2Z" fill="currentColor"/>
      </svg>`,
    markets: `
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 14.5L8 9.5L11.5 12L17 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.5 6H17V10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    promo: `
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6.5" width="14" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/>
        <rect x="4" y="9.5" width="12" height="7.5" rx="1" stroke="currentColor" stroke-width="1.5"/>
        <path d="M10 6.5V17" stroke="currentColor" stroke-width="1.5"/>
        <path d="M10 6.5C8.5 6.5 6.5 5.5 6.5 4.25C6.5 3.5 7 3 7.75 3C9.25 3 10 6.5 10 6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M10 6.5C11.5 6.5 13.5 5.5 13.5 4.25C13.5 3.5 13 3 12.25 3C10.75 3 10 6.5 10 6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
    funds: `
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M14 11.5C14.55 11.5 15 11.05 15 10.5C15 9.95 14.55 9.5 14 9.5C13.45 9.5 13 9.95 13 10.5C13 11.05 13.45 11.5 14 11.5Z" fill="currentColor"/>
        <path d="M2.5 8H17.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    trade: `
      <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 9H20L17 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 17H6L9 20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
  };

  // ─── TAB CONFIG ────────────────────────────────────────────────────────
  const TABS = [
    { id: 'home',    label: 'Home',    icon: ICONS.home,    active: true },
    { id: 'markets', label: 'Markets', icon: ICONS.markets },
    { id: 'trade',   label: 'Trade',   icon: ICONS.trade, center: true },
    { id: 'promo',   label: 'Promo',   icon: ICONS.promo },
    { id: 'funds',   label: 'Funds',   icon: ICONS.funds },
  ];

  // ─── STYLES ────────────────────────────────────────────────────────────
  // Layout: outer wrapper = 117px (83 nav + 34 iOS home-indicator).
  // The center Trade FAB pokes 16px above the bar via negative margin.
  const STYLE = `
.vt-bottom-nav-wrap {
  width: 393px;
  position: sticky;
  bottom: 0;
  font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  z-index: 100;
  isolation: isolate;
}
.vt-bottom-nav {
  width: 100%;
  height: 83px;
  background: #000;
  border-top: 0.5px solid #28272e;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.35);
  display: flex;
  align-items: stretch;
  padding: 0;
  position: relative;
}
.vt-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  padding-top: 16px;
  cursor: pointer;
  user-select: none;
  position: relative;
}
.vt-tab-icon {
  width: 20px;
  height: 20px;
  color: #a0a3a7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vt-tab-icon svg { width: 20px; height: 20px; display: block; }
.vt-tab-label {
  font-size: 10px;
  line-height: normal;
  color: #a0a3a7;
  font-weight: 400;
}
.vt-tab.active .vt-tab-icon { color: #006bff; }
.vt-tab.active .vt-tab-label { color: #006bff; }

/* center FAB — uses the same icon-slot rhythm as siblings, so the
   "Trade" label aligns horizontally with the other tab labels.
   The FAB is absolutely positioned within a 20×20 slot and shifted
   upward so it pokes ~16px above the bar. */
.vt-fab-slot {
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vt-fab {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(-18px);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%),
    radial-gradient(circle at 70% 80%, rgba(0,107,255,0.45) 0%, rgba(0,107,255,0) 60%),
    linear-gradient(135deg, rgba(0,107,255,0.65) 0%, rgba(8,22,68,0.7) 100%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow:
    0 1px 0 0 rgba(255,255,255,0.45) inset,
    0 -1px 0 0 rgba(0,0,0,0.25) inset,
    0 0 0 1px rgba(255,255,255,0.18) inset,
    0 6px 18px rgba(0,107,255,0.45),
    0 2px 4px rgba(0,0,0,0.35);
}
/* animated rotating conic ring */
.vt-fab::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: conic-gradient(
    from 0deg,
    rgba(0,107,255,0) 0deg,
    rgba(0,107,255,1) 60deg,
    rgba(160,200,255,1) 90deg,
    rgba(0,107,255,0) 160deg,
    rgba(0,107,255,0) 220deg,
    rgba(60,140,255,0.9) 280deg,
    rgba(255,255,255,0.95) 320deg,
    rgba(0,107,255,0) 360deg);
  -webkit-mask:
    linear-gradient(#000, #000) content-box,
    linear-gradient(#000, #000);
  mask:
    linear-gradient(#000, #000) content-box,
    linear-gradient(#000, #000);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  filter: drop-shadow(0 0 4px rgba(0,107,255,0.6));
  animation: vt-fab-spin 2.6s linear infinite;
  pointer-events: none;
}
/* top inner gloss */
.vt-fab::after {
  content: '';
  position: absolute;
  top: 3px; left: 6px; right: 6px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0));
  pointer-events: none;
  filter: blur(0.5px);
}
.vt-fab svg { width: 24px; height: 24px; position: relative; z-index: 1; }
.vt-fab svg path { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35)); }
@keyframes vt-fab-spin {
  to { transform: rotate(360deg); }
}

/* iOS home indicator — its OWN row below the nav bar */
.vt-home-indicator-area {
  width: 100%;
  height: 34px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vt-home-indicator {
  width: 139px;
  height: 5px;
  border-radius: 100px;
  background: #fff;
  pointer-events: none;
}

/* notification dot (used on Markets tab in some layouts) */
.vt-tab .vt-dot {
  position: absolute;
  top: 14px;
  right: calc(50% - 16px);
  width: 5px;
  height: 5px;
  background: #ff4757;
  border-radius: 50%;
}
`;

  // ─── MARKUP ────────────────────────────────────────────────────────────
  function buildTabs() {
    return TABS.map(t => {
      const cls = ['vt-tab'];
      if (t.active) cls.push('active');
      if (t.center) cls.push('vt-tab-center');
      const iconWrap = t.center
        ? `<div class="vt-fab-slot"><div class="vt-fab">${t.icon}</div></div>`
        : `<div class="vt-tab-icon">${t.icon}</div>`;
      return `
        <div class="${cls.join(' ')}" data-tab="${t.id}">
          ${iconWrap}
          <span class="vt-tab-label">${t.label}</span>
        </div>`;
    }).join('');
  }

  // ─── INIT ──────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('vt-bottom-nav-style')) return;

    const style = document.createElement('style');
    style.id = 'vt-bottom-nav-style';
    style.textContent = STYLE;
    document.head.appendChild(style);

    document.querySelectorAll('.bottom-nav, .vt-bottom-nav-wrap, [data-bottom-nav]').forEach(el => el.remove());

    const wrap = document.createElement('div');
    wrap.className = 'vt-bottom-nav-wrap';
    wrap.innerHTML = `
      <div class="vt-bottom-nav">${buildTabs()}</div>
      <div class="vt-home-indicator-area"><div class="vt-home-indicator"></div></div>
    `;

    const mount = document.querySelector('.phone') || document.body;
    mount.appendChild(wrap);

    const ROUTES = {
      home:    'home.html',
      markets: 'markets.html',
      trade:   'trade.html',
      promo:   'promo.html',
      funds:   'funds.html',
    };
    wrap.addEventListener('click', e => {
      const tab = e.target.closest('.vt-tab');
      if (!tab) return;
      wrap.querySelectorAll('.vt-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      wrap.dispatchEvent(new CustomEvent('vt-tab-change', {
        detail: { id: tab.dataset.tab },
        bubbles: true,
      }));
      const dest = ROUTES[tab.dataset.tab];
      if (dest) {
        const here = location.pathname.split('/').pop() || 'home.html';
        if (here !== dest) location.href = dest;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
