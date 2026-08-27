/* Figures for Module 3 — standards and coordination. Coordinates are viewBox units.

   Sizing rules learned the hard way in Module 2, and enforced by
   tools/audit-deck.js:
     - A full-width figure renders at about 0.9x on a 1280x720 projector, so
       its label sizes start at 15.5 to clear the 14px floor without txt()
       having to enlarge them.
     - A figure in the narrow right pane of a .cols slide renders at about
       0.75x, so it uses a portrait viewBox near the pane's own pixel size and
       label sizes from 17.
     - Strings stay short. An enlarged label grows without its box growing. */
(function () {
  const S = window.SKETCH;
  if (!S) return;
  const C = S.COL;

  /* The v0.8 model can only add. Shown on a 0-10 track so the three terms are
     lengths rather than symbols: what the CVE is worth, the headroom above it,
     and how much of that headroom agentic capability closes. */
  S.register('aivss-model', host => {
    const s = S.scene(host, 880, 470);
    S.txt(s, 440, 32, 'AIVSS v0.8 closes a gap. It cannot subtract.', { size: 17, weight: 700, col: C.ink });
    S.txt(s, 440, 60, 'Worked example: Agent Goal and Instruction Manipulation', { size: 15.5, col: C.muted });

    const x0 = 70, w = 740, y = 96, h = 52;
    const at = v => x0 + (v / 10) * w;

    S.rect(s, x0, y, w, h, { fill: 'rgba(0,0,0,0)', stroke: C.muted, strokeWidth: 1.4 });
    S.rect(s, x0, y, at(2.1) - x0, h, { fill: S.tint(C.blue, 0.45), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.8 });
    S.rect(s, at(2.1), y, at(7.08) - at(2.1), h, { fill: S.tint(C.red, 0.35), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });

    S.txt(s, (x0 + at(2.1)) / 2, y + 33, '2.1', { size: 17, weight: 700, col: C.blue });
    S.txt(s, (at(2.1) + at(7.08)) / 2, y + 33, 'AARS  4.98', { size: 17, weight: 700, col: C.red });
    S.txt(s, (at(7.08) + at(10)) / 2, y + 33, 'unclosed', { size: 15.5, col: C.muted });

    [[0, '0'], [2.1, 'CVSS 2.1'], [7.1, 'AIVSS 7.1'], [10, '10']].forEach(([v, label]) => {
      S.line(s, at(v), y + h, at(v), y + h + 12, { stroke: C.muted, strokeWidth: 1.2 });
      S.txt(s, at(v), y + h + 34, label, { size: 15.5, weight: 700, col: C.ink });
    });

    /* Line counts and box heights below assume the worst case, which is a
       narrow window where txt() enlarges every label to hold the 14px floor.
       At scale 0.69 the line height grows from 22.5 to 29.4 units, so three
       lines need the room four would take at full size. */
    S.lines(s, 70, 214, [
      'Risk_Gap  = 10 - CVSS_Base                    = 7.9',
      'AARS      = Risk_Gap x (Factor_Sum/10) x ThM  = 7.9 x 0.65 x 0.97',
      'AIVSS     = (CVSS_Base + AARS) x Mitigation   = 7.08 -> 7.1'
    ], { size: 15.5, anchor: 'start', col: C.ink, font: "'JetBrains Mono', monospace" });

    S.rect(s, 70, 300, 740, 140, { fill: S.tint(C.grape, 0.06), fillStyle: 'solid', stroke: C.grape, strokeWidth: 1.6 });
    S.lines(s, 90, 332, [
      'v0.5 averaged the scores, so a severe CVE scored LOWER',
      'once agentic capability was added. 9.4 CVSS gave 8.7.',
      'The same risk is 9.9 under v0.8. That is the lesson.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* The lower the CVSS, the larger the uplift. That is the model working as
     designed, and it is also the thing an engineering audience most needs to
     see before they trust a 7.1 on a CVSS 2.1 defect. */
  S.register('uplift', host => {
    const s = S.scene(host, 880, 470);
    S.txt(s, 440, 30, 'Where the agentic uplift actually lands', { size: 17, weight: 700, col: C.ink });

    const rows = [
      ['Goal and Instruction Manipulation', 2.1, 7.1],
      ['Memory and Context Manipulation',   5.8, 8.9],
      ['Cascading Failures',                7.1, 9.4],
      ['Tool Misuse',                       9.4, 9.9]
    ];
    const x0 = 70, w = 560, at = v => x0 + (v / 10) * w;

    rows.forEach(([label, cvss, aivss], i) => {
      const y = 74 + i * 88;
      S.txt(s, x0, y, label, { size: 15.5, weight: 600, anchor: 'start', col: C.ink });
      S.rect(s, x0, y + 12, at(cvss) - x0, 34,
        { fill: S.tint(C.blue, 0.35), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.6 });
      S.rect(s, at(cvss), y + 12, at(aivss) - at(cvss), 34,
        { fill: S.tint(C.red, 0.30), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.6 });
      S.txt(s, at(aivss) + 22, y + 36, cvss + ' -> ' + aivss, { size: 16, weight: 700, anchor: 'start', col: C.ink });
    });

    S.txt(s, 70, 432, 'Blue is the CVE. Red is what the deployment context adds.',
      { size: 15.5, weight: 700, anchor: 'start', col: C.ink });
  });

  /* Four branches, and the one nobody serves. Drawn wide because the terminal
     names have to be readable from the back of the room. */
  S.register('routing', host => {
    const s = S.scene(host, 880, 480);
    S.txt(s, 440, 30, 'You found a flaw in an agentic system. Where does it go?',
      { size: 17, weight: 700, col: C.ink });

    const branches = [
      ['A  Software defect\nin AI infrastructure', C.blue,   'Akrites, CNA,\nvendor VDP, VINCE'],
      ['B  Model behavioural\nflaw',               C.teal,   'Provider programme,\nFLARE-AI, AVID'],
      ['C  Agent runtime\nflaw',                   C.red,    'No native terminal.\nDecompose and split'],
      ['D  Dataset or supply\nchain flaw',         C.green,  'Platform abuse,\nAkrites, AVID']
    ];

    branches.forEach(([label, col, terminal], i) => {
      const x = 40 + i * 208;
      S.chip(s, x, 70, 190, 86, label, col, { size: 15.5 });
      S.arrow(s, x + 95, 164, x + 95, 196, { stroke: C.muted, strokeWidth: 1.8 });
      S.chip(s, x, 204, 190, 86, terminal, col, { size: 15.5, box: { fill: 'rgba(0,0,0,0)' } });
    });

    S.rect(s, 40, 312, 800, 150, { fill: S.tint(C.red, 0.06), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 440, 342, 'Branch C is the finding this course exists for', { size: 16.5, weight: 700, col: C.red });
    S.lines(s, 64, 374, [
      'Nine destinations resolve. None publishes a procedure for choosing.',
      'No terminal takes an agent runtime flaw natively, so Branch C splits it',
      'into parts other systems accept, losing what made it an agent flaw.'
    ], { size: 15.5, anchor: 'start', col: C.ink });
  });

  /* Narrow right-hand pane: portrait viewBox, short strings, sizes from 17. */
  S.register('one-flaw-three-routes', host => {
    const s = S.scene(host, 420, 560);
    S.txt(s, 210, 24, 'ExploitGym needed three', { size: 18, weight: 700, col: C.ink });

    const rows = [
      ['Branch A', 'Zero-day in a cache proxy', C.blue],
      ['Branch C', 'Agent crossed five boundaries', C.red],
      ['Branch B', 'Specification gaming', C.teal]
    ];
    rows.forEach(([tag, what, col], i) => {
      const y = 52 + i * 130;
      S.rect(s, 12, y, 396, 112, { fill: S.tint(col, 0.06), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, 32, y + 34, tag, { size: 18, weight: 700, anchor: 'start', col: col });
      S.lines(s, 32, y + 66, what.split(' ').reduce((acc, word) => {
        const last = acc[acc.length - 1];
        if (last && (last + ' ' + word).length <= 24) acc[acc.length - 1] = last + ' ' + word;
        else acc.push(word);
        return acc;
      }, []), { size: 17, anchor: 'start', col: C.ink });
    });

    S.txt(s, 210, 486, 'No single destination', { size: 17, weight: 700, col: C.red });
    S.txt(s, 210, 516, 'would have taken all three.', { size: 17, weight: 700, col: C.red });
  });
})();
