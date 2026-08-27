# Gaps, unverified claims, and open questions

Last updated 2026-08-27. This file is a deliverable, not an apology. A gaps slide appears in Module 3 and the capstone because stating plainly what is not known is a credibility asset.

Nothing listed here may appear on a slide as an established fact.

## A. Claims corrected against primary sources

These were in the brief's ground truth and did not survive verification. They are fixed in the research files and summarized in `README.md`. Listed here so the correction is not lost.

| Claim as briefed | Verified position | Source |
|---|---|---|
| AIVSS = (CVSS + agentic assessment) / 2 × environmental factor | That is v0.5. v0.8 is a gap-closing model: `AARS = (10 − CVSS_Base) × (Factor_Sum/10) × ThM`, then `AIVSS = (CVSS_Base + AARS) × Mitigation_Factor` | AIVSS v0.8 PDF, Sections 3.3–3.4 `[P]` |
| ExploitGym is an OpenAI benchmarking framework | A UC Berkeley RDI benchmark. OpenAI ran an internal evaluation based on it | Hugging Face postmortem `[P]` |
| CVE-2026-65617 and 65925 were the escape zero-days | Hugging Face names no CVEs. Linkage is secondary inference. Severities differ: 8.8 deserialization and 6.5 SSRF | NVD API, Hugging Face postmortem |
| Modal Labs was a second affected vendor | The agent abused a public harness hosted by a Modal *user*. Modal was a waypoint | Hugging Face postmortem `[P]` |
| CVE-2026-4747 is an unauthenticated RCE | Overflow reachable pre-auth; kernel RCE described as requiring an authenticated user. `PR:L`, CVSS 8.8, CWE-121 | FreeBSD-SA-26:08, NVD `[P]` |
| Mythos discovered CVE-2026-4747 autonomously | FreeBSD credits "Nicholas Carlini using Claude, Anthropic" | FreeBSD-SA-26:08 `[P]` |
| Akrites has 20+ founding members | The press release names 19 organizations. Secondary coverage says "over 20" | Linux Foundation release `[P]` |
| Akrites has little or no operational data | ~3,000 reports in two months, ~30% duplicates, as of 2026-08-19 | Infosecurity Magazine `[S]` |
| Unit 42 actor achieved autonomous exploitation | Autonomous recon succeeded; both autonomous exploitation attempts failed. All successes were manual | Unit 42 `[P]` |
| MI9 proposes an "Agentic Telemetry Schema (ATS)" | The paper names "agent-semantic telemetry capture" as one of six components. ATS not found in the abstract | arXiv 2508.03858 `[P]` |
| CWE XD-SIG has consolidated domain-specific efforts | No XD-SIG appears on the CWE working groups page. Hardware and ICS/OT SIGs still listed separately | cwe.mitre.org `[P]` |

## B. Sources that could not be retrieved

| Source | Status | Consequence |
|---|---|---|
| OpenAI incident statement | HTTP 403 to automated fetch | Every OpenAI-side claim carried at `[S]` from secondary reporting. Needs a manual read before delivery |
| OpenAI Aardvark announcement | HTTP 403 | 92% recall figure and ten CVE-assigned disclosures unverified |
| OpenAI strengthening cyber resilience | HTTP 403 | Frontier Risk Council claim unverified |
| AIVSS SSVC page | HTTP 503 on 2026-08-27 | SSVC decision tree nodes, branches, outcomes not extracted. **Blocks a required capstone step.** Retry needed |
| AIVSS calculator (third-party host) | DNS did not resolve | Cannot exercise the calculator to cross-check arithmetic |
| NIST AI 600-1 Generative AI Profile PDF | HTTP 404 at the briefed path | Needs a replacement URL |
| Berkeley CLTC profile v1.2 | HTTP 404 | Human oversight, containment, and delegated-action extensions unverified |
| CISA CSAF resource page | HTTP 404 at the briefed path | Needs a replacement URL |
| CSA MAESTRO publication | Resolved 2026-08-27. Canonical URL supplied by the author and verified at HTTP 200 | Closed. Lab 1 written against it |
| DARPA AIxCC site | Did not resolve on sweep | AIxCC final results unverified |

## C. Unverified claims held off slides

Each carried from the brief and not yet confirmed. Any that remain unverified at delivery stay off the slides entirely.

**Mythos and Anthropic.** Announcement date discrepancy, 2026-04-07 versus 04-08. The ">99% of findings unpatched" figure. The 181 Firefox-engine exploits, 20-gadget FreeBSD ROP chain, and four-vulnerability browser sandbox escape. Mozilla's 271 patched Firefox vulnerabilities. The internal sandbox escape during safety testing, including the agent emailing the supervising researcher. Access restricted to roughly 40 organizations under Project Glasswing. The 6-to-24-month capability diffusion estimate. US Treasury and Federal Reserve emergency meeting the day after announcement. IMF financial stability flag.

**ExploitGym follow-on.** CrowdStrike engagement. METR and Redwood Research third-party assessments, both apparently pending. OpenAI's disclosure of other, more limited sandbox escapes. OpenAI's promised fuller account.

**Reuters-sourced items, `[A]`.** The one-week detection delay and the FBI notification. OpenAI said the report contained inaccuracies without specifying them. **Blocked on README open decision 3.** If included, the slide must name Reuters on its face.

**Ecosystem risk data.** The enterprise survey reporting 88% of organizations experiencing a confirmed or suspected AI agent security incident. Snyk's 2026 ToxicSkills audit: 1,467 of 3,984 skill packages (36.8%) with at least one security issue, 76 confirmed malicious payloads. SecurityScorecard's 40,000+ internet-exposed OpenClaw instances with 15.2K flagged RCE-vulnerable. The two OpenClaw CVEs themselves **are** verified (25253 at 8.8, 32922 at 9.9); only the exposure counts are unverified.

**Black Hat USA 2026.** 35 of 121 briefings AI-security relevant (~29%). Tencent's 100+ Chrome and Android vulnerabilities. Prompt2Own kernel exploits.

**Other.** Google Big Sleep and XBOW published results. arXiv 2604.05719 (LLM automated pentesting) and arXiv 2607.05518 (aiAuthZ) resolve but are unread. The "Agents of Chaos" red-team corpus not located.

## D. Partially extracted, needs completion

| Item | Status |
|---|---|
| AIVSS Appendix D contributor survey and relative risk rankings | PDF in hand, section not extracted |
| AIVSS Section 3.2 ordinal-versus-interval caveat | Confirmed present, text not extracted. Should be quoted on the AIVSS slide |
| AIVSS certification roadmap (Year 3+) and industry application (Year 2) | Not confirmed against the project site |
| AIUC-1 crosswalk mapping structure | Pages fetched, not tabulated |
| Framework mappings: Agentic AI Top 10 2026, MAESTRO, NIST AI RMF | Not tabulated |
| FLARE-AI interoperability field mappings (CVE/CWE, AVID, CERT/CC, CSAF, VEX) | Not in the abstract. Needs full PDF |
| FLARE-AI live demo and report field schema | Not exercised |
| CVE AI Virtual Conference (2026-07-30) proceedings | Not located |
| VulnCon26 session materials | Not retrieved |
| Akrites official site and governance documentation | Not located beyond the press release |
| MI9 full text | Abstract only |
| NIST SSDF, AI RMF, CAISI, Microsoft SDL, SAFECode, CoSAI, OpenSSF AI/ML outputs | Confirmed to exist, `[UNVERIFIED-DEPTH]`, not deep-read |

## E. Structural unknowns, not resolvable by research

1. **Akrites operational data is pre-launch.** Go-live is September 2026. Whatever the course says about Akrites' effectiveness is a statement about intent, not outcome.
2. **FLARE-AI adoption and volume are unpublished.** No basis exists for claiming the system is or is not being used.
3. **No AI-specific CWE entries exist.** The AI Working Group's scope is acknowledged; the corpus gap is open.
4. **No published disclosure routing procedure exists.** Nine destinations resolve, none publishes a decision procedure. This absence is what the routing tree addresses, and the tree is therefore an original proposal, not a summary of practice.
5. **The context-compression hypothesis is untested.** `[H]` OpenTelemetry carries the two attributes needed to test it. No published correlation study was found.

## F. Blocked on owner decisions

From `README.md` Section "Open decisions for the owner". Items 1 and 2 block build work.

1. Bilingual scope. Blocks Module 2, which is written first.
2. Delivery date. Determines Akrites status language and whether OpenAI's fuller account exists.
3. Reuters attribution posture. Determines whether Section C's `[A]` items appear at all.
4. Capstone AIVSS score status: project position or teaching exercise.
