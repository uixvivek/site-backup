/**
 * main.js — Portfolio Website Scripts
 *
 * Responsibilities:
 *  1. Hamburger menu toggle (open / close mobile nav drawer)
 *  2. Close mobile menu when a nav link is clicked
 *  3. Add .scrolled shadow class to navbar on page scroll
 *  4. Close mobile menu on window resize back to desktop width
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Element references
  ------------------------------------------------------------------ */
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  /* ------------------------------------------------------------------
     1. HAMBURGER MENU TOGGLE
     Toggles .is-open on both the button and the drawer.
     Also updates aria-expanded for screen readers.
  ------------------------------------------------------------------ */
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMenu);

    /* 2. Close drawer when any mobile nav link is tapped */
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ------------------------------------------------------------------
     3. SCROLL SHADOW on navbar
     A lightweight IntersectionObserver alternative: just listen to
     scroll and toggle a class when user has scrolled more than 10px.
  ------------------------------------------------------------------ */
  function handleScroll() {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once on load in case page is already scrolled (e.g., browser back)
  handleScroll();

  /* ------------------------------------------------------------------
     4. CLOSE MENU ON RESIZE
     If user widens the browser back to ≥641px, collapse the mobile
     menu so it doesn't linger behind the desktop nav.
  ------------------------------------------------------------------ */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });

  /* ------------------------------------------------------------------
     5. CLEAN ANCHOR SCROLL
     Intercept hash-anchor clicks so they scroll smoothly to the section
     without appending #hash to the URL bar.
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Keep the URL clean — no fragment in the address bar
      history.replaceState(null, '', window.location.pathname);
      closeMenu(); // also close mobile menu if open
    });
  });

  /* ------------------------------------------------------------------
     5. CONTACT MODAL
     Handle opening and closing the Formspree contact modal
  ------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('contact-modal');
  const openModalBtn = document.getElementById('open-contact-modal');
  const closeModalBtn = document.getElementById('close-contact-modal');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking on the overlay background
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-active')) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------
     6. IMAGE LIGHTBOX (case study pages only)
     Click any <img> inside .page-case-study → opens lightbox overlay.
     Click overlay → closes it. Escape also closes.
  ------------------------------------------------------------------ */
  if (document.body.classList.contains('page-case-study')) {

    // Build overlay once
    const lb = document.createElement('div');
    lb.className = 'lightbox-overlay';
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image preview');

    const lbImg = document.createElement('img');
    lb.appendChild(lbImg);
    document.body.appendChild(lb);

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      // Clear src after transition so no flash on next open
      setTimeout(function () { lbImg.src = ''; }, 260);
    }

    // Delegate clicks on all content images in the page
    document.querySelectorAll('.page-case-study img').forEach(function (img) {
      // Skip nav logo
      if (img.closest('nav')) return;
      img.addEventListener('click', function () {
        openLightbox(this.src, this.alt);
      });
    });

    // Close on overlay click (but not on the image itself)
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

})();
