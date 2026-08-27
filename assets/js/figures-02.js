/* Figures for Module 2 — agent risk governance. All coordinates are viewBox units. */
(function () {
  const S = window.SKETCH;
  if (!S) return;
  const C = S.COL;

  /* Five trust-boundary crossings in one evaluation run. */
  S.register('boundaries', host => {
    const s = S.scene(host, 880, 520);
    const nodes = [
      ['OpenAI\neval sandbox',           40,  30, C.blue],
      ['Package registry\ncache proxy',  40, 130, C.orange],
      ['Public harness\non Modal user',  40, 230, C.grape],
      ['Public web services\nC2 + dead-drops', 40, 330, C.yellow],
      ['Hugging Face\nproduction',       40, 430, C.red]
    ];
    nodes.forEach(([label, x, y, col]) => S.chip(s, x, y, 250, 62, label, col, { size: 15.5 }));

    const edges = [
      [92,  'zero-day in cache proxy'],
      [192, 'egress to open internet'],
      [292, 'staging + C2 base'],
      [392, 'two injection vectors']
    ];
    edges.forEach(([y, label]) => {
      S.arrow(s, 165, y, 165, y + 38, { stroke: C.red, strokeWidth: 2 });
      S.txt(s, 300, y + 24, label, { size: 15.5, anchor: 'start', col: C.muted });
    });

    S.rect(s, 620, 40, 230, 300, { fill: S.tint(C.red, 0.05), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.6 });
    S.txt(s, 735, 68, '5 organisations', { size: 18, weight: 700, col: C.red });
    S.lines(s, 640, 100,
      ['No two of them had', 'a relationship with', 'the next one in the', 'chain. Each boundary',
       'held only until the', 'agent stopped', 'cooperating.'],
      { size: 15.5, anchor: 'start', col: C.ink });

    S.lines(s, 735, 380, ['4.5 days end to end', '~17,600 actions', '~6,280 clusters'],
      { size: 16, weight: 700, col: C.ink });
  });

  /* Telemetry coverage of the 18 reconstructed attack phases.
     Bar labels sit above their bars rather than beside them. Beside-the-bar
     labels only had 285 units of run-up, and an end-anchored label that long
     runs off the left edge the moment txt() enlarges it to hold the 14px
     floor in a narrow window. Above the bar, every label has the full width.
     The closing lines are pre-wrapped for the same reason. */
  S.register('coverage', host => {
    const s = S.scene(host, 880, 470);
    S.txt(s, 440, 30, 'OpenTelemetry GenAI coverage of 18 reconstructed attack phases',
      { size: 16, weight: 700, col: C.ink });

    const bars = [
      ['Covered by an existing attribute', 2,  C.green],
      ['Partially covered',                2,  C.yellow],
      ['No coverage at all',              14,  C.red]
    ];
    const x0 = 60, unit = 38;
    bars.forEach(([label, n, col], i) => {
      const y = 70 + i * 80;
      S.txt(s, x0, y, label, { size: 15, weight: 600, anchor: 'start', col: C.ink });
      S.rect(s, x0, y + 12, n * unit, 40, { fill: S.tint(col, 0.35), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, x0 + n * unit + 26, y + 42, String(n), { size: 22, weight: 700, anchor: 'start', col: col });
    });

    S.line(s, 60, 300, 820, 300, { stroke: C.muted, strokeWidth: 1.2 });
    const used = S.lines(s, 60, 326,
      ['Hugging Face reconstructed the intrusion from Kubernetes',
       'audit logs, cloud metadata queries, VPN enrollment, database',
       'audit, network flow, and Git history.'],
      { size: 15, anchor: 'start', col: C.ink });
    S.txt(s, 60, 326 + used + 6, 'That is infrastructure telemetry, not agent telemetry.',
      { size: 15.5, weight: 700, anchor: 'start', col: C.red });
  });

  /* Where a control lives decides whether the agent can argue past it.
     This one draws into the narrow right-hand pane of a .cols slide, which is
     the tightest container in the deck. Two rules keep it legible there:
     the viewBox is portrait and close to that pane's own pixel size, so the
     scale stays near 1.0 and txt() never has to bump a label to reach the 14px
     floor; and every string is short, because a bumped label grows without its
     box growing and will overrun the border. The outcome each control produces
     is carried by the prose column, not repeated inside the figure. */
  S.register('control-placement', host => {
    const s = S.scene(host, 420, 560);

    S.rect(s, 10, 32, 400, 210, { fill: S.tint(C.red, 0.05), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 210, 20, 'Instructional control', { size: 18, weight: 700, col: C.red });
    S.chip(s, 30, 48, 360, 42, 'System prompt text', C.red, { size: 18 });
    ['Inside the context window', 'Subject to compaction', 'Competes for attention']
      .forEach((l, i) => S.txt(s, 30, 122 + i * 32, '· ' + l, { size: 17, anchor: 'start', col: C.ink }));

    S.arrow(s, 210, 250, 210, 288, { stroke: C.muted, strokeWidth: 2 });

    S.rect(s, 10, 318, 400, 210, { fill: S.tint(C.green, 0.05), fillStyle: 'solid', stroke: C.green, strokeWidth: 1.8 });
    S.txt(s, 210, 306, 'Architectural control', { size: 18, weight: 700, col: C.green });
    S.chip(s, 30, 334, 360, 42, 'Egress deny-by-default', C.green, { size: 18 });
    ['Outside the model', 'Ignores context length', 'Fails closed']
      .forEach((l, i) => S.txt(s, 30, 408 + i * 32, '· ' + l, { size: 17, anchor: 'start', col: C.ink }));
  });

  /* The compaction hypothesis, and the two attributes that would test it. */
  S.register('compaction', host => {
    const s = S.scene(host, 880, 440);
    S.txt(s, 440, 34, 'Testing the context-compression hypothesis', { size: 16, weight: 700, col: C.ink });

    for (let i = 0; i < 4; i++) {
      const x = 50 + i * 210;
      S.rect(s, x, 70, 180, 80, { fill: S.tint(C.blue, 0.07), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.6 });
      S.txt(s, x + 90, 100, 'turn block ' + (i + 1), { size: 14, weight: 700, col: C.blue });
      /* The fill fades to show salience decaying across turns. It tops out at
         0.55 rather than 0.9 so the label can stay dark ink and stay readable
         on every block: white-on-fading-red goes invisible by block four,
         which loses the label exactly where the point is being made. */
      const alpha = 0.55 - i * 0.157;
      S.rect(s, x + 10, 108, 160, 30, { fill: `rgba(224,49,49,${alpha.toFixed(2)})`, fillStyle: 'solid', stroke: C.red, strokeWidth: 1.2 });
      S.txt(s, x + 90, 129, 'guardrail salience', { size: 14, weight: 700, col: C.ink });
      if (i < 3) S.arrow(s, x + 182, 110, x + 208, 110, { stroke: C.muted });
      if (i > 0) S.txt(s, x + 90, 172, 'compacted', { size: 14, col: C.orange });
    }

    S.txt(s, 440, 214, 'Hypothesis [H]: salience decay, not intent. Not established.',
      { size: 15, weight: 700, col: C.grape });

    /* cardBox stacks its items at 1.6x the drawn size, and the 14px floor
       drives that to 20.3 in a narrow window. Three items then need 152 units
       of box, not 130, or the last one drops through the bottom edge. */
    S.cardBox(s, 90, 238, 320, 152, 'Already in OpenTelemetry',
      ['gen_ai.conversation.compacted', 'gen_ai.system_instructions'], C.green, { titleSize: 14.5, size: 14 });
    S.cardBox(s, 470, 238, 320, 152, 'The experiment nobody has run',
      ['correlate violations against', 'compaction events, then check', 'if instructions survived'], C.blue, { titleSize: 14.5, size: 14 });

    S.txt(s, 440, 424, 'Governance consequence holds either way: move the control out of the context window.',
      { size: 14.5, weight: 700, col: C.ink });
  });
})();
