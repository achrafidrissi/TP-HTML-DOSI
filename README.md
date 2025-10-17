# CV HTML5 — ubo-resume

CV web en HTML5, accessible et responsive, avec micro‑données schema.org, interactions JavaScript légères et thème visuel moderne “doux”.

**Lien en ligne :**  
[https://achrafidrissi.github.io/TP-HTML-DOSI/ubo-resume.html](https://achrafidrissi.github.io/TP-HTML-DOSI/ubo-resume.html)

---

## Sommaire
- [Description](#description)
- [Points clés](#points-clés)
- [Structure du projet](#structure-du-projet)
- [Installation locale](#installation-locale)
- [Configuration via JSON](#configuration-via-json)
- [Scripts et fonctionnalités](#scripts-et-fonctionnalités)
- [Accessibilité](#accessibilité)
- [Déploiement](#déploiement)
- [Roadmap](#roadmap)
- [Licence](#licence)

---

## Description

Ce projet expose un CV moderne en HTML/CSS/JS avec :
- Balisage sémantique et micro‑données Person/PostalAddress ([schema.org](http://schema.org)) pour SEO et lisibilité par les parseurs de CV.
- Composants interactifs progressifs (tooltips, panneaux “+ Détails”, auto‑évaluation par étoiles, histogramme sur canvas).
- Refonte visuelle “gentille” : palettes douces, cartes, coins arrondis, ombres légères, responsive mobile‑first.

---

## Points clés

- Micro‑données pour nom, poste, contact, adresse, liens (LinkedIn, portfolio).
- Accessibilité améliorée : focus visibles, aria‑expanded/controls pour les panneaux, canvas avec aria-labelledby/aria-describedby et texte sr-only.
- Thème modulaire : variables CSS pour couleurs, rayons, ombres.
- Constantes externes : compétences, libellés UI, styles du graphe dans `data/constants.json` (modifiables sans toucher au JS).

---

## Structure du projet

- `ubo-resume.html` — page principale du CV
- `css/resume.css` — styles de base et thème visuel
- `css/responsive.css` — ajustements responsive
- `js/script.js` — interactions JS (détails, tooltips, étoiles, histogramme, chargement JSON)
- `data/constants.json` — source pour compétences, libellés et style du graphe
- `img/` — photo de profil et assets éventuels

---

## Installation locale

**Prérequis :**
- Navigateur moderne
- Serveur statique local (recommandé) pour charger le JSON sans erreurs CORS

**Étapes :**
1. Cloner le dépôt.
2. Lancer un serveur statique à la racine (`npx serve .` ou extension Live Server).
3. Ouvrir `/ubo-resume.html`.

> ⚠️ L’ouverture directe en `file://` peut empêcher le chargement du JSON. Privilégier un serveur local.

---

## Configuration via JSON

Éditer `data/constants.json` pour ajuster :
- **Compétences et niveaux** (1..5) pour les étoiles et l’histogramme :
    ```
    "skillsRatings": [ { "name": "AWS", "level": 5 }, ... ]
    ```
- **Libellés UI** :
    ```
    "uiText": { "detailsOpen": "− Masquer", "detailsClosed": "+ Détails", "noDetail": "Aucun détail supplémentaire." }
    ```
- **Style du graphe** :
    ```
    "chart": { "barColor": "#79a7e3", "axisColor": "#2a2a2a", "gridColor": "#eee", "maxLevel": 5 }
    ```

Aucune modification du JS n’est requise ; un simple refresh applique les changements.

---

## Scripts et fonctionnalités

- **Panneaux “+ Détails”** : bouton accessible avec aria-expanded/aria-controls, animation ouverture/fermeture, fermeture automatique si un autre panneau est ouvert.
- **Tooltips compétences** : bulle réutilisable avec `role="tooltip"`, navigation au clavier, positionnement stable.
- **Auto‑évaluation** : étoiles dynamiques selon `data/constants.json`.
- **Histogramme canvas** : rendu 2D responsive, axes, couleurs configurables via JSON.

Bonne gestion des événements, états ARIA cohérents et initialisation du rendu uniquement après le chargement du JSON.

---

## Accessibilité

- Attributs ARIA : aria-expanded, aria-controls, `role="img"` et liens `aria-labelledby/aria-describedby` reliés à un titre/descriptif sr-only
- Focus visibles, navigation clavier sur tous les éléments interactifs
- Résumé textuel de l’histogramme pour lecteurs d’écran

---

## Déploiement

**GitHub Pages :**
1. Pousser sur la branche principale.
2. Activer GitHub Pages (branche et dossier racine).
3. Accéder à l’URL fournie.

> Vérifiez que `data/constants.json` est bien servi et que les chemins sont corrects.

---

## Roadmap

- Section projets optionnelle avec cartes et tags
- Export PDF via CSS print
- Thème sombre/clair automatique
- Résumé automatique du graphe sous le canvas

---

## Licence

Projet fourni à des fins académiques/personnelles. Adapter la licence selon vos besoins (type MIT recommandé).

---
