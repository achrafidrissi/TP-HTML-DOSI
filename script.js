// js/script.js

function createDetailsButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'detail-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '+ Détails';
  return btn;
}

function createDetailsPanelFromLi(li, panelId) {
  const text = li.getAttribute('data-detail') || 'Aucun détail supplémentaire.';
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('ul.with-details > li').forEach((li, index) => {
    const panelId = `detail-panel-${index}-${Math.random().toString(36).slice(2)}`;

    const btn = createDetailsButton();
    btn.setAttribute('aria-controls', panelId);

    // Utilise la nouvelle fabrique de panneau
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
          openBtn.textContent = '+ Détails';
          openBtn.className = 'detail-toggle';
        }
        animateClose(openPanel);
      }

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = '− Masquer';
        btn.className = 'detail-toggle is-open';
        animateOpen(panel);
      } else {
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '+ Détails';
        btn.className = 'detail-toggle';
        animateClose(panel);
      }
    });
  });
});

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
    btn.textContent = '+ Détails';
    btn.className = 'detail-toggle';
  }
}

// Animation utilitaire: ouvre un panneau en augmentant sa hauteur progressivement
function animateOpen(panel, duration = 220) {
  panel.hidden = false;
  panel.className = 'detail-panel is-open';
  panel.style.overflow = 'hidden';

  // Définit un point de départ propre
  panel.style.height = '0px';
  panel.style.paddingTop = '';
  panel.style.paddingBottom = '';

  // Force un reflow pour que height=0 soit pris en compte
  // eslint-disable-next-line no-unused-expressions
  panel.offsetHeight;

  // Mesure la hauteur cible
  const target = panel.scrollHeight;

  const steps = Math.max(10, Math.floor(duration / 16)); // environ 60fps
  let current = 0;
  const increment = target / steps;
  const padTopStart = 0;
  const padBottomStart = 0;
  // Si vous souhaitez aussi animer le padding, définissez une cible (ex. 10px/12px)
  const padTopTarget = 10;
  const padBottomTarget = 12;
  const padTopInc = padTopTarget / steps;
  const padBottomInc = padBottomTarget / steps;

  panel.style.paddingTop = padTopStart + 'px';
  panel.style.paddingBottom = padBottomStart + 'px';

  const timer = setInterval(() => {
    current += increment;
    const pt = Math.min(padTopTarget, (parseFloat(panel.style.paddingTop) || 0) + padTopInc);
    const pb = Math.min(padBottomTarget, (parseFloat(panel.style.paddingBottom) || 0) + padBottomInc);

    if (current >= target) {
      clearInterval(timer);
      // Fin d’animation: fixer sur auto pour s’adapter aux contenus dynamiques
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
  // Mesure hauteur actuelle (si auto, on force la valeur pixel courante)
  const startHeight = panel.scrollHeight;
  const steps = Math.max(10, Math.floor(duration / 16));
  let current = startHeight;
  const decrement = startHeight / steps;

  // Définir padding de départ et cibles pour replier
  const padTopStart = parseFloat(panel.style.paddingTop) || 10;
  const padBottomStart = parseFloat(panel.style.paddingBottom) || 12;
  const padTopDec = padTopStart / steps;
  const padBottomDec = padBottomStart / steps;

  // Fixe height en pixels pour la transition
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('ul.with-details > li').forEach((li, index) => {
    const detailText = li.getAttribute('data-detail') || 'Aucun détail supplémentaire.';
    const panelId = `detail-panel-${index}-${Math.random().toString(36).slice(2)}`;

    const btn = createDetailsButton();
    btn.setAttribute('aria-controls', panelId);

    const panel = createDetailsPanel(detailText, panelId);

    const btnWrapper = document.createElement('span');
    btnWrapper.className = 'detail-btn-wrapper';
    btnWrapper.appendChild(btn);

    li.appendChild(btnWrapper);
    li.insertAdjacentElement('afterend', panel);

    btn.addEventListener('click', () => {
      const isOpen = btn.className.includes('is-open');

      // Si on clique un autre item: fermer l’ouvert avec animation
      const openPanel = document.querySelector('.detail-panel.is-open');
      const openBtn = document.querySelector('.detail-toggle.is-open');
      if (openPanel && openPanel !== panel) {
        if (openBtn) {
          openBtn.setAttribute('aria-expanded', 'false');
          openBtn.textContent = '+ Détails';
          openBtn.className = 'detail-toggle';
        }
        animateClose(openPanel);
      }

      if (!isOpen) {
        // Ouvrir celui-ci
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = '− Masquer';
        btn.className = 'detail-toggle is-open';
        animateOpen(panel);
      } else {
        // Fermer si on re-clique le même
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '+ Détails';
        btn.className = 'detail-toggle';
        animateClose(panel);
      }
    });
  });
});
