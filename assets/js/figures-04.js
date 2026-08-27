/* Figure for the capstone. Coordinates are viewBox units.

   Full-width figures render at about 0.7x in a narrow window and 0.9x on a
   720p projector, so label sizes start at 15.5 and every stacked block uses
   S.lines(), whose spacing follows the size txt() actually draws at. Box
   heights leave room for the enlarged case; see tools/audit-deck.js. */
(function () {
  const S = window.SKETCH;
  if (!S) return;
  const C = S.COL;

  /* One incident, five disclosure routes, four organizations. The point is the
     count, not the detail: no single destination would have taken all of it. */
  S.register('five-routes', host => {
    const s = S.scene(host, 880, 500);
    S.txt(s, 440, 30, 'One incident. Five routes. Four organizations.',
      { size: 17, weight: 700, col: C.ink });

    const rows = [
      ['Zero-day in the cache proxy',        'A', 'Akrites / vendor CNA',   C.blue],
      ['Two dataset-processor vectors',      'A', "Hugging Face's own VDP", C.blue],
      ['Agent crossed five boundaries',      'C', 'FLARE-AI + CERT/CC',     C.red],
      ['Specification gaming',               'B', 'Provider prog. + AVID',  C.teal],
      ['Realized harm to a third party',     '—', 'AIID',                   C.grape]
    ];

    rows.forEach(([what, branch, terminal, col], i) => {
      const y = 60 + i * 68;
      S.rect(s, 40, y, 380, 54, { fill: S.tint(col, 0.06), fillStyle: 'solid', stroke: col, strokeWidth: 1.6 });
      S.txt(s, 56, y + 34, what, { size: 15.5, anchor: 'start', col: C.ink });
      S.txt(s, 448, y + 34, branch, { size: 17, weight: 700, col: col });
      S.arrow(s, 470, y + 28, 512, y + 28, { stroke: C.muted, strokeWidth: 1.6 });
      S.rect(s, 524, y, 316, 54, { fill: S.tint(col, 0.12), fillStyle: 'solid', stroke: col, strokeWidth: 1.6 });
      S.txt(s, 540, y + 34, terminal, { size: 15.5, weight: 700, anchor: 'start', col: col });
    });

    S.rect(s, 40, 412, 800, 76, { fill: S.tint(C.red, 0.06), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.lines(s, 62, 442, [
      'Two of these five could not have been used in July 2026. Akrites intake',
      'opens in September. FLARE-AI published nine days before the intrusion.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });
})();
