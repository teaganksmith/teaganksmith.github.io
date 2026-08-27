/* ============================================================
   filter.js — Client-side filtering for writing clips and art gallery
   No page reload. Uses data attributes.
   ============================================================ */

(function () {
  'use strict';

  // Generic filter initialiser
  // containerSelector: parent element containing .filter-btn elements
  // itemsSelector: the items to show/hide
  // dataAttr: data attribute on items to match against filter value
  function initFilter(containerSelector, itemsSelector, dataAttr) {
    const container = document.querySelector(containerSelector);
    const items = document.querySelectorAll(itemsSelector);
    if (!container || !items.length) return;

    const buttons = container.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter;

        items.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = '';
          } else {
            const itemValues = (item.dataset[dataAttr] || '').split(',').map(s => s.trim().toLowerCase());
            const matches = itemValues.includes(filterValue.toLowerCase());
            item.style.display = matches ? '' : 'none';
          }
        });

        // Announce to screen readers
        const visibleCount = Array.from(items).filter(i => i.style.display !== 'none').length;
        announceFilter(visibleCount, filterValue);
      });
    });
  }

  // Simple ARIA live region announcement
  let liveRegion;
  function announceFilter(count, filter) {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.classList.add('sr-only');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = filter === 'all'
      ? `Showing all ${count} items.`
      : `Showing ${count} items in category: ${filter}.`;
  }

  // --- Writing page: filter by format and topic ---
  // Each clip card should have data-format="Feature" data-topic="Animal Cognition"
  initFilter('#writing-filter-format', '.clip-card', 'format');
  initFilter('#writing-filter-topic', '.clip-card', 'topic');

  // Combined multi-filter for writing (both format + topic active at once)
  const writingGrid = document.querySelector('.clips-grid');
  if (writingGrid) {
    const allBtns = document.querySelectorAll('.filter-bar .filter-btn');
    let activeFormat = 'all';
    let activeTopic = 'all';

    function applyWritingFilters() {
      const items = writingGrid.querySelectorAll('.clip-card');
      items.forEach(item => {
        const format = (item.dataset.format || '').toLowerCase();
        const topic = (item.dataset.topic || '').toLowerCase();
        const formatMatch = activeFormat === 'all' || format.includes(activeFormat.toLowerCase());
        const topicMatch = activeTopic === 'all' || topic.includes(activeTopic.toLowerCase());
        item.style.display = (formatMatch && topicMatch) ? '' : 'none';
      });
    }

    document.querySelectorAll('#writing-filter-format .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#writing-filter-format .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFormat = btn.dataset.filter;
        applyWritingFilters();
      });
    });

    document.querySelectorAll('#writing-filter-topic .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#writing-filter-topic .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTopic = btn.dataset.filter;
        applyWritingFilters();
      });
    });
  }

  // --- Art gallery: filter by theme ---
  initFilter('#art-filter', '.masonry-item', 'theme');
})();
