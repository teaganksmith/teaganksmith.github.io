/* ============================================================
   nav.js — Sticky navigation, mobile overlay, active state
   ============================================================ */

(function () {
  'use strict';

  const nav = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-close');

  // --- Sticky scroll behaviour ---
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile overlay ---
  const openOverlay = () => {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeOverlay = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.focus();
  };

  if (hamburger) {
    hamburger.addEventListener('click', openOverlay);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeOverlay);
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeOverlay();
    }
  });

  // Close when overlay link is clicked
  if (overlay) {
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeOverlay);
    });
  }

  // --- Active nav link ---
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  // All nav links (both desktop and overlay)
  document.querySelectorAll('.nav-links a, .nav-overlay a').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath || (linkPath !== '' && currentPath.startsWith(linkPath + '/'))) {
      link.classList.add('active');
    }
  });

  // Home: logo
  const logo = document.querySelector('.nav-logo');
  if (logo && (currentPath === '' || currentPath === '/')) {
    // home — don't add active class to logo, just leave as-is
  }
})();
