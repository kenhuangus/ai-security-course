/* ============================================================
   audit-deck.js — readability and layout gate for the course decks

   Load it into a deck page and call AUDIT.run(). It walks every slide,
   activates each one so lazily-drawn figures render, and reports the five
   ways a slide can fail a room:

     scroll          content clipped or scrolled out of reach
     textUnder14     any rendered text below 14px, HTML or SVG
     figOutOfBounds  a figure label drawn outside its own viewBox
     overlap         two labels or two blocks sitting on top of each other
     lowContrast     text under the WCAG AA ratio for its size

   Run it at every size the deck is presented at. The checks that matter
   most move with the viewport: type scales off vh, figure labels scale off
   their container, and the AA threshold changes as text crosses 18.66px.

     AUDIT.run()              audit the current window size
     AUDIT.run({verbose:1})   include every finding, not just the first few

   From the console of a served deck:
     var s=document.createElement('script');
     s.src='/tools/audit-deck.js'; document.head.appendChild(s);

   A clean run is all five counts at zero. Anything above zero is a defect
   in the deck, not a tolerance to raise.
   ============================================================ */
(function () {
  const MIN_PX = 14;
  const NARROW = 900;          // below this the deck stacks and is allowed to scroll

  /* --- colour maths, WCAG 2.1 relative luminance --- */
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
  const PAPER = { r: 253, g: 252, b: 249, a: 1 };
  const INK = { r: 11, g: 14, b: 20, a: 1 };

  /* The dark slide and the top bar paint themselves with a gradient, which
     leaves backgroundColor transparent. Treat both as ink rather than falling
     through to paper, or every light-on-dark label reads as a failure. */
  function bgOf(el) {
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a >= 0.5) return c;
      if (e.classList && (e.classList.contains('slide--dark') || e.classList.contains('bar'))) return INK;
    }
    return PAPER;
  }

  const areaOf = r => Math.max(0, r.w) * Math.max(0, r.h);
  const overlapOf = (a, b) => ({
    w: Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x),
    h: Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
  });

  /* Activate each slide in turn, then restore what was showing. Figures draw
     lazily on deck:slide, so a slide has to be active to be measurable. */
  function eachSlide(fn) {
    const slides = [...document.querySelectorAll('.slide')];
    const start = document.querySelector('.slide.is-active');
    const fire = (sl, i) => document.dispatchEvent(new CustomEvent('deck:slide', {
      detail: { slide: sl, index: i, total: slides.length }
    }));
    slides.forEach((sl, i) => {
      slides.forEach(s => s.classList.remove('is-active'));
      sl.classList.add('is-active');
      fire(sl, i);
      fn(sl, i);
    });
    slides.forEach(s => s.classList.remove('is-active'));
    if (start) { start.classList.add('is-active'); fire(start, slides.indexOf(start)); }
    return slides.length;
  }

  function run(opt) {
    opt = opt || {};
    const narrow = innerWidth <= NARROW;
    const out = { scroll: [], textUnder14: [], figOutOfBounds: [], overlap: [], lowContrast: [] };
    const figs = [];

    const total = eachSlide((sl, i) => {
      const n = i + 1;

      sl.querySelectorAll('*').forEach(el => {
        if (el.closest('.notes')) return;
        if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') return;
        const cs = getComputedStyle(el);

        // Clipping only hides content when the box actually clips or scrolls.
        // overflow:visible spills but stays on screen, so it is not a defect.
        const clips = !(cs.overflowY === 'visible' && cs.overflowX === 'visible');
        const exempt = narrow && el.classList.contains('slide__in');   // stacked mode may scroll
        if (clips && !exempt) {
          const dy = el.scrollHeight - el.clientHeight;
          const dx = el.scrollWidth - el.clientWidth;
          if (dy > 4 || dx > 4)
            out.scroll.push({ n, cls: String(el.className).slice(0, 24), dy, dx });
        }

        if (!el.offsetParent) return;
        const ownText = [...el.childNodes].some(t => t.nodeType === 3 && t.textContent.trim());
        if (!ownText) return;

        const fs = parseFloat(cs.fontSize);
        if (fs < MIN_PX)
          out.textUnder14.push({ n, cls: String(el.className).slice(0, 24), px: +fs.toFixed(1),
            txt: el.textContent.trim().slice(0, 24) });

        const fg = parse(cs.color);
        if (fg && fg.a >= 0.5) {                   // transparent means gradient-filled text
          const cr = ratio(fg, bgOf(el));
          const big = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700);
          const need = big ? 3 : 4.5;
          if (cr < need)
            out.lowContrast.push({ n, cls: String(el.className).slice(0, 24),
              ratio: +cr.toFixed(2), need, txt: el.textContent.trim().slice(0, 24) });
        }
      });

      sl.querySelectorAll('[data-fig]').forEach(host => {
        const svg = host.querySelector('svg');
        if (!svg) { figs.push(host.dataset.fig + ' NOT RENDERED'); return; }
        const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\s+/).map(Number);
        const box = svg.getBoundingClientRect();
        const scale = Math.min(box.width / vb[2], box.height / vb[3]);
        const bg = bgOf(host);
        const px = [], labels = [];

        [...svg.querySelectorAll('text')].forEach(t => {
          const size = parseFloat(t.getAttribute('font-size')) * scale;
          px.push(size);
          if (size < MIN_PX - 0.1)
            out.textUnder14.push({ n, cls: 'fig:' + host.dataset.fig, px: +size.toFixed(1),
              txt: t.textContent.slice(0, 24) });

          const b = t.getBBox();
          labels.push({ t: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height });
          if (b.x < -1 || b.y < -1 || b.x + b.width > vb[2] + 1 || b.y + b.height > vb[3] + 1)
            out.figOutOfBounds.push({ n, fig: host.dataset.fig, txt: t.textContent.slice(0, 24) });

          const fg = parse(getComputedStyle(t).fill);
          if (fg) {
            const cr = ratio(fg, bg);
            if (cr < 3)
              out.lowContrast.push({ n, cls: 'fig:' + host.dataset.fig, ratio: +cr.toFixed(2),
                need: 3, txt: t.textContent.slice(0, 24) });
          }
        });

        for (let a = 0; a < labels.length; a++)
          for (let b = a + 1; b < labels.length; b++)
            if (areaOf(overlapOf(labels[a], labels[b])) >
                0.2 * Math.min(areaOf(labels[a]), areaOf(labels[b])))
              out.overlap.push({ n, fig: host.dataset.fig,
                a: labels[a].t.slice(0, 20), b: labels[b].t.slice(0, 20) });

        // A label can sit inside the viewBox and still hang out of the box it
        // was drawn in, which is what a stack of lines does when txt() enlarges
        // them to hold the floor. rough.js emits rectangles as paths, so any
        // box-shaped path is a candidate container; thin ones are rules and
        // arrowheads and are skipped.
        //
        // Ownership is decided by the label's centre rather than by how much
        // of it overlaps: a label hanging halfway out of its box overlaps by
        // less than half, which is exactly the case that must be caught. The
        // smallest box containing the centre wins, so a label inside a chip
        // inside a card is judged against the chip. TOL absorbs the wobble
        // rough.js adds to a stroked edge.
        const TOL = 4;
        const containers = [...svg.querySelectorAll('path')]
          .map(p => { try { return p.getBBox(); } catch (e) { return null; } })
          .filter(b => b && b.width > 60 && b.height > 40)
          .map(b => ({ x: b.x, y: b.y, w: b.width, h: b.height, a: b.width * b.height }))
          .sort((p, q) => p.a - q.a);
        labels.forEach(t => {
          const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
          const box = containers.find(b =>
            cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h);
          if (!box) return;                        // free-standing label, nothing to escape
          if (t.x < box.x - TOL || t.y < box.y - TOL ||
              t.x + t.w > box.x + box.w + TOL || t.y + t.h > box.y + box.h + TOL)
            out.figOutOfBounds.push({ n, fig: host.dataset.fig,
              txt: t.t.slice(0, 24), escapes: 'its box' });
        });

        figs.push(host.dataset.fig + '  scale ' + scale.toFixed(2) +
                  '  smallest ' + (px.length ? Math.min(...px).toFixed(1) : '-') + 'px');
      });

      // Two structural blocks sitting on each other means a broken layout,
      // not a design choice. Nesting is normal, so skip ancestor pairs.
      const blocks = [...sl.querySelectorAll(
        '.card,.callout,.bullets,.tbl,.code,.pane,.fig,.h2,.lead,.kicker,.source')]
        .filter(el => el.offsetParent && !el.closest('.notes'))
        .map(el => { const q = el.getBoundingClientRect();
          return { el, cls: String(el.className).slice(0, 18), x: q.x, y: q.y, w: q.width, h: q.height }; });
      for (let a = 0; a < blocks.length; a++)
        for (let b = a + 1; b < blocks.length; b++) {
          if (blocks[a].el.contains(blocks[b].el) || blocks[b].el.contains(blocks[a].el)) continue;
          if (areaOf(overlapOf(blocks[a], blocks[b])) >
              0.15 * Math.min(areaOf(blocks[a]), areaOf(blocks[b])))
            out.overlap.push({ n, a: blocks[a].cls, b: blocks[b].cls });
        }
    });

    const counts = {};
    Object.keys(out).forEach(k => { counts[k] = out[k].length; });
    const findings = [].concat(...Object.keys(out).map(k => out[k].map(v => Object.assign({ check: k }, v))));

    return {
      at: innerWidth + 'x' + innerHeight,
      slides: total,
      clean: findings.length === 0,
      counts,
      figures: figs,
      findings: opt.verbose ? findings : findings.slice(0, 10),
      more: opt.verbose ? 0 : Math.max(0, findings.length - 10)
    };
  }

  window.AUDIT = { run, MIN_PX };
  return window.AUDIT;
})();
