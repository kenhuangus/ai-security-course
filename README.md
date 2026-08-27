# AI Security Engineering, Agent Risk Governance, and Vulnerability Standards

A three-hour course published as a static GitHub Pages site. Slide decks plus companion
reference pages, built from primary sources with confidence tags on every material claim.

Owner: Ken Huang. Brief date 2026-08-27.

## Status

Phase 1 research is in progress. Phase 2 build begins once the synthesis deliverables land.
Nothing in `slides/` should be treated as final until `research/gaps.md` is closed out.

## Open decisions for the owner

These four are flagged rather than guessed. Items 1 and 2 block work.

**1. Bilingual scope.** The source topics originated in Chinese. Is the site English-only with a
bilingual glossary, or fully bilingual? The glossary is built either way. Full bilingual roughly
doubles the slide work and needs confirming before Module 2 is written, because Module 2 is the
largest deck and is built first.

**2. Delivery date.** Determines whether Akrites is described as pre-launch or operational, and
whether OpenAI's fuller incident account exists by delivery. Akrites was expected to become
operational in September 2026, which is after the brief date and possibly before delivery.

**3. Attribution posture on Reuters-sourced details.** The one-week detection delay and the FBI
notification come from Reuters citing anonymous sources, and OpenAI said that report contained
inaccuracies without specifying them. Include with named attribution, or omit entirely?

**4. Capstone AIVSS score status.** The owner is AIVSS project lead. A published score for the
ExploitGym incident may carry weight it is not intended to carry. Publish as a project position,
or label explicitly as a teaching exercise?

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

No "§" symbol anywhere. No horizontal rules used as prose separators. No `localStorage` or
`sessionStorage` in any page. No exploit code or reproduction steps. Every factual claim on a
slide carries a source, and anonymous-sourced claims name their outlet on the slide face.
