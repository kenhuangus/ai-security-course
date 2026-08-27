/* Figures for Module 1 — SDL and proactive defense. Coordinates are viewBox units.

   Full-width figures render at about 0.7x in a narrow window, so label sizes
   start at 15.5 and stacked text uses S.lines(), whose spacing follows the
   size txt() actually draws at. Box heights leave room for the enlarged case.
   tools/audit-deck.js enforces all of this. */
(function () {
  const S = window.SKETCH;
  if (!S) return;
  const C = S.COL;

  /* The module thesis in one picture: discovery is not the constraint.
     Three measured numbers from three independent sources, all pointing at
     the same stage of the pipeline. */
  S.register('funnel', host => {
    /* The viewBox is kept tight to the drawing. Scale is min(paneW/w, paneH/h),
       so empty vertical space costs every label its size. */
    const s = S.scene(host, 880, 420);
    S.txt(s, 440, 30, 'The constraint is downstream of discovery', { size: 17, weight: 700, col: C.ink });

    /* The bar carries only its count. Every word sits outside the bar, because
       a funnel narrows and a label that fits the wide end will not fit the
       narrow one, least of all once the 14px floor enlarges it. */
    S.rect(s, 60, 70, 380, 54, { fill: S.tint(C.red, 0.30), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 250, 106, '72', { size: 26, weight: 700, col: C.ink });
    S.txt(s, 456, 106, 'raw alerts produced by the agent', { size: 15.5, anchor: 'start', col: C.ink });

    S.arrow(s, 250, 132, 250, 168, { stroke: C.muted, strokeWidth: 1.8 });
    S.txt(s, 276, 156, 'autonomous triage, then human validation',
      { size: 15.5, anchor: 'start', col: C.muted });

    S.rect(s, 60, 180, 110, 54, { fill: S.tint(C.green, 0.30), fillStyle: 'solid', stroke: C.green, strokeWidth: 1.8 });
    S.txt(s, 115, 216, '4', { size: 26, weight: 700, col: C.ink });
    S.txt(s, 186, 216, 'confirmed zero-days', { size: 15.5, anchor: 'start', col: C.ink });
    S.txt(s, 452, 216, '94.4% discarded', { size: 17, weight: 700, anchor: 'start', col: C.red });

    S.rect(s, 40, 270, 800, 132, { fill: S.tint(C.blue, 0.05), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.6 });
    S.txt(s, 440, 300, 'Three sources, one bottleneck', { size: 16, weight: 700, col: C.blue });
    S.lines(s, 62, 332, [
      'Forescout: 4 of 72 agent alerts survived triage as real zero-days [P]',
      'Akrites: about 30% of ~3,000 first-quarter reports were duplicates [S]',
      'CVE volume: 174 per day in 2026, against 132 in 2025 [S]'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* Three benchmarks that get quoted as though they were one curve. They
     measure different things on different scales, so they are drawn as three
     separate panels and never share an axis. */
  S.register('benchmarks', host => {
    const s = S.scene(host, 880, 410);
    S.txt(s, 440, 30, 'Three benchmarks. Three axes. Never one line.',
      { size: 17, weight: 700, col: C.ink });

    /* A panel is 264 units wide with an 18-unit inset, so a body line has about
       250 units to live in. Kalam runs near 0.50 em per character, and the 14px
       floor pushes these to 20.3 units in a narrow window, which puts the
       ceiling near 24 characters. Longer lines hang out of the panel. */
    const panels = [
      ['AISI CTF ladder', C.blue,
       ['Expert tier reached by', 'Mythos Preview: 73%.', 'First model to do it.', 'None before April 2025.']],
      ['AISI "The Last Ones"', C.grape,
       ['32-step network task.', 'Mythos: 3 full runs', 'of 10. Mean 22 of 32.', 'Humans need ~20 hours.']],
      ['Forescout, 2025 to 2026', C.orange,
       ['Failing exploit work:', '93%, then 50%.', 'Failing basic research:', '55%, then 0%.']]
    ];

    panels.forEach(([title, col, lines], i) => {
      const x = 30 + i * 280;
      S.rect(s, x, 58, 264, 190, { fill: S.tint(col, 0.06), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, x + 132, 88, title, { size: 16, weight: 700, col: col });
      S.lines(s, x + 18, 128, lines, { size: 15.5, anchor: 'start', col: C.ink });
    });

    S.rect(s, 30, 268, 820, 132, { fill: S.tint(C.red, 0.06), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 440, 298, 'What none of them measures', { size: 16, weight: 700, col: C.red });
    S.lines(s, 52, 330, [
      'AISI states it cannot say whether Mythos could attack well-defended systems.',
      'The environments have no active defenders, no defensive tooling, and no',
      'penalty for tripping an alert. Every number above sits inside that caveat.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* The gate verdict, counted. The detail lives on the table slides; what the
     room needs from a picture is the shape: almost nothing survives untouched,
     and the new gates outnumber the ones that were already fine. */
  S.register('gates', host => {
    const s = S.scene(host, 880, 436);
    S.txt(s, 440, 30, 'Nine classical gates, and what happens to each', { size: 17, weight: 700, col: C.ink });

    const verdicts = [
      ['1', 'Survives unchanged', 'Static analysis', C.green],
      ['7', 'Needs new evidence', 'Requirements through release approval', C.orange],
      ['1', 'Needs the most change', 'Incident response', C.red]
    ];
    verdicts.forEach(([n, verdict, which, col], i) => {
      const y = 62 + i * 84;
      S.rect(s, 30, y, 500, 66, { fill: S.tint(col, 0.08), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, 66, y + 44, n, { size: 26, weight: 700, col: col });
      S.txt(s, 104, y + 30, verdict, { size: 16, weight: 700, anchor: 'start', col: col });
      S.txt(s, 104, y + 54, which, { size: 15.5, anchor: 'start', col: C.ink });
    });

    S.rect(s, 560, 62, 290, 234, { fill: S.tint(C.blue, 0.08), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.8 });
    S.txt(s, 705, 100, '8', { size: 34, weight: 700, col: C.blue });
    S.txt(s, 705, 132, 'entirely new gates', { size: 16, weight: 700, col: C.blue });
    /* The box only has room for five lines, so it names four and says so.
       All eight are enumerated on the "Eight new gates" table slide. */
    S.lines(s, 580, 166, [
      'Data provenance', 'Model registry', 'Agent permission review',
      'Containment review', 'and four more.'
    ], { size: 15.5, anchor: 'start', col: C.ink });

    S.rect(s, 30, 312, 820, 116, { fill: S.tint(C.red, 0.06), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.lines(s, 52, 346, [
      'Containment review is the spine. All three incidents in this course are',
      'the same failure: a boundary expected to hold, which held only as long',
      'as the agent kept cooperating.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });
})();
