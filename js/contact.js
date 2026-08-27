/* ============================================================
   contact.js — Contact form validation, honeypot, inline success
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // --- Honeypot check ---
    const honeypot = form.querySelector('.form-honeypot input');
    if (honeypot && honeypot.value) {
      // Bot detected — silently do nothing
      return;
    }

    // --- Validation ---
    let valid = true;
    const errors = [];

    const nameField = form.querySelector('[name="name"]');
    const emailField = form.querySelector('[name="email"]');
    const messageField = form.querySelector('[name="message"]');

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
      el.style.borderColor = '';
    });

    if (!nameField || !nameField.value.trim()) {
      showError(nameField, 'Please enter your name.');
      valid = false;
    }

    if (!emailField || !validateEmail(emailField.value)) {
      showError(emailField, 'Please enter a valid email address.');
      valid = false;
    }

    if (!messageField || !messageField.value.trim() || messageField.value.trim().length < 10) {
      showError(messageField, 'Please enter a message (at least 10 characters).');
      valid = false;
    }

    if (!valid) return;

    // --- Submit ---
    // Since this is a static site, show success state immediately.
    // TODO: Wire to a real form backend (e.g. Formspree, Netlify Forms, EmailJS)
    // Replace the form action with your chosen provider.

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    // Simulate a brief network delay, then show success
    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.focus();
      }
    }, 600);
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(field, message) {
    if (!field) return;
    field.style.borderColor = '#C0392B';
    const err = document.createElement('p');
    err.className = 'field-error';
    err.textContent = message;
    err.style.cssText = 'font-size:0.8rem;color:#C0392B;margin-top:4px;';
    field.parentNode.insertBefore(err, field.nextSibling);
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      err.remove();
    }, { once: true });
  }

  // --- Copy pitch bio button ---
  const copyBtn = document.getElementById('copy-pitch-bio');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const bioText = document.getElementById('pitch-bio-text');
      if (!bioText) return;
      navigator.clipboard.writeText(bioText.textContent.trim()).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 2000);
      });
    });
  }
})();
