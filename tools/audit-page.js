/* ============================================================
   audit-page.js — readability gate for the reference pages

   tools/audit-deck.js does this for a slide deck, where type scales off
   viewport height and figures scale off their container. The reference
   pages are ordinary scrolling documents, so the rules that apply are the
   two that hold everywhere:

     textUnder14   any rendered text below 14px
     lowContrast   text under the WCAG AA ratio for its size
     overflowX     content wider than its container, which clips on a phone

   Vertical scrolling is expected here and is not a finding.

     AUDIT.run()              audit the current window size
     AUDIT.run({verbose:1})   every finding, not just the first ten

   From the console of a served page:
     var s=document.createElement('script');
     s.src='/tools/audit-page.js'; document.head.appendChild(s);

   A clean run is all three counts at zero.
   ============================================================ */
(function () {
  const MIN_PX = 14;

  const parse = c => {
    const m = String(c).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (hi + 0.05) / (lo + 0.05);
  };

  /* Walk up for the first opaque background. The top bar paints a gradient,
     which leaves backgroundColor transparent, so it is treated as ink. */
  const INK = { r: 11, g: 14, b: 20, a: 1 };
  function bgOf(el) {
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a >= 0.5) return c;
      if (e.classList && e.classList.contains('topbar')) return INK;
    }
    const body = parse(getComputedStyle(document.body).backgroundColor);
    return (body && body.a >= 0.5) ? body : { r: 255, g: 255, b: 255, a: 1 };
  }

  function where(el) {
    const id = el.id ? '#' + el.id : '';
    const cls = String(el.className || '').trim().split(/\s+/)[0];
    return el.tagName.toLowerCase() + id + (cls ? '.' + cls : '');
  }

  function run(opt) {
    opt = opt || {};
    const out = { textUnder14: [], lowContrast: [], overflowX: [] };

    document.querySelectorAll('body *').forEach(el => {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;

      // A box that clips horizontally and has more content than room hides it.
      // .scroll-x opts in to sideways scrolling deliberately, so it is exempt.
      if (cs.overflowX !== 'visible' && !el.classList.contains('scroll-x')
          && el.scrollWidth - el.clientWidth > 4)
        out.overflowX.push({ at: where(el), by: el.scrollWidth - el.clientWidth });

      if (!el.offsetParent && cs.position !== 'fixed') return;
      const ownText = [...el.childNodes].some(t => t.nodeType === 3 && t.textContent.trim());
      if (!ownText) return;

      const fs = parseFloat(cs.fontSize);
      const txt = el.textContent.trim().slice(0, 30);
      if (fs < MIN_PX)
        out.textUnder14.push({ at: where(el), px: +fs.toFixed(1), txt });

      const fg = parse(cs.color);
      if (fg && fg.a >= 0.5) {
        const cr = ratio(fg, bgOf(el));
        const big = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700);
        const need = big ? 3 : 4.5;
        if (cr < need)
          out.lowContrast.push({ at: where(el), ratio: +cr.toFixed(2), need, txt });
      }
    });

    // The document itself must never scroll sideways.
    if (document.documentElement.scrollWidth - document.documentElement.clientWidth > 4)
      out.overflowX.push({ at: 'document', by: document.documentElement.scrollWidth
        - document.documentElement.clientWidth });

    const counts = {};
    Object.keys(out).forEach(k => { counts[k] = out[k].length; });
    const findings = [].concat(...Object.keys(out).map(k => out[k].map(v => Object.assign({ check: k }, v))));

    // A run made before the webfonts resolve measures fallback metrics.
    const fontsReady = document.fonts ? document.fonts.status === 'loaded' : true;

    return {
      at: innerWidth + 'x' + innerHeight,
      theme: document.documentElement.getAttribute('data-theme') || 'unset',
      fontsReady,
      clean: fontsReady && findings.length === 0,
      counts,
      findings: opt.verbose ? findings : findings.slice(0, 10),
      more: opt.verbose ? 0 : Math.max(0, findings.length - 10)
    };
  }

  window.AUDIT = { run, MIN_PX };
  return window.AUDIT;
})();
