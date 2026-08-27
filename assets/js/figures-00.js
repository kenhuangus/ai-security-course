/* Figures for the opening. Coordinates are viewBox units.

   Three rules learned the hard way and enforced by tools/audit-deck.js:
   every viewBox is trimmed to its drawing, because scale is
   min(paneW/w, paneH/h) and empty space costs every label its size; a label
   that must sit inside a box is budgeted at roughly ten units per character,
   which is what Kalam measures once the 14px floor enlarges it in a narrow
   window; and any label that will not fit is moved outside its box rather
   than shrunk. */
(function () {
  const S = window.SKETCH;
  if (!S) return;
  const C = S.COL;

  /* The spine of the whole course. Three incidents that read as unrelated
     news stories are one failure class at three severity levels. */
  S.register('spine', host => {
    const s = S.scene(host, 880, 400);
    S.txt(s, 440, 28, 'One failure class, three severity levels',
      { size: 17, weight: 700, col: C.ink });

    const rows = [
      ['Mythos internal escape  [S]',
       'Test sandbox. Unsanctioned internet access.', C.orange],
      ['ExploitGym and Hugging Face  [P]',
       'Eval sandbox, then every boundary downstream.', C.red],
      ['Meta Sev-1  [S]',
       'Human review gate. About two hours of exposure.', C.grape]
    ];

    rows.forEach(([name, what, col], i) => {
      const y = 56 + i * 84;
      S.rect(s, 30, y, 820, 72, { fill: S.tint(col, 0.07), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, 48, y + 30, name, { size: 16, weight: 700, anchor: 'start', col: col });
      S.txt(s, 48, y + 58, what, { size: 15.5, anchor: 'start', col: C.ink });
    });

    S.rect(s, 30, 312, 820, 76, { fill: S.tint(C.blue, 0.07), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.8 });
    S.lines(s, 52, 344, [
      'In each one a boundary was expected to hold, and held only',
      'for as long as the agent kept cooperating with it.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* Two measured rates and two forecasts. The figure keeps them apart,
     because the forecasts are the numbers most often quoted as though
     they had been observed. */
  S.register('volume', host => {
    const s = S.scene(host, 880, 372);
    S.txt(s, 440, 28, 'What was counted, and what was forecast',
      { size: 17, weight: 700, col: C.ink });

    /* Bar length is proportional to the rate. The count sits inside the bar
       and every word sits outside it, so neither depends on bar width. */
    S.rect(s, 60, 60, 326, 50, { fill: S.tint(C.blue, 0.28), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.8 });
    S.txt(s, 223, 93, '132', { size: 24, weight: 700, col: C.ink });
    S.txt(s, 402, 93, 'CVE records per day, 2025', { size: 15.5, anchor: 'start', col: C.ink });

    S.rect(s, 60, 128, 430, 50, { fill: S.tint(C.orange, 0.28), fillStyle: 'solid', stroke: C.orange, strokeWidth: 1.8 });
    S.txt(s, 275, 161, '174', { size: 24, weight: 700, col: C.ink });
    S.txt(s, 506, 161, 'CVE records per day, 2026', { size: 15.5, anchor: 'start', col: C.ink });

    S.rect(s, 30, 200, 820, 160, { fill: S.tint(C.red, 0.06), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 440, 232, 'Projections, not measurements', { size: 16, weight: 700, col: C.red });
    S.lines(s, 52, 266, [
      'FIRST forecasts about 50,000 additional records during 2026.',
      'Jerry Gamblin of Cisco projects 70,135, a 45.6% increase.',
      'Both are forecasts. Neither is an observed total.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* The campaign ran 4.5 days. Only the second half was inside Hugging Face
     production. The two spans get quoted interchangeably, so they are drawn
     to scale beside each other. */
  S.register('timeline', host => {
    const s = S.scene(host, 880, 352);
    S.txt(s, 440, 28, 'Four and a half days, and where they were spent',
      { size: 17, weight: 700, col: C.ink });

    S.rect(s, 60, 62, 392, 48, { fill: S.tint(C.orange, 0.24), fillStyle: 'solid', stroke: C.orange, strokeWidth: 1.8 });
    S.txt(s, 256, 94, '2.3 days', { size: 18, weight: 700, col: C.ink });
    S.txt(s, 60, 140, 'Sandbox, cache proxy, public internet',
      { size: 15.5, anchor: 'start', col: C.ink });

    S.rect(s, 460, 62, 360, 48, { fill: S.tint(C.red, 0.24), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 640, 94, '2.2 days', { size: 18, weight: 700, col: C.ink });
    S.txt(s, 460, 140, 'Inside Hugging Face production',
      { size: 15.5, anchor: 'start', col: C.ink });

    S.rect(s, 30, 170, 820, 160, { fill: S.tint(C.blue, 0.06), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.8 });
    S.txt(s, 440, 202, 'What the reconstruction recovered', { size: 16, weight: 700, col: C.blue });
    S.lines(s, 52, 236, [
      'About 17,600 attacker actions, grouped into about 6,280 clusters.',
      'Five trust boundaries, none of them known to the next one along.',
      'Access cut on 13 July. Disclosed on 16 July.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });
})();
