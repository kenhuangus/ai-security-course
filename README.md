# AI Security Engineering, Agent Risk Governance, and Vulnerability Standards

A course published as a static GitHub Pages site. Slide decks plus companion
reference pages, built from primary sources with confidence tags on every material claim.

Owner: Ken Huang. Brief date 2026-08-27.

## Status

Phase 1 research is complete. Phase 2 build is under way, Module 2 first.
Nothing in `slides/` should be treated as final until `research/gaps.md` is closed out.

## Owner decisions, resolved 2026-08-27

**1. Bilingual scope: English-first, with i18n hooks in place.** Decks are authored in English.
Every translatable string carries a `data-i18n` key so a Chinese track can be added later as a
translation table rather than a slide-by-slide rewrite. The glossary is bilingual now.

**2. Delivery date: September to October 2026.** Akrites goes live for automated intake in
September 2026, so it is described as launching into operation during the course window. The
Akrites slide is built so a single status line can be updated without restructuring it, and its
pre-launch report figures are labelled as pre-launch.

**3. Reuters-sourced details: included, attributed on the slide face.** The one-week detection
delay and the FBI notification appear with Reuters named on the slide, together with the note
that OpenAI said the report contained inaccuracies without specifying them.

**4. Capstone AIVSS score: labelled a teaching exercise.** Every slide carrying the score says so,
and the sensitivity analysis stays visible. It is not presented as an AIVSS project position.

## Corrections already made to the brief's ground truth

Recorded here because they change slide content. Full detail in the research files.

| Brief said | Verified | Source |
|---|---|---|
| AIVSS scoring is CVSS plus agentic assessment, halved, times an environmental factor | That is the v0.5 model. v0.8 is a gap-closing uplift model with a Threat Multiplier and a separate Mitigation Factor | AIVSS v0.8 PDF, Sections 3.3 and 3.4 |
| ExploitGym is an OpenAI benchmarking framework | ExploitGym is a UC Berkeley RDI benchmark. OpenAI ran an internal evaluation based on it | Hugging Face postmortem |
| CVE-2026-65617 and CVE-2026-65925 were the sandbox-escape zero-days | Hugging Face names no CVEs. Both CVEs are real JFrog Artifactory defects published after the incident. The linkage is secondary inference, and their severities differ (8.8 deserialization, 6.5 SSRF) | NVD API, Hugging Face postmortem |
| Modal Labs was a second affected vendor | The agent abused a public harness hosted by a Modal *user*. Modal was a waypoint, not a victim | Hugging Face postmortem |
| CVE-2026-4747 is an unauthenticated RCE | The overflow is reachable pre-auth, but the advisory describes kernel RCE as requiring an authenticated user. Vector is `PR:L`, CVSS 8.8 | FreeBSD-SA-26:08, NVD API |
| Mythos discovered CVE-2026-4747 autonomously | FreeBSD credits "Nicholas Carlini using Claude, Anthropic". Human-in-the-loop attribution at primary source | FreeBSD-SA-26:08 |

## Layout

```
index.html          landing page, agenda, links
assets/             site and deck CSS, deck engine, figures
slides/             one HTML deck per block
reference/          companion pages built from research output
labs/               paper-based worksheets and solutions
research/           Phase 1 output, published as written
```

## Local preview

No build step. Open `index.html` directly, or serve the directory:

```bash
python -m http.server 8000
```

## Deck engine

Decks use the `html-slides` engine rather than reveal.js: hand-authored `<section class="slide">`
markup, one navigation script, a viewport-locked stylesheet. Self-contained and offline-capable,
which matters for presenting from a conference network. Arrow keys or space advance, `F` toggles
fullscreen, `#7` deep-links slide 7, and browser print with background graphics produces a PDF.

## Rules this repository follows

The section-sign symbol never appears; cross-references are written with the word "Section".
No horizontal rules are used as prose separators. No browser storage APIs are called in any
page. No exploit code or reproduction steps. Every factual claim on a slide carries a source,
and anonymous-sourced claims name their outlet on the slide face.

These are greppable rules, so the repository keeps them literally true: the prohibited symbol
and the prohibited API names do not appear even inside comments describing the prohibition.
