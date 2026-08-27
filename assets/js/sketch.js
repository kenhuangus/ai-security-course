/* ============================================================
   html-slides — hand-drawn SVG diagram helper
   Wraps rough.js (https://roughjs.com) so slide figures look sketched
   rather than clip-arty. Load rough.min.js BEFORE this file.

   Author a diagram as a function(host) that calls the primitives:

     SKETCH.register('trust-boundaries', host => {
       const s = SKETCH.scene(host, 880, 500);
       SKETCH.rect(s, 40, 60, 300, 160, { fill: SKETCH.tint(SKETCH.COL.blue, .08),
                                          stroke: SKETCH.COL.blue });
       SKETCH.txt(s, 190, 100, 'Eval sandbox', { size: 15, weight: 700 });
       SKETCH.arrow(s, 340, 140, 520, 140, { stroke: SKETCH.COL.red });
     });

   Then put <div class="fig" data-fig="trust-boundaries"></div> on the slide.
   Rendering is lazy: only the active slide draws, on every `deck:slide`.
   Coordinates are viewBox units, not pixels — the SVG scales to fit.
   ============================================================ */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const renderers = {};

  const COL = {
    ink:    '#181b22',
    muted:  '#5e6676',
    accent: '#ff6a2b',
    blue:   '#1971c2',
    teal:   '#0c8599',
    orange: '#f08c00',
    grape:  '#7048e8',
    red:    '#e03131',
    green:  '#2b8a3e',
    yellow: '#f59f00',
    pink:   '#d6336c',
    indigo: '#3b5bdb'
  };

  const FONT = "'Kalam', cursive";

  /* On a .slide--dark the paper is near-black, so a figure drawn in COL.ink is
     invisible. Figures name their colours by meaning, not by theme, so the two
     background-dependent ones are remapped at draw time and every figure works
     on either kind of slide. The accent hues carry on both and are untouched. */
  const DARK = { [COL.ink]: '#eceef2', [COL.muted]: '#9ba4b5' };

  /* Yellow and orange are fine as strokes and fills but drop to about
     2.1:1 and 2.4:1 as text on light paper. Text drawn in them gets a
     darkened variant; on a dark slide the bright hue is already the
     readable one, so this only applies to light figures. */
  const TEXT_LIGHT = { [COL.yellow]: '#8a5a00', [COL.orange]: '#8a5100' };
  const forTheme = (s, c) => (s && s.dark && c && DARK[c]) ? DARK[c] : c;

  /* True when the figure will actually be drawn on a dark background. The
     slide class alone is not enough: .pane--figure paints its own white panel,
     so a figure inside one is on light paper even on a dark slide. Walk up to
     the slide and let the first opaque background found decide. */
  function isDark(host) {
    const slide = host.closest('.slide--dark');
    if (!slide) return false;
    for (let el = host; el && el !== slide; el = el.parentElement) {
      const m = getComputedStyle(el).backgroundColor
        .match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/);
      if (!m) continue;
      if (m[4] !== undefined && parseFloat(m[4]) < 0.5) continue;   // see-through
      return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.5;
    }
    return true;
  }

  /* rgba() from a #rrggbb plus alpha, for translucent fills */
  function tint(hex, alpha) {
    const n = hex.replace('#', '');
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* Create a fresh scene inside host. w/h define the viewBox aspect ratio. */
  function scene(host, w, h) {
    host.innerHTML = '';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    host.appendChild(svg);
    // Rendered px = viewBox units x scale. Captured now so txt() can hold the
    // 14px floor: the same figure renders smaller on a 720p projector than on
    // a 1080p monitor, and a fixed font size cannot cover both.
    const r = host.getBoundingClientRect();
    const scale = (r.width && r.height) ? Math.min(r.width / w, r.height / h) : 0;
    return { svg, rc: rough.svg(svg), w, h, scale, bumped: 0, dark: isDark(host) };
  }

  const add = (s, node) => { s.svg.appendChild(node); return node; };

  /* Every stroke passes through forTheme so a figure drawn in ink stays visible
     when the same slide is dark. */
  const strokeOpts = (s, o, base) => {
    const merged = Object.assign({ stroke: COL.ink }, base, o);
    merged.stroke = forTheme(s, merged.stroke);
    return merged;
  };

  function rect(s, x, y, w, h, o = {}) {
    return add(s, s.rc.rectangle(x, y, w, h,
      strokeOpts(s, o, { roughness: 1.1, bowing: 1, strokeWidth: 1.6 })));
  }

  function ellipse(s, cx, cy, w, h, o = {}) {
    return add(s, s.rc.ellipse(cx, cy, w, h,
      strokeOpts(s, o, { roughness: 1.1, strokeWidth: 1.6 })));
  }

  function line(s, x1, y1, x2, y2, o = {}) {
    return add(s, s.rc.line(x1, y1, x2, y2,
      strokeOpts(s, o, { roughness: 1.1, strokeWidth: 1.5 })));
  }

  function poly(s, pts, o = {}) {
    return add(s, s.rc.polygon(pts,
      strokeOpts(s, o, { roughness: 1.1, strokeWidth: 1.6 })));
  }

  /* Line with an arrowhead at (x2,y2). */
  function arrow(s, x1, y1, x2, y2, o = {}) {
    const stroke = forTheme(s, o.stroke || COL.ink);
    line(s, x1, y1, x2, y2, Object.assign({}, o, { stroke }));
    const a = Math.atan2(y2 - y1, x2 - x1), L = 12;
    line(s, x2, y2, x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4), { stroke, strokeWidth: 1.6 });
    line(s, x2, y2, x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4), { stroke, strokeWidth: 1.6 });
  }

  /* Minimum rendered text size, in CSS pixels. Anything smaller is unreadable
     on a projector. txt() raises undersized labels to meet this floor and
     renderSlide warns, so the author still hears about the underlying design
     problem: a viewBox much wider than the container it is drawn into. */
  const MIN_PX = 14;

  function auditLegibility(s, host) {
    const svg = s.svg;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;              // not laid out yet
    const scale = Math.min(r.width / s.w, r.height / s.h);
    const tooSmall = [...svg.querySelectorAll('text')]
      .map(t => parseFloat(t.getAttribute('font-size')) * scale)
      .filter(px => px < MIN_PX - 0.5);             // txt() should have caught these
    if (tooSmall.length) {
      console.warn(
        `[sketch] "${host.dataset.fig}": ${tooSmall.length} label(s) render below ${MIN_PX}px ` +
        `(smallest ${Math.min(...tooSmall).toFixed(1)}px, scale ${scale.toFixed(2)}). ` +
        `Shrink the viewBox toward the container's pixel size, or raise the font sizes.`);
    }
    if (s.bumped) {
      console.warn(
        `[sketch] "${host.dataset.fig}": ${s.bumped} label(s) were enlarged to reach the ` +
        `${MIN_PX}px floor at scale ${scale.toFixed(2)}. They are readable but may now ` +
        `collide. Raise the figure's own sizes to at least ${Math.ceil(MIN_PX / scale)}.`);
    }
  }

  /* Text anchored centre by default. o: { size, weight, col, anchor, font }
     Sizes below the 14px floor at the current scale are raised to meet it.
     The bump keeps the label readable but does not move anything else, so a
     figure that relies on it may collide: size the figure for its container
     instead of leaning on this. renderSlide warns when it fires. */
  /* The size txt() will actually draw at, once the floor is applied. Anything
     that stacks lines has to space them off this rather than off the size it
     asked for, or a bumped label will overlap the line beneath it. */
  function effSize(s, size) {
    return (s.scale && size * s.scale < MIN_PX) ? MIN_PX / s.scale : size;
  }

  function txt(s, x, y, str, o = {}) {
    const t = document.createElementNS(NS, 'text');
    const asked = o.size || 14;
    const size = effSize(s, asked);
    if (size !== asked) s.bumped++;
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('text-anchor', o.anchor || 'middle');
    t.setAttribute('font-family', o.font || FONT);
    t.setAttribute('font-size', size);
    t.setAttribute('font-weight', o.weight || 400);
    let fill = forTheme(s, o.col || COL.ink);
    if (!(s && s.dark) && TEXT_LIGHT[fill]) fill = TEXT_LIGHT[fill];
    t.setAttribute('fill', fill);
    t.textContent = str;
    return add(s, t);
  }

  /* A stack of lines whose spacing follows the size txt() will actually draw
     at, so a label raised to the 14px floor never lands on the line below it.
     Use this for any multi-line block instead of hand-picking y offsets.
     Returns the height consumed, so the caller can place what follows. */
  function lines(s, x, y, arr, o = {}) {
    const lh = effSize(s, o.size || 14) * (o.lh || 1.45);
    arr.forEach((ln, i) => txt(s, x, y + i * lh, ln, o));
    return lh * arr.length;
  }

  /* Rounded label box with centred, newline-aware text. */
  function chip(s, x, y, w, h, label, color, o = {}) {
    rect(s, x, y, w, h, Object.assign({
      fill: tint(color, 0.12), fillStyle: 'solid',
      stroke: color, strokeWidth: 1.8
    }, o.box || {}));
    const lines = String(label).split('\n');
    const size = effSize(s, o.size || 14);
    /* Kalam reports a bounding box about 1.6x its font size, so the usual 1.2
       line-height leaves stacked chip lines touching. 1.45 clears them. */
    const lh = size * 1.45;
    const cy = y + h / 2 - (lines.length - 1) * lh / 2 + size * 0.36;
    lines.forEach((ln, i) => txt(s, x + w / 2, cy + i * lh, ln, {
      size: o.size || 14, weight: o.weight || 700, col: o.col || color
    }));
  }

  /* Titled box with a bulleted item list. Returns the box height used. */
  function cardBox(s, x, y, w, h, title, items, color, o = {}) {
    rect(s, x, y, w, h, { fill: tint(color, 0.06), fillStyle: 'solid', stroke: color, strokeWidth: 1.8 });
    const tSize = effSize(s, o.titleSize || 14);
    const iSize = effSize(s, o.size || 14);
    txt(s, x + w / 2, y + tSize * 1.5, title, { size: o.titleSize || 14, weight: 700, col: color });
    (items || []).forEach((it, i) => txt(s, x + 14, y + tSize * 1.5 + iSize * 1.6 + i * iSize * 1.6, '· ' + it, {
      size: o.size || 14, anchor: 'start', col: COL.ink
    }));
    return h;
  }

  /* ---------- registry + lazy render ---------- */
  function register(key, fn) { renderers[key] = fn; }

  function renderSlide(slideEl) {
    if (!slideEl || typeof rough === 'undefined') return;
    slideEl.querySelectorAll('[data-fig]').forEach(el => {
      const fn = renderers[el.dataset.fig];
      if (!fn) return;
      const s = fn(el);
      // Figures that return their scene get a legibility audit for free.
      // Those that do not are audited from the DOM instead.
      const svg = el.querySelector('svg');
      if (svg) {
        const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\s+/).map(Number);
        auditLegibility(s && s.svg ? s : { svg, w: vb[2], h: vb[3] }, el);
      }
    });
  }

  function renderActive() {
    renderSlide(document.querySelector('.slide.is-active'));
  }

  /* Printing puts every slide on a page at once, but lazy rendering means only
     the slides someone actually visited have drawn anything. Printing a freshly
     opened deck would otherwise produce a PDF with every figure blank. */
  function renderAll() {
    document.querySelectorAll('.slide').forEach(renderSlide);
  }

  document.addEventListener('deck:slide', e => renderSlide(e.detail.slide));
  // Re-draw on resize so the sketch stays crisp after a fullscreen toggle.
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(renderActive, 200); });

  window.addEventListener('beforeprint', renderAll);
  // Safari and the headless PDF paths do not always fire beforeprint, but the
  // print media query flips in every engine that applies the print stylesheet.
  if (window.matchMedia) {
    const mq = window.matchMedia('print');
    const onPrint = e => { if (e.matches) renderAll(); };
    if (mq.addEventListener) mq.addEventListener('change', onPrint);
    else if (mq.addListener) mq.addListener(onPrint);
  }

  window.SKETCH = {
    COL, FONT, tint, scene, rect, ellipse, line, poly, arrow, txt, lines, chip, cardBox,
    register, renderSlide, renderActive, renderAll
  };
})();
