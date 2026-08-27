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
    return { svg, rc: rough.svg(svg), w, h };
  }

  const add = (s, node) => { s.svg.appendChild(node); return node; };

  function rect(s, x, y, w, h, o = {}) {
    return add(s, s.rc.rectangle(x, y, w, h,
      Object.assign({ roughness: 1.1, bowing: 1, stroke: COL.ink, strokeWidth: 1.6 }, o)));
  }

  function ellipse(s, cx, cy, w, h, o = {}) {
    return add(s, s.rc.ellipse(cx, cy, w, h,
      Object.assign({ roughness: 1.1, stroke: COL.ink, strokeWidth: 1.6 }, o)));
  }

  function line(s, x1, y1, x2, y2, o = {}) {
    return add(s, s.rc.line(x1, y1, x2, y2,
      Object.assign({ roughness: 1.1, strokeWidth: 1.5, stroke: COL.ink }, o)));
  }

  function poly(s, pts, o = {}) {
    return add(s, s.rc.polygon(pts,
      Object.assign({ roughness: 1.1, stroke: COL.ink, strokeWidth: 1.6 }, o)));
  }

  /* Line with an arrowhead at (x2,y2). */
  function arrow(s, x1, y1, x2, y2, o = {}) {
    const stroke = o.stroke || COL.ink;
    line(s, x1, y1, x2, y2, Object.assign({}, o, { stroke }));
    const a = Math.atan2(y2 - y1, x2 - x1), L = 12;
    line(s, x2, y2, x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4), { stroke, strokeWidth: 1.6 });
    line(s, x2, y2, x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4), { stroke, strokeWidth: 1.6 });
  }

  /* Text anchored centre by default. o: { size, weight, col, anchor, font } */
  function txt(s, x, y, str, o = {}) {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('text-anchor', o.anchor || 'middle');
    t.setAttribute('font-family', o.font || FONT);
    t.setAttribute('font-size', o.size || 14);
    t.setAttribute('font-weight', o.weight || 400);
    t.setAttribute('fill', o.col || COL.ink);
    t.textContent = str;
    return add(s, t);
  }

  /* Rounded label box with centred, newline-aware text. */
  function chip(s, x, y, w, h, label, color, o = {}) {
    rect(s, x, y, w, h, Object.assign({
      fill: tint(color, 0.12), fillStyle: 'solid',
      stroke: color, strokeWidth: 1.8
    }, o.box || {}));
    const lines = String(label).split('\n');
    const cy = y + h / 2 - (lines.length - 1) * 9 + 5;
    lines.forEach((ln, i) => txt(s, x + w / 2, cy + i * 18, ln, {
      size: o.size || 13, weight: o.weight || 700, col: o.col || color
    }));
  }

  /* Titled box with a bulleted item list. Returns the box height used. */
  function cardBox(s, x, y, w, h, title, items, color, o = {}) {
    rect(s, x, y, w, h, { fill: tint(color, 0.06), fillStyle: 'solid', stroke: color, strokeWidth: 1.8 });
    txt(s, x + w / 2, y + 24, title, { size: o.titleSize || 14, weight: 700, col: color });
    (items || []).forEach((it, i) => txt(s, x + 14, y + 48 + i * 20, '· ' + it, {
      size: o.size || 12.5, anchor: 'start', col: COL.ink
    }));
    return h;
  }

  /* ---------- registry + lazy render ---------- */
  function register(key, fn) { renderers[key] = fn; }

  function renderSlide(slideEl) {
    if (!slideEl || typeof rough === 'undefined') return;
    slideEl.querySelectorAll('[data-fig]').forEach(el => {
      const fn = renderers[el.dataset.fig];
      if (fn) fn(el);
    });
  }

  function renderActive() {
    renderSlide(document.querySelector('.slide.is-active'));
  }

  document.addEventListener('deck:slide', e => renderSlide(e.detail.slide));
  // Re-draw on resize so the sketch stays crisp after a fullscreen toggle.
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(renderActive, 200); });

  window.SKETCH = {
    COL, FONT, tint, scene, rect, ellipse, line, poly, arrow, txt, chip, cardBox,
    register, renderSlide, renderActive
  };
})();
