/**
 * intro-animation.js
 * Place in your js/ folder and add BEFORE main.js in index.html:
 *   <script src="js/intro-animation.js"></script>
 *
 * Shows a blue fullscreen overlay with "hello." and "designing for humans"
 * then slides up to reveal the site.
 * Plays once per session.
 */

(function () {
    'use strict';

    if (sessionStorage.getItem('introPlayed')) return;
    sessionStorage.setItem('introPlayed', 'true');

    /* ── Inject Syne font ─────────────────────────────────────────────── */
    const syneLink = document.createElement('link');
    syneLink.rel = 'stylesheet';
    syneLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500&display=swap';
    document.head.appendChild(syneLink);

    /* ── Inject styles ────────────────────────────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
    #vs-intro {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #3b71f3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transform: translateY(0);
      transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
      pointer-events: all;
    }

    #vs-intro.slide-out {
      transform: translateY(-100%);
      pointer-events: none;
    }

    #vs-intro-hello {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-weight: 800;
      font-size: clamp(4rem, 14vw, 10rem);
      color: #ffffff;
      letter-spacing: -0.03em;
      line-height: 1;
      margin: 0;
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #vs-intro-hello.visible {
      opacity: 1;
      transform: translateY(0);
    }

    #vs-intro-sub {
      font-family: 'Syne', sans-serif;
      font-weight: 400;
      font-size: clamp(0.85rem, 2vw, 1.1rem);
      color: rgba(255, 255, 255, 0.75);
      letter-spacing: 0.04em;
      margin: 0;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.25s,
                  transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.25s;
    }

    #vs-intro-sub.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
    document.head.appendChild(style);

    /* ── Build overlay DOM ────────────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.id = 'vs-intro';

    const hello = document.createElement('p');
    hello.id = 'vs-intro-hello';
    hello.textContent = 'hello.';

    const sub = document.createElement('p');
    sub.id = 'vs-intro-sub';
    sub.textContent = 'designing for humans';

    overlay.appendChild(hello);
    overlay.appendChild(sub);
    document.body.appendChild(overlay);

    document.documentElement.style.overflow = 'hidden';

    /* ── Animation sequence ───────────────────────────────────────────── */
    // 1. Text fades + slides in
    setTimeout(function () {
        hello.classList.add('visible');
        sub.classList.add('visible');
    }, 120);

    // 2. Slide overlay up after hold
    setTimeout(function () {
        overlay.classList.add('slide-out');
    }, 2000);

    // 3. Remove from DOM after slide completes
    setTimeout(function () {
        overlay.remove();
        style.remove();
        document.documentElement.style.overflow = '';
    }, 3000);

})();