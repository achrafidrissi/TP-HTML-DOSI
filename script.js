// js/script.js

// ---------- Chargement des constantes externes ----------
let CONSTANTS = null;

async function loadConstants() {
  const res = await fetch('constants.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Impossible de charger constants.json');
  CONSTANTS = await res.json();
}

function T() { return (CONSTANTS && CONSTANTS.uiText) || {}; }
function CChart() {
  return (CONSTANTS && CONSTANTS.chart) || { maxLevel: 5, barColor:'#79a7e3', axisColor:'#2a2a2a', gridColor:'#eee' };
}
function skillsData() { return (CONSTANTS && CONSTANTS.skillsRatings) || []; }

function detailsLabel(open) { 
  const txt = T();
  return open ? (txt.detailsOpen || '− Masquer') : (txt.detailsClosed || '+ Détails'); 
}
function noDetailText() { return T().noDetail || 'Aucun détail supplémentaire.'; }

// ---------- Détails (disclosure) ----------
function createDetailsButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'detail-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = detailsLabel(false);
  return btn;
}

function createDetailsPanelFromLi(li, panelId) {
  const text = li.getAttribute('data-detail') || noDetailText();
  const isHtml = li.getAttribute('data-detail-html') === 'true';

  const panel = document.createElement('div');
  panel.className = 'detail-panel';
  panel.id = panelId;
  panel.hidden = true;
  panel.setAttribute('role', 'region');

  if (isHtml) {
    panel.innerHTML = text;
  } else {
    panel.textContent = text;
  }
  return panel;
}

// Ferme tous les panneaux ouverts sans animation (utilisé avant une nouvelle ouverture)
function closeAllDetailsInstant() {
  const openPanels = document.getElementsByClassName('detail-panel is-open');
  while (openPanels.length) {
    const panel = openPanels[0];
    panel.hidden = true;
    panel.className = 'detail-panel';
    panel.style.height = '0px';
    panel.style.paddingTop = '0px';
    panel.style.paddingBottom = '0px';
  }
  const openButtons = document.getElementsByClassName('detail-toggle is-open');
  while (openButtons.length) {
    const btn = openButtons[0];
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = detailsLabel(false);
    btn.className = 'detail-toggle';
  }
}

// Animation utilitaire: ouvre un panneau en augmentant sa hauteur progressivement
function animateOpen(panel, duration = 220) {
  panel.hidden = false;
  panel.className = 'detail-panel is-open';
  panel.style.overflow = 'hidden';

  panel.style.height = '0px';
  panel.style.paddingTop = '';
  panel.style.paddingBottom = '';

  // Force reflow
  panel.offsetHeight;

  const target = panel.scrollHeight;

  const steps = Math.max(10, Math.floor(duration / 16)); // ~60fps
  let current = 0;
  const increment = target / steps;
  const padTopTarget = 10;
  const padBottomTarget = 12;
  const padTopInc = padTopTarget / steps;
  const padBottomInc = padBottomTarget / steps;

  panel.style.paddingTop = '0px';
  panel.style.paddingBottom = '0px';

  const timer = setInterval(() => {
    current += increment;
    const pt = Math.min(padTopTarget, (parseFloat(panel.style.paddingTop) || 0) + padTopInc);
    const pb = Math.min(padBottomTarget, (parseFloat(panel.style.paddingBottom) || 0) + padBottomInc);

    if (current >= target) {
      clearInterval(timer);
      panel.style.height = 'auto';
      panel.style.paddingTop = padTopTarget + 'px';
      panel.style.paddingBottom = padBottomTarget + 'px';
      return;
    }

    panel.style.height = current + 'px';
    panel.style.paddingTop = pt + 'px';
    panel.style.paddingBottom = pb + 'px';
  }, Math.max(10, Math.floor(duration / steps)));
}

// Animation utilitaire: ferme un panneau en réduisant sa hauteur progressivement
function animateClose(panel, duration = 200) {
  const startHeight = panel.scrollHeight;
  const steps = Math.max(10, Math.floor(duration / 16));
  let current = startHeight;
  const decrement = startHeight / steps;

  const padTopStart = parseFloat(panel.style.paddingTop) || 10;
  const padBottomStart = parseFloat(panel.style.paddingBottom) || 12;
  const padTopDec = padTopStart / steps;
  const padBottomDec = padBottomStart / steps;

  panel.style.height = startHeight + 'px';
  panel.style.overflow = 'hidden';

  const timer = setInterval(() => {
    current -= decrement;
    const pt = Math.max(0, (parseFloat(panel.style.paddingTop) || 0) - padTopDec);
    const pb = Math.max(0, (parseFloat(panel.style.paddingBottom) || 0) - padBottomDec);

    if (current <= 0) {
      clearInterval(timer);
      panel.style.height = '0px';
      panel.style.paddingTop = '0px';
      panel.style.paddingBottom = '0px';
      panel.hidden = true;
      panel.className = 'detail-panel';
      return;
    }

    panel.style.height = current + 'px';
    panel.style.paddingTop = pt + 'px';
    panel.style.paddingBottom = pb + 'px';
  }, Math.max(10, Math.floor(duration / steps)));
}

function initDetails() {
  document.querySelectorAll('ul.with-details > li').forEach((li, index) => {
    const panelId = `detail-panel-${index}-${Math.random().toString(36).slice(2)}`;

    const btn = createDetailsButton();
    btn.setAttribute('aria-controls', panelId);

    const panel = createDetailsPanelFromLi(li, panelId);

    const btnWrapper = document.createElement('span');
    btnWrapper.className = 'detail-btn-wrapper';
    btnWrapper.appendChild(btn);

    li.appendChild(btnWrapper);
    li.insertAdjacentElement('afterend', panel);

    btn.addEventListener('click', () => {
      const isOpen = btn.className.includes('is-open');

      const openPanel = document.querySelector('.detail-panel.is-open');
      const openBtn = document.querySelector('.detail-toggle.is-open');
      if (openPanel && openPanel !== panel) {
        if (openBtn) {
          openBtn.setAttribute('aria-expanded', 'false');
          openBtn.textContent = detailsLabel(false);
          openBtn.className = 'detail-toggle';
        }
        animateClose(openPanel);
      }

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = detailsLabel(true);
        btn.className = 'detail-toggle is-open';
        animateOpen(panel);
      } else {
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = detailsLabel(false);
        btn.className = 'detail-toggle';
        animateClose(panel);
      }
    });
  });
}

// ---------- Tooltips (suivi curseur) ----------
function ensureTooltipBubble() {
  let bubble = document.getElementById('tooltip-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'tooltip-bubble';
    bubble.className = 'tooltip-bubble';
    bubble.setAttribute('role','tooltip');
    document.body.appendChild(bubble);
  }
  return bubble;
}

function positionTooltipAtCursor(bubble, evt, offset = { x: 14, y: 16 }) {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;

  let left = evt.clientX + scrollX + offset.x;
  let top  = evt.clientY + scrollY + offset.y;

  bubble.style.left = '0px';
  bubble.style.top = '-9999px';
  const rect = bubble.getBoundingClientRect();

  const margin = 8;
  const maxLeft = scrollX + window.innerWidth - rect.width - margin;
  const maxTop  = scrollY + window.innerHeight - rect.height - margin;
  left = Math.min(Math.max(left, scrollX + margin), maxLeft);
  top  = Math.min(Math.max(top,  scrollY + margin), maxTop);

  bubble.style.left = `${left}px`;
  bubble.style.top  = `${top}px`;
}

function attachSkillTooltipsFollowCursor() {
  const bubble = ensureTooltipBubble();
  const skillItems = document.querySelectorAll('.skills-with-tooltips dt[data-tooltip], .skills-with-tooltips dd[data-tooltip]');

  // Accessibilité clavier
  skillItems.forEach(el => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('aria-describedby', 'tooltip-bubble');
  });

  function showTooltipFor(el) {
    const content = el.getAttribute('data-tooltip');
    if (!content) return;
    bubble.textContent = content;
    bubble.classList.add('is-visible');
  }

  function hideTooltip() {
    bubble.classList.remove('is-visible');
  }

  skillItems.forEach(el => {
    // Souris
    el.addEventListener('mouseenter', () => showTooltipFor(el));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('mousemove', (evt) => {
      if (bubble.classList.contains('is-visible')) {
        positionTooltipAtCursor(bubble, evt);
      }
    });

    // Clavier (positionner près du centre de l’élément focusé)
    el.addEventListener('focus', () => {
      showTooltipFor(el);
      const rect = el.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.bottom
      };
      positionTooltipAtCursor(bubble, fakeEvent);
    });
    el.addEventListener('blur', hideTooltip);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideTooltip();
    });
  });

  // Recalage sur scroll/resize si visible et focus sur un item
  window.addEventListener('scroll', () => {
    if (!bubble.classList.contains('is-visible')) return;
    const el = document.activeElement && document.activeElement.matches('.skills-with-tooltips [data-tooltip]')
      ? document.activeElement
      : null;
    if (el) {
      const rect = el.getBoundingClientRect();
      const fakeEvent = { clientX: rect.left + rect.width / 2, clientY: rect.bottom };
      positionTooltipAtCursor(bubble, fakeEvent);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!bubble.classList.contains('is-visible')) return;
    const el = document.activeElement && document.activeElement.matches('.skills-with-tooltips [data-tooltip]')
      ? document.activeElement
      : null;
    if (el) {
      const rect = el.getBoundingClientRect();
      const fakeEvent = { clientX: rect.left + rect.width / 2, clientY: rect.bottom };
      positionTooltipAtCursor(bubble, fakeEvent);
    }
  });
}

// ---------- Tooltips (position sous la cible) ----------
function positionTooltip(bubble, target) {
  const rect = target.getBoundingClientRect();
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;

  const top = rect.bottom + scrollY + 8;
  const left = rect.left + scrollX + 0;

  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;

  const bubbleRect = bubble.getBoundingClientRect();
  const overflowRight = (bubbleRect.right - window.innerWidth);
  if (overflowRight > 0) {
    bubble.style.left = `${left - overflowRight - 12}px`;
  }

  const arrowLeft = Math.max(12, rect.left + 16 - (parseFloat(bubble.style.left) - scrollX));
  bubble.style.setProperty('--arrow-left', `${arrowLeft}px`);
}

function attachSkillTooltips() {
  const bubble = ensureTooltipBubble();
  const skillItems = document.querySelectorAll('.skills-with-tooltips dt[data-tooltip], .skills-with-tooltips dd[data-tooltip]');

  // Focusable clavier
  skillItems.forEach(el => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('aria-describedby', 'tooltip-bubble');
  });

  function showTooltipFor(el) {
    const content = el.getAttribute('data-tooltip');
    if (!content) return;

    bubble.innerText = content;
    bubble.classList.add('is-visible');
    positionTooltip(bubble, el);
  }

  function hideTooltip() {
    bubble.classList.remove('is-visible');
  }

  // Souris
  skillItems.forEach(el => {
    el.addEventListener('mouseenter', () => showTooltipFor(el));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('mousemove', () => positionTooltip(bubble, el));
  });

  // Clavier
  skillItems.forEach(el => {
    el.addEventListener('focus', () => showTooltipFor(el));
    el.addEventListener('blur', hideTooltip);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideTooltip();
    });
  });

  // Repositionnement à scroll/resize
  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('is-visible')) {
      const active = document.activeElement && document.activeElement.hasAttribute('data-tooltip') 
        ? document.activeElement 
        : document.querySelector('.skills-with-tooltips [data-tooltip]:hover');
      if (active) positionTooltip(bubble, active);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (bubble.classList.contains('is-visible')) {
      const active = document.activeElement && document.activeElement.hasAttribute('data-tooltip') 
        ? document.activeElement 
        : document.querySelector('.skills-with-tooltips [data-tooltip]:hover');
      if (active) positionTooltip(bubble, active);
    }
  });
}

// ---------- Ratings (étoiles) ----------
function createStars(level) {
  const wrap = document.createElement('span');
  wrap.className = 'rating-stars';
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', `${level} sur 5`);
  wrap.title = `${level}/5`;

  for (let i = 1; i <= 5; i++) {
    const icon = document.createElement('i');
    icon.className = i <= level ? 'fa fa-star filled' : 'fa fa-star-o';
    wrap.appendChild(icon);
  }
  return wrap;
}

function createRatingRow(name, level) {
  const row = document.createElement('div');
  row.className = 'rating-row';
  row.setAttribute('data-skill', name);
  row.setAttribute('data-level', String(level));

  const label = document.createElement('div');
  label.className = 'rating-label';
  label.textContent = name;

  row.appendChild(label);
  row.appendChild(createStars(Math.max(1, Math.min(5, Number(level) || 1))));
  return row;
}

function renderSkillsRatings() {
  const mount = document.getElementById('skills-rating');
  if (!mount) return;
  mount.innerHTML = '';
  const data = skillsData();
  data.forEach(s => mount.appendChild(createRatingRow(s.name, s.level)));
}

// ---------- Histogramme Canvas 2D ----------
function renderCanvasHistogram() {
  const canvas = document.getElementById('chart-canvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;

  const cssWidth = canvas.clientWidth || canvas.width;
  const cssHeight = canvas.clientHeight || canvas.height;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cfg = CChart();

  const P = { top: 16, right: 12, bottom: 44, left: 32 };
  const W = cssWidth - P.left - P.right;
  const H = cssHeight - P.top - P.bottom;
  const MAX = cfg.maxLevel || 5;

  // Fond
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  // Axes
  ctx.strokeStyle = cfg.axisColor || '#2a2a2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(P.left, P.top);
  ctx.lineTo(P.left, P.top + H);
  ctx.lineTo(P.left + W, P.top + H);
  ctx.stroke();

  // Grille horizontale (1..MAX)
  ctx.strokeStyle = cfg.gridColor || '#eee';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let v = 1; v <= MAX; v++) {
    const y = P.top + H - (v / MAX) * H;
    ctx.beginPath();
    ctx.moveTo(P.left, y);
    ctx.lineTo(P.left + W, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Barres
  const data = skillsData();
  const n = data.length;
  const gap = 10;
  const barW = Math.max(24, (W - gap * (n - 1)) / n);

  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  data.forEach((s, i) => {
    const level = Math.max(1, Math.min(MAX, Number(s.level) || 1));
    const x = P.left + i * (barW + gap);
    const h = (level / MAX) * H;
    const y = P.top + H - h;

    ctx.fillStyle = cfg.barColor || '#79a7e3';
    ctx.fillRect(x, y, barW, h);

    ctx.fillStyle = '#333';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(String(level), x + barW / 2, y - 6);

    ctx.textBaseline = 'top';
    ctx.fillStyle = '#555';
    const label = s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name;
    ctx.fillText(label, x + barW / 2, P.top + H + 8);
  });
}

window.addEventListener('resize', renderCanvasHistogram);

// ---------- Initialisation globale ----------
document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    try {
      await loadConstants();
    } catch (e) {
      console.error(e);
    }

    // Initialiser modules (libellés et données prêtes)
    initDetails();
    attachSkillTooltipsFollowCursor();
    attachSkillTooltips();
    renderSkillsRatings();
    renderCanvasHistogram();
  })();
});
