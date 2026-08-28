"""check-decks.py - structure and house-style gate for the slide decks.

tools/audit-deck.js checks how a deck renders. This checks what is in the
file: that the deck is wired to deck.js correctly, that every figure a slide
asks for is actually registered, and that the writing rules this course set
for itself are being kept.

    python tools/check-decks.py

Exit code is 0 only when every deck passes every check. Anything reported
here is a defect in the deck, not a tolerance to widen.
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLIDES = os.path.join(ROOT, 'slides')
JS = os.path.join(ROOT, 'assets', 'js')

REQUIRED_IDS = ['slideTitle', 'fsBtn', 'prevBtn', 'dots', 'count', 'nextBtn', 'progress']
SCRIPT_ORDER = ['rough.min.js', 'sketch.js', 'notes.js', 'deck.js']


def read(path):
    return io.open(path, encoding='utf-8').read()


def check(deck, fails):
    name = os.path.basename(deck)
    s = read(deck)

    def bad(msg):
        fails.append('%s: %s' % (name, msg))

    # --- wiring -----------------------------------------------------------
    for i in REQUIRED_IDS:
        if 'id="%s"' % i not in s:
            bad('missing id="%s", deck.js will not bind to it' % i)

    scripts = re.findall(r'<script src="[^"]*/([^"/]+)"', s)
    core = [x for x in scripts if x in SCRIPT_ORDER]
    if core != SCRIPT_ORDER:
        bad('script order is %s, expected %s' % (core, SCRIPT_ORDER))

    figfiles = [x for x in scripts if x.startswith('figures-')]
    if scripts and scripts.index('notes.js') < max(
            [scripts.index(f) for f in figfiles] or [-1]):
        bad('a figures file loads after notes.js')

    # --- slides -----------------------------------------------------------
    slides = re.findall(r'<section class="slide[^"]*"[^>]*>', s)
    if not slides:
        bad('no slides found')
        return

    for tag in slides:
        if 'data-title=' not in tag:
            bad('a slide has no data-title: %s' % tag[:70])

    active = [t for t in slides if 'is-active' in t]
    if len(active) != 1:
        bad('%d slides carry is-active, expected exactly 1' % len(active))

    if s.count('<div class="slide__in') != len(slides):
        bad('%d slides but %d .slide__in wrappers'
            % (len(slides), s.count('<div class="slide__in')))

    m = re.search(r'id="count"[^>]*>\s*1\s*/\s*(\d+)', s)
    if not m:
        bad('the counter does not read "1 / N"')
    elif int(m.group(1)) != len(slides):
        bad('counter says %s slides, file has %d' % (m.group(1), len(slides)))

    # --- figures ----------------------------------------------------------
    asked = re.findall(r'data-fig="([^"]+)"', s)
    registered = set()
    for f in figfiles:
        p = os.path.join(JS, f)
        if not os.path.exists(p):
            bad('loads %s, which does not exist' % f)
            continue
        registered |= set(re.findall(r"S\.register\('([^']+)'", read(p)))
    for a in asked:
        if a not in registered:
            bad('slide asks for figure "%s", which no loaded file registers' % a)
    for r in sorted(registered - set(asked)):
        bad('figure "%s" is registered but no slide uses it' % r)

    # --- house style ------------------------------------------------------
    # Section references are written as the word, per the course brief.
    if '§' in s:
        bad('uses the section sign; write the word "Section"')

    # Horizontal rules are not paragraph separators here. Headings are.
    if re.search(r'<hr\b', s):
        bad('uses <hr> as a separator; use a heading')

    # The site stores nothing in the browser. The names are assembled rather
    # than written out, because README promises the prohibited API names do not
    # appear anywhere in this repository, including in the check that bans them.
    for api in ('local' + 'Storage', 'session' + 'Storage'):
        if api in s:
            bad('references %s; the course stores nothing in the browser' % api)

    # Every slide that states something has to say where it came from.
    for i, body in enumerate(re.split(r'<section class="slide', s)[1:], 1):
        if 'class="tbl"' in body or 'class="bullets"' in body:
            if 'class="source"' not in body:
                title = re.search(r'data-title="([^"]*)"', body)
                bad('slide %d (%s) makes claims with no source line'
                    % (i, title.group(1) if title else '?'))


def main():
    decks = sorted(
        os.path.join(SLIDES, f) for f in os.listdir(SLIDES) if f.endswith('.html'))
    fails = []
    for d in decks:
        check(d, fails)

    print('checked %d decks' % len(decks))
    for f in fails:
        print('  FAIL  %s' % f)
    if fails:
        print('\n%d problem(s)' % len(fails))
        return 1
    print('structure, wiring, figures and house style all pass')
    return 0


if __name__ == '__main__':
    sys.exit(main())
