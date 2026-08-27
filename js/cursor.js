/* ============================================================
   cursor.js — Custom cursor: a dot that tracks the pointer
   exactly, with a soft ring trailing behind it.
   Only activates on fine-pointer devices, and never when the
   visitor prefers reduced motion.
   ============================================================ */

(function () {
  'use strict';

  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  document.documentElement.classList.add('has-custom-cursor');

  var dot = document.createElement('div');
  var ring = document.createElement('div');
  dot.className = 'cursor-dot is-hidden';
  ring.className = 'cursor-ring is-hidden';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mouseX = -100, mouseY = -100;
  var ringX = -100, ringY = -100;
  var visible = false;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    }
    dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
  });

  document.addEventListener('mouseleave', function () {
    visible = false;
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  // The ring eases toward the pointer for a trailing feel
  function tick() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Grow the ring over interactive elements
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('a, button, [role="button"], input, textarea, select, .masonry-item')) {
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('a, button, [role="button"], input, textarea, select, .masonry-item')) {
      ring.classList.remove('is-hovering');
    }
  });
})();
