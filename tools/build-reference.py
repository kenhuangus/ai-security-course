"""build-reference.py - generate the two data-driven reference pages.

reference/bibliography.html and reference/glossary.html are rendered from
research/bibliography.md and research/glossary-en-zh.md. Neither page is
edited by hand: a URL or a term that appears on the site has to exist in the
research file first, which is the only way the bibliography can be trusted
to match what was actually checked.

    python tools/build-reference.py

Re-run it after editing either research file, and commit both outputs.
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CONF = {'[P]': 'primary', '[S]': 'secondary', '[A]': 'anonymous', '[H]': 'hypothesis'}


def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))


def inline(s):
    """Markdown emphasis, code and bare URLs to HTML. Links open in a new tab."""
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![">])(https?://[^\s<|]+)',
               r'<a href="\1" target="_blank" rel="noopener">\1</a>', s)
    for tag, cls in CONF.items():
        s = s.replace(esc(tag), '<span class="conf conf--%s">%s</span>' % (cls, tag))
    return s


def parse(path):
    """Split a research file into sections of tables and paragraphs."""
    lines = io.open(path, encoding='utf-8').read().splitlines()
    sections, cur, para = [], None, []

    def flush():
        if para:
            cur['blocks'].append(('para', ' '.join(para)))
            del para[:]

    for i, ln in enumerate(lines):
        if ln.startswith('## '):
            if cur:
                flush()
                sections.append(cur)
            cur = {'title': ln[3:].strip(), 'blocks': []}
            continue
        if cur is None:
            continue
        if ln.startswith('|'):
            flush()
            cells = [c.strip() for c in ln.strip().strip('|').split('|')]
            if set(''.join(cells)) <= set('-: '):
                continue                      # the separator row
            if cur['blocks'] and cur['blocks'][-1][0] == 'table':
                cur['blocks'][-1][1]['rows'].append(cells)
            else:
                cur['blocks'].append(('table', {'head': cells, 'rows': []}))
            continue
        if ln.strip():
            para.append(ln.strip())
        else:
            flush()
    if cur:
        flush()
        sections.append(cur)
    return sections


PAGE = u"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500;700&amp;family=Kalam:wght@400;700&amp;family=Noto+Sans+SC:wght@400;500;700&amp;family=Space+Grotesk:wght@500;600;700;800&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/site.css">
<style>
  .search {
    width: 100%%; font-family: var(--sans); font-size: 1rem;
    padding: .5rem .85rem; border: 1px solid var(--line); border-radius: 8px;
    background: var(--card); color: var(--text); margin: 1rem 0 .4rem;
  }
  .count { font-family: var(--mono); font-size: .95rem; color: var(--muted); margin: 0 0 1rem; }
  tr.hidden, section.hidden { display: none; }
  .conf {
    font-family: var(--mono); font-size: .875rem; font-weight: 700;
    padding: .1rem .4rem; border-radius: 4px; white-space: nowrap;
  }
  .conf--primary   { background: #e9f7ef; color: #1c5a2c; }
  .conf--secondary { background: #fff6e6; color: #7a4c00; }
  .conf--anonymous { background: #fff5f5; color: #961b1b; }
  .conf--hypothesis{ background: #eef1fb; color: #303a86; }
  [data-theme="dark"] .conf--primary   { background: #16351f; color: #7fdba0; }
  [data-theme="dark"] .conf--secondary { background: #3a2c10; color: #ffc978; }
  [data-theme="dark"] .conf--anonymous { background: #3a1717; color: #ff9c9c; }
  [data-theme="dark"] .conf--hypothesis{ background: #1c2148; color: #aab4f5; }
  td a { word-break: break-word; }
  .zh { font-family: "Noto Sans SC", var(--sans); font-weight: 500; }
</style>
</head>
<body>

<nav class="topbar">
  <div class="topbar__brand">AI Security <span>&middot;</span> Reference</div>
  <a href="../index.html">Course home</a>
  %(nav)s
  <button class="btn" id="themeBtn">Dark</button>
</nav>

<header class="hero"><div class="wrap">
  <div class="eyebrow">%(eyebrow)s</div>
  <h1>%(h1)s</h1>
  <p>%(intro)s</p>
</div></header>

<div class="wrap">
  <input class="search" id="q" type="search" placeholder="%(placeholder)s" aria-label="Filter">
  <p class="count" id="count"></p>
%(body)s
</div>

<footer><div class="wrap">%(footer)s</div></footer>

<script>
(function () {
  var btn = document.getElementById('themeBtn');
  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.textContent = dark ? 'Light' : 'Dark';
  }
  btn.addEventListener('click', function () { dark = !dark; applyTheme(); });
  applyTheme();

  var q = document.getElementById('q');
  var countEl = document.getElementById('count');
  var rows = Array.prototype.slice.call(document.querySelectorAll('tbody tr'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('section'));

  function apply() {
    var term = q.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (r) {
      var hit = !term || r.textContent.toLowerCase().indexOf(term) !== -1;
      r.classList.toggle('hidden', !hit);
      if (hit) shown++;
    });
    // Hide a section whose every row is filtered out, so the page does not
    // fill with empty headings while searching.
    sections.forEach(function (s) {
      var own = s.querySelectorAll('tbody tr');
      var vis = s.querySelectorAll('tbody tr:not(.hidden)');
      s.classList.toggle('hidden', own.length > 0 && vis.length === 0);
    });
    countEl.textContent = shown + ' of ' + rows.length + ' %(unit)s shown';
  }
  q.addEventListener('input', apply);
  apply();
})();
</script>
</body>
</html>
"""


def render_sections(sections, zh_col=None):
    out = []
    for sec in sections:
        parts = ['<section>', '  <h2>%s</h2>' % esc(sec['title'])]
        for kind, block in sec['blocks']:
            if kind == 'para':
                parts.append('  <p>%s</p>' % inline(block))
            else:
                parts.append('  <div class="scroll-x"><table>')
                parts.append('    <thead><tr>%s</tr></thead>'
                             % ''.join('<th>%s</th>' % esc(h) for h in block['head']))
                parts.append('    <tbody>')
                for row in block['rows']:
                    tds = []
                    for i, cell in enumerate(row):
                        cls = ' class="zh"' if zh_col is not None and i == zh_col else ''
                        tds.append('<td%s>%s</td>' % (cls, inline(cell)))
                    parts.append('      <tr>%s</tr>' % ''.join(tds))
                parts.append('    </tbody>')
                parts.append('  </table></div>')
        parts.append('</section>')
        out.append('\n'.join(parts))
    return '\n\n'.join(out)


def build(src, dest, **kw):
    sections = parse(os.path.join(ROOT, 'research', src))
    kw['body'] = render_sections(sections, kw.pop('zh_col', None))
    path = os.path.join(ROOT, 'reference', dest)
    io.open(path, 'w', encoding='utf-8').write(PAGE % kw)
    rows = sum(len(b[1]['rows']) for s in sections for b in s['blocks'] if b[0] == 'table')
    print('%-22s %d sections, %d rows' % (dest, len(sections), rows))
    return rows


def main():
    build(
        'bibliography.md', 'bibliography.html',
        title='Bibliography',
        desc='Every source consulted for this course with publisher, date, confidence tag, and the live HTTP status recorded when it was checked.',
        nav='<a href="../research/bibliography.md">Source file</a>\n  <a href="../research/gaps.md">Gaps</a>',
        eyebrow='Every claim on a slide traces to a row here',
        h1='Bibliography',
        intro='Publisher, date, confidence tag, and the HTTP status each URL returned on 2026-08-27. '
              'A 403 means the host blocks automated retrieval rather than that the page is missing. '
              'Sources listed as not read for content resolve but were not consulted, and anything '
              'cited from them has to be read first.',
        placeholder=u'Filter by title, publisher, or URL…',
        unit='sources',
        footer='Generated from research/bibliography.md by tools/build-reference.py. Edit the research file, not this page.')

    build(
        'glossary-en-zh.md', 'glossary.html',
        title='Glossary, English and 中文',
        desc='Bilingual terminology for the course, grouped by where each term first appears, written for an engineer who knows security but not agentic AI or the reverse.',
        nav='<a href="../research/glossary-en-zh.md">Source file</a>',
        eyebrow='English / 中文',
        h1='Glossary',
        intro='Terms are grouped by where they first appear in the course. Definitions are written '
              'for an engineer who knows security but not agentic AI, or the other way round.',
        placeholder=u'Filter by term, 中文, or definition…',
        unit='terms',
        zh_col=1,
        footer='Generated from research/glossary-en-zh.md by tools/build-reference.py. Edit the research file, not this page.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
