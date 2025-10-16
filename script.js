// js/script.js

function createDetailsButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'detail-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '+ Détails';
  return btn;
}

function createDetailsPanel(text, panelId) {
  const panel = document.createElement('div');
  panel.className = 'detail-panel';
  panel.id = panelId;
  panel.hidden = true;                // cohérence ARIA
  panel.setAttribute('role', 'region');
  panel.textContent = text;
  return panel;
}

// Ferme tous les panneaux ouverts
function closeAllDetails() {
  // Fermer panneaux
  const openPanels = document.getElementsByClassName('detail-panel is-open');
  while (openPanels.length) {
    const panel = openPanels[0];
    panel.hidden = true;
    panel.className = 'detail-panel';
  }
  // Réinitialiser les boutons
  const openButtons = document.getElementsByClassName('detail-toggle is-open');
  while (openButtons.length) {
    const btn = openButtons[0];
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '+ Détails';
    btn.className = 'detail-toggle';
  }
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

      // Si on clique sur un autre élément, on ferme tout d'abord
      closeAllDetails();

      if (!isOpen) {
        // Ouvrir le panneau courant
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = '− Masquer';
        btn.className = 'detail-toggle is-open';

        panel.hidden = false;
        panel.className = 'detail-panel is-open';
      } else {
        // Si on re-clique le même bouton, on laisse tout fermé
        // (déjà fermé par closeAllDetails)
      }
    });
  });
});
