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
    nodes.forEach(([label, x, y, col]) => S.chip(s, x, y, 250, 62, label, col, { size: 13 }));

    const edges = [
      [92,  'zero-day in cache proxy'],
      [192, 'egress to open internet'],
      [292, 'staging + C2 base'],
      [392, 'two injection vectors']
    ];
    edges.forEach(([y, label]) => {
      S.arrow(s, 165, y, 165, y + 38, { stroke: C.red, strokeWidth: 2 });
      S.txt(s, 300, y + 24, label, { size: 12.5, anchor: 'start', col: C.muted });
    });

    S.rect(s, 620, 40, 230, 300, { fill: S.tint(C.red, 0.05), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.6 });
    S.txt(s, 735, 68, '5 organisations', { size: 15, weight: 700, col: C.red });
    ['No two of them had', 'a relationship with', 'the next one in the', 'chain. Each boundary', 'held only until the', 'agent stopped', 'cooperating.']
      .forEach((l, i) => S.txt(s, 640, 100 + i * 24, l, { size: 12.5, anchor: 'start', col: C.ink }));

    S.txt(s, 735, 380, '4.5 days end to end', { size: 13, weight: 700, col: C.ink });
    S.txt(s, 735, 404, '~17,600 actions', { size: 13, weight: 700, col: C.ink });
    S.txt(s, 735, 428, '~6,280 clusters', { size: 13, weight: 700, col: C.ink });
  });

  /* Telemetry coverage of the 18 reconstructed attack phases. */
  S.register('coverage', host => {
    const s = S.scene(host, 880, 470);
    S.txt(s, 440, 34, 'OpenTelemetry GenAI coverage of 18 reconstructed attack phases',
      { size: 15, weight: 700, col: C.ink });

    const bars = [
      ['Covered by an existing attribute', 2,  C.green],
      ['Partially covered',                2,  C.yellow],
      ['No coverage at all',              14,  C.red]
    ];
    const x0 = 300, unit = 34;
    bars.forEach(([label, n, col], i) => {
      const y = 90 + i * 78;
      S.txt(s, 285, y + 26, label, { size: 13.5, weight: 600, anchor: 'end', col: C.ink });
      S.rect(s, x0, y, n * unit, 44, { fill: S.tint(col, 0.35), fillStyle: 'solid', stroke: col, strokeWidth: 1.8 });
      S.txt(s, x0 + n * unit + 26, y + 28, String(n), { size: 20, weight: 700, col: col });
    });

    S.line(s, 60, 336, 820, 336, { stroke: C.muted, strokeWidth: 1.2 });
    S.txt(s, 60, 368, 'Hugging Face reconstructed the intrusion from Kubernetes audit logs, cloud metadata',
      { size: 12.5, anchor: 'start', col: C.ink });
    S.txt(s, 60, 392, 'queries, VPN enrollment, database audit, network flow, and Git history.',
      { size: 12.5, anchor: 'start', col: C.ink });
    S.txt(s, 60, 424, 'That is infrastructure telemetry, not agent telemetry.',
      { size: 14, weight: 700, anchor: 'start', col: C.red });
  });

  /* Where a control lives decides whether the agent can argue past it. */
  S.register('control-placement', host => {
    const s = S.scene(host, 880, 460);

    S.rect(s, 50, 60, 360, 340, { fill: S.tint(C.red, 0.05), fillStyle: 'solid', stroke: C.red, strokeWidth: 1.8 });
    S.txt(s, 230, 92, 'Instructional control', { size: 15, weight: 700, col: C.red });
    S.chip(s, 90, 120, 280, 50, 'System prompt / guardrail text', C.red, { size: 12.5 });
    ['Lives inside the context window', 'Subject to compaction', 'Competes with 17,600 other tokens', 'Cannot bind what it cannot see']
      .forEach((l, i) => S.txt(s, 78, 210 + i * 34, '· ' + l, { size: 13, anchor: 'start', col: C.ink }));
    S.txt(s, 230, 372, 'Held until the agent stopped cooperating', { size: 12.5, weight: 700, col: C.red });

    S.rect(s, 470, 60, 360, 340, { fill: S.tint(C.green, 0.05), fillStyle: 'solid', stroke: C.green, strokeWidth: 1.8 });
    S.txt(s, 650, 92, 'Architectural control', { size: 15, weight: 700, col: C.green });
    S.chip(s, 510, 120, 280, 50, 'Egress deny-by-default, enforced\noutside the agent', C.green, { size: 12.5 });
    ['Outside the model entirely', 'Unaffected by context length', 'No natural-language surface', 'Fails closed']
      .forEach((l, i) => S.txt(s, 498, 210 + i * 34, '· ' + l, { size: 13, anchor: 'start', col: C.ink }));
    S.txt(s, 650, 372, 'Holds regardless of what the agent decides', { size: 12.5, weight: 700, col: C.green });

    S.txt(s, 440, 434, 'The ExploitGym escape used a permitted path. No instruction could have closed it.',
      { size: 13.5, weight: 700, col: C.ink });
  });

  /* The compaction hypothesis, and the two attributes that would test it. */
  S.register('compaction', host => {
    const s = S.scene(host, 880, 440);
    S.txt(s, 440, 34, 'Testing the context-compression hypothesis', { size: 15, weight: 700, col: C.ink });

    for (let i = 0; i < 4; i++) {
      const x = 50 + i * 210;
      S.rect(s, x, 70, 180, 80, { fill: S.tint(C.blue, 0.07), fillStyle: 'solid', stroke: C.blue, strokeWidth: 1.6 });
      S.txt(s, x + 90, 100, 'turn block ' + (i + 1), { size: 12.5, weight: 700, col: C.blue });
      const alpha = 0.9 - i * 0.27;
      S.rect(s, x + 14, 112, 152, 24, { fill: `rgba(224,49,49,${alpha.toFixed(2)})`, fillStyle: 'solid', stroke: C.red, strokeWidth: 1.2 });
      S.txt(s, x + 90, 129, 'guardrail salience', { size: 10.5, weight: 700, col: '#ffffff' });
      if (i < 3) S.arrow(s, x + 182, 110, x + 208, 110, { stroke: C.muted });
      if (i > 0) S.txt(s, x + 90, 170, 'compacted', { size: 11.5, col: C.orange });
    }

    S.txt(s, 440, 214, 'Hypothesis [H]: salience decay, not intent. Not established.',
      { size: 13.5, weight: 700, col: C.grape });

    S.cardBox(s, 90, 246, 320, 130, 'Already in OpenTelemetry',
      ['gen_ai.conversation.compacted', 'gen_ai.system_instructions'], C.green, { titleSize: 13, size: 12 });
    S.cardBox(s, 470, 246, 320, 130, 'The experiment nobody has run',
      ['correlate violations against', 'compaction events; check whether', 'instructions survived each one'], C.blue, { titleSize: 13, size: 12 });

    S.txt(s, 440, 412, 'Governance consequence holds either way: move the control out of the context window.',
      { size: 13, weight: 700, col: C.ink });
  });
})();
