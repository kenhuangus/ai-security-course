/* ============================================================
   html-slides — deck navigation engine
   No dependencies. No build step. ~180 lines.
   Slides are <section class="slide"> inside <main class="deck">.
   Fires a `deck:slide` CustomEvent on document with { slide, index, total }
   so optional modules (diagrams, i18n) can hook in without coupling.
   Exposes window.DECK = { go, next, prev, current, total }.
   ============================================================ */
(function () {
  let slides = [], dots = [], cur = 0, total = 0;
  let prevBtn, nextBtn, count, dotsWrap, progress, titleEl, fsBtn;

  const clamp = i => Math.max(0, Math.min(total - 1, i));

  function go(i) {
    if (!total) return;
    i = clamp(i);
    slides.forEach((s, n) => {
      s.classList.toggle('is-active', n === i);
      s.classList.toggle('is-prev', n < i);
    });
    dots.forEach((d, n) => d.classList.toggle('is-on', n === i));
    cur = i;

    if (count) count.textContent = (i + 1) + ' / ' + total;
    if (titleEl) titleEl.textContent = slides[i].dataset.title || '';
    if (progress) progress.style.width = (i / Math.max(1, total - 1) * 100) + '%';
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === total - 1;
    if (history.replaceState) history.replaceState(null, '', '#' + (i + 1));

    document.dispatchEvent(new CustomEvent('deck:slide', {
      detail: { slide: slides[i], index: i, total: total }
    }));
  }

  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
              document.mozFullScreenElement || document.msFullscreenElement);
  }

  function toggleFullscreen() {
    if (!isFullscreen()) {
      const el = document.documentElement;
      const rfs = el.requestFullscreen || el.webkitRequestFullscreen ||
                  el.mozRequestFullScreen || el.msRequestFullscreen;
      if (rfs) { const p = rfs.call(el); if (p && p.catch) p.catch(() => {}); }
    } else {
      const efs = document.exitFullscreen || document.webkitExitFullscreen ||
                  document.mozCancelFullScreen || document.msExitFullscreen;
      if (efs) { const p = efs.call(document); if (p && p.catch) p.catch(() => {}); }
    }
  }

  function syncFullscreenUI() {
    const on = isFullscreen();
    document.body.classList.toggle('is-fullscreen', on);
    if (!fsBtn) return;
    fsBtn.setAttribute('aria-label', on ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)');
    const label = fsBtn.querySelector('.bar__btn-label');
    if (label) label.textContent = on ? 'Exit Full' : 'Full Screen';
  }

  function readHash() {
    const n = parseInt((location.hash || '').replace('#', ''), 10);
    go(isNaN(n) ? 0 : n - 1);
  }

  function init() {
    slides = Array.from(document.querySelectorAll('.slide'));
    total = slides.length;
    if (!total) return;

    prevBtn  = document.getElementById('prevBtn');
    nextBtn  = document.getElementById('nextBtn');
    count    = document.getElementById('count');
    dotsWrap = document.getElementById('dots');
    progress = document.getElementById('progress');
    titleEl  = document.getElementById('slideTitle');
    fsBtn    = document.getElementById('fsBtn');

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot';
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', e => { e.preventDefault(); go(i); });
        dotsWrap.appendChild(d);
      });
      dots = Array.from(dotsWrap.children);
    }

    if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); next(); });
    if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); prev(); });
    if (fsBtn)   fsBtn.addEventListener('click',   e => { e.preventDefault(); toggleFullscreen(); });

    readHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('hashchange', readHash);
  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
    .forEach(e => document.addEventListener(e, syncFullscreenUI));

  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target && e.target.tagName) || '')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key))    { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key))       { e.preventDefault(); prev(); }
    else if (e.key === 'Home')                              { e.preventDefault(); go(0); }
    else if (e.key === 'End')                               { e.preventDefault(); go(total - 1); }
    else if (e.key === 'f' || e.key === 'F')                { e.preventDefault(); toggleFullscreen(); }
  });

  // Touch swipe
  let x0 = null;
  document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    x0 = null;
  }, { passive: true });

  // Wheel, debounced so one trackpad flick is one slide
  let lock = false;
  document.addEventListener('wheel', e => {
    if (lock) return;
    if (Math.abs(e.deltaY) < 24 && Math.abs(e.deltaX) < 24) return;
    lock = true;
    setTimeout(() => { lock = false; }, 600);
    (e.deltaY > 0 || e.deltaX > 0) ? next() : prev();
  }, { passive: true });

  window.DECK = { go, next, prev, current: () => cur, total: () => total };
})();
