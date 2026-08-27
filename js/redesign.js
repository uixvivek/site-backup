/* ==========================================================================
   redesign.js — "The Design Canvas"
   Nav, hero load sequence, scroll reveals, active section, contact modal.
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Hero load orchestration ---------------------------------------- */
    // Reveal the hero. rAF gives a smooth first paint on visible pages;
    // a timer + load backstop guarantees it fires even if rAF is throttled
    // (e.g. the tab loads in the background), so the hero is never stuck hidden.
    var revealed = false;
    function markReady() {
        if (revealed) return;
        revealed = true;
        document.body.classList.add('ready');
    }
    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(markReady);
    });
    setTimeout(markReady, 240);
    window.addEventListener('load', markReady);

    /* ---- Nav: scroll shadow --------------------------------------------- */
    var nav = document.getElementById('main-nav');
    var onScroll = function () {
        if (window.scrollY > 12) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- Nav: mobile menu ----------------------------------------------- */
    var hamburger = document.getElementById('nav-hamburger');
    var mobile = document.getElementById('nav-mobile');
    if (hamburger && mobile) {
        hamburger.addEventListener('click', function () {
            var open = mobile.classList.toggle('is-open');
            hamburger.classList.toggle('is-open', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });
        // Close after tapping a link
        mobile.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobile.classList.remove('is-open');
                hamburger.classList.remove('is-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---- Clean anchor scrolling (no #hash left in the URL) --------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    /* ---- Scroll reveals -------------------------------------------------- */
    var revealables = document.querySelectorAll('.reveal');
    function revealAll() {
        revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
        revealables.forEach(function (el) { io.observe(el); });
        // Failsafe: never leave content stuck hidden if the observer misfires.
        setTimeout(revealAll, 2500);
    } else {
        revealAll();
    }

    /* ---- Active nav link on scroll -------------------------------------- */
    var sections = ['home', 'work', 'writing', 'about'];
    var navLinks = {};
    document.querySelectorAll('.nav__link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href.charAt(0) === '#') navLinks[href.slice(1)] = link;
    });
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                Object.keys(navLinks).forEach(function (key) {
                    navLinks[key].classList.toggle('active', key === id);
                });
            });
        }, { threshold: 0.5 });
        sections.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) spy.observe(el);
        });
    }

    /* ---- Contact modal --------------------------------------------------- */
    var modal = document.getElementById('contact-modal');
    var openers = [
        document.getElementById('open-contact-modal'),
        document.getElementById('open-contact-modal-2')
    ];
    var closeBtn = document.getElementById('close-contact-modal');
    var lastFocused = null;

    function openModal(e) {
        if (e) e.preventDefault();
        lastFocused = document.activeElement;
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var email = document.getElementById('c-email');
        if (email) setTimeout(function () { email.focus(); }, 60);
    }
    function closeModal() {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    openers.forEach(function (btn) {
        if (btn) btn.addEventListener('click', openModal);
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeModal();
    });

    /* ---- Image lightbox (case-study pages only) ------------------------- */
    // Click any content <img> inside .page-case-study to open it full-size.
    // Click the overlay or press Escape to close.
    if (document.body.classList.contains('page-case-study')) {
        var lb = document.createElement('div');
        lb.className = 'lightbox-overlay';
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-label', 'Image preview');

        var lbImg = document.createElement('img');
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
            setTimeout(function () { lbImg.src = ''; }, 260);
        }

        document.querySelectorAll('.page-case-study img').forEach(function (img) {
            if (img.closest('nav')) return; // skip nav logo/icons
            img.addEventListener('click', function () {
                openLightbox(this.src, this.alt);
            });
        });

        lb.addEventListener('click', function (e) {
            if (e.target === lb) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
        });
    }

})();
