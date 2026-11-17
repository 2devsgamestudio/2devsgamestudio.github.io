/* ═══════════════════════════════════════════════════════════════════════
   2Devs Game Studio — Interactive Controls
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const PARODY_TITLES = [
    {
      title: 'Call of Doody',
      genre: 'Action',
      filter: 'action',
      rating: 4,
      price: 60,
      image: 'assets/covers/call-of-doody.png',
      description: 'Fight through a globe-spanning campaign where every mission reshapes the balance of power.'
    },
    {
      title: 'Door Infernal',
      genre: 'Action',
      filter: 'action',
      rating: 5,
      price: 80,
      image: 'assets/covers/door-infernal.png',
      description: 'Rip through demonic legions across hellish arenas with an arsenal of brutal weapons.'
    },
    {
      title: 'Kittenfall 2',
      genre: 'Action',
      filter: 'action',
      rating: 4,
      price: 60,
      image: 'assets/covers/kittenfall-2.png',
      description: 'Pilot a towering mech alongside a nimble pilot in fast, vertical firefights.'
    },
    {
      title: 'Shelf-Life 2',
      genre: 'Action',
      filter: 'action',
      rating: 5,
      price: 80,
      image: 'assets/covers/shelf-life-2.png',
      description: 'Resist an oppressive regime through physics-driven puzzles and desperate firefights.'
    },
    {
      title: 'God of Wall',
      genre: 'Action',
      filter: 'action',
      rating: 5,
      price: 80,
      image: 'assets/covers/god-of-wall.png',
      description: 'Rage across mythic realms as a vengeful warrior facing gods and monsters.'
    },
    {
      title: 'The Snitcher 3',
      genre: 'RPG',
      filter: 'rpg',
      rating: 5,
      price: 80,
      image: 'assets/covers/the-snitcher-3.png',
      description: 'Hunt monsters and shape the fate of kingdoms as a professional beast slayer.'
    },
    {
      title: 'The Older Scroll V',
      genre: 'RPG',
      filter: 'rpg',
      rating: 5,
      price: 80,
      image: 'assets/covers/the-older-scroll-v.png',
      description: 'Explore a frozen province filled with dragons, factions, and endless quests.'
    },
    {
      title: 'The Shrimps',
      genre: 'Simulation',
      filter: 'simulation',
      rating: 5,
      price: 80,
      image: 'assets/covers/the-shrimps.png',
      description: 'Build homes and steer the daily lives of simulated people.'
    },
    {
      title: 'President Evil',
      genre: 'Horror',
      filter: 'horror',
      rating: 5,
      price: 80,
      image: 'assets/covers/president-evil.png',
      description: 'Escape a mansion overrun by biohazard monsters with scarce ammo.'
    },
    {
      title: 'Dark Bowls',
      genre: 'Souls',
      filter: 'souls-mmo',
      rating: 5,
      price: 80,
      image: 'assets/covers/dark-bowls.png',
      description: 'Persevere through a dying world where every death teaches a lesson.'
    },
    {
      title: 'Whirled of Wart-Craft',
      genre: 'MMO',
      filter: 'souls-mmo',
      rating: 5,
      price: 80,
      image: 'assets/covers/whirled-of-wart-craft.png',
      description: 'Quest, raid, and explore a vast persistent fantasy realm.'
    },
    {
      title: 'Feefa',
      genre: 'Sports',
      filter: 'sports',
      rating: 5,
      price: 80,
      image: 'assets/covers/feefa.png',
      description: "Manage and play as the world's greatest football clubs and national teams."
    }
  ];

  // ─── LIGHTBOX DIALOG (light-dismiss-a-dialog) ────────────────────────
  const lightbox = document.getElementById('media-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close');

  function openLightbox({ src, title, caption, width, height }) {
    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxCaption) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (width && height) {
      lightboxImg.width = width;
      lightboxImg.height = height;
    } else {
      lightboxImg.removeAttribute('width');
      lightboxImg.removeAttribute('height');
    }
    lightboxTitle.textContent = title;
    lightboxCaption.textContent = caption || '';
    lightbox.showModal();
  }

  if (lightbox) {
    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', () => lightbox.close());
    }

    // Fallback for browsers without declarative <dialog closedby="any"> support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      lightbox.addEventListener('click', (event) => {
        if (event.target !== lightbox) return;

        const rect = lightbox.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (isDialogContent) return;
        lightbox.close();
      });
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-lightbox-src]');
      if (!trigger) return;
      openLightbox({
        src: trigger.dataset.lightboxSrc,
        title: trigger.dataset.lightboxTitle || 'Gaming Lounge Simulator',
        caption: trigger.dataset.lightboxCaption || '',
        width: trigger.dataset.lightboxWidth ? Number(trigger.dataset.lightboxWidth) : undefined,
        height: trigger.dataset.lightboxHeight ? Number(trigger.dataset.lightboxHeight) : undefined
      });
    });
  }

  // ─── SHOP TERMINAL TABS (tabs guide: focusgroup + hidden="until-found") ─
  const tablist = document.querySelector('.terminal-tablist');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('.terminal-panel[role="tabpanel"]'));
    const panelByTabId = new Map(
      panels.map((panel) => [panel.getAttribute('aria-labelledby'), panel])
    );
    const supportsFocusGroup = Object.hasOwn(HTMLElement.prototype, 'focusGroup');

    function selectTab(selectedTab, { scrollIntoView = true } = {}) {
      for (const tab of tabs) {
        const isSelected = tab === selectedTab;
        tab.ariaSelected = String(isSelected);
        tab.toggleAttribute('focusgroupstart', isSelected);
        if (!supportsFocusGroup) {
          tab.tabIndex = isSelected ? 0 : -1;
        }

        const panel = panelByTabId.get(tab.id);
        if (!panel) continue;

        if (isSelected) {
          panel.removeAttribute('hidden');
          panel.tabIndex = 0;
        } else {
          panel.hidden = 'until-found';
          panel.removeAttribute('tabindex');
        }
      }

      if (scrollIntoView) {
        selectedTab.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          container: 'nearest'
        });
      }
    }

    // Initialize roving tabindex when focusgroup is unsupported
    if (!supportsFocusGroup) {
      const initial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      tabs.forEach((tab) => {
        tab.tabIndex = tab === initial ? 0 : -1;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));

      // Selection follows focus
      tab.addEventListener('focus', () => selectTab(tab));

      // Keyboard arrow fallback for browsers without native focusgroup
      if (!supportsFocusGroup) {
        tab.addEventListener('keydown', (event) => {
          let nextIndex = null;
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = tabs.length - 1;

          if (nextIndex !== null) {
            event.preventDefault();
            tabs[nextIndex].focus();
          }
        });
      }
    });

    // Sync tab selection when find-in-page reveals a hidden="until-found" panel
    panels.forEach((panel) => {
      panel.addEventListener('beforematch', () => {
        const matchingTab = tabs.find((t) => t.id === panel.getAttribute('aria-labelledby'));
        if (matchingTab) {
          selectTab(matchingTab);
        }
      });
    });
  }

  // ─── PAUSEABLE GENRE SIGN REEL (motion guide: WCAG 2.2.2) ─────────────
  const reelTrack = document.getElementById('reel-track');
  const reelToggle = document.getElementById('reel-toggle');
  if (reelTrack && reelToggle) {
    let isPaused = false;
    reelToggle.addEventListener('click', () => {
      isPaused = !isPaused;
      reelTrack.classList.toggle('is-paused', isPaused);
      reelToggle.textContent = isPaused ? 'Play Reel' : 'Pause Reel';
    });
  }

  // ─── PARODY GAME COVER GRID & GENRE FILTER ───────────────────────────
  const coversGrid = document.getElementById('covers-grid');
  const filterButtons = Array.from(document.querySelectorAll('.filter-pill[data-filter]'));

  function renderCovers(filterKey) {
    if (!coversGrid) return;
    const filtered = filterKey === 'all'
      ? PARODY_TITLES
      : PARODY_TITLES.filter((item) => item.filter === filterKey);

    const fragment = document.createDocumentFragment();

    filtered.forEach((game) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'cover-card';
      card.dataset.lightboxSrc = game.image;
      card.dataset.lightboxTitle = `${game.title} (${game.genre} · $${game.price})`;
      card.dataset.lightboxCaption = `${game.description} — Full physical case wrap-around artwork (front, spine & back).`;
      card.dataset.lightboxWidth = '1262';
      card.dataset.lightboxHeight = '848';

      const artWrap = document.createElement('div');
      artWrap.className = 'cover-art-wrap';

      const img = document.createElement('img');
      img.src = game.image;
      img.alt = `${game.title} parody game box art`;
      img.width = 1262;
      img.height = 848;
      img.loading = 'lazy';

      const priceBadge = document.createElement('span');
      priceBadge.className = 'cover-price';
      priceBadge.textContent = `$${game.price}`;

      artWrap.append(img, priceBadge);

      const body = document.createElement('div');
      body.className = 'cover-body';

      const genreRow = document.createElement('div');
      genreRow.className = 'cover-genre-row';

      const genreEl = document.createElement('span');
      genreEl.className = 'cover-genre';
      genreEl.textContent = game.genre;

      const ratingEl = document.createElement('span');
      ratingEl.className = 'cover-rating';
      ratingEl.setAttribute('aria-label', `Rated ${game.rating} out of 5 stars`);
      ratingEl.textContent = '★'.repeat(game.rating);

      genreRow.append(genreEl, ratingEl);

      const titleEl = document.createElement('h3');
      titleEl.className = 'cover-title';
      titleEl.textContent = game.title;

      const descEl = document.createElement('p');
      descEl.className = 'cover-desc';
      descEl.textContent = game.description;

      body.append(genreRow, titleEl, descEl);
      card.append(artWrap, body);
      fragment.appendChild(card);
    });

    coversGrid.replaceChildren(fragment);
  }

  if (coversGrid) {
    renderCovers('all');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterKey = btn.dataset.filter || 'all';
        filterButtons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderCovers(filterKey);
      });
    });
  }
})();
