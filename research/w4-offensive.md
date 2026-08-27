# W4 — Offensive AI capability, calibrated

Research date: 2026-08-27. Confidence tags: `[P]` primary, `[S]` secondary, `[A]` anonymous or single-outlet, `[H]` hypothesis.

The purpose of this workstream is calibration, not capability marketing. Where a source reports a failure, the failure is recorded with the same weight as the success.

## Source table

| # | Source | Publisher | Date | Confidence | HTTP | URL |
|---|---|---|---|---|---|---|
| 1 | Our evaluation of Claude Mythos Preview's cyber capabilities | UK AI Security Institute | 2026 | [P] | 200 | https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities |
| 2 | FreeBSD-SA-26:08.rpcsec_gss | FreeBSD Security Team | 2026-03-26 | [P] | 200 | https://www.freebsd.org/security/advisories/FreeBSD-SA-26:08.rpcsec_gss.asc |
| 3 | CVE-2026-4747 record | NVD | 2026-03-26 | [P] | 200 | https://nvd.nist.gov/vuln/detail/CVE-2026-4747 |
| 4 | Project Glasswing | Anthropic | 2026 | [P] | 200 | https://www.anthropic.com/glasswing |
| 5 | AI security testing agents leap from assistants to autonomous hackers | Forescout Vedere Labs | 2026-04-14 | [P] | 200 | https://www.forescout.com/blog/ai-security-testing-agents-leap-from-assistants-to-autonomous-hackers/ |
| 6 | Autonomous AI cyber attack campaign | Unit 42, Palo Alto Networks | 2026 | [P] | 200 | https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/ |
| 7 | AI vulnerability discovery and containment, Claude Mythos | Cloud Security Alliance | 2026-04 | [S] | 200 | https://labs.cloudsecurityalliance.org/research/ai-vuln-discovery-containment-claude-mythos-v1-0-csa-styled/ |
| 8 | Black Hat USA 2026 AI security talks | Straiker | 2026 | [S] | 200 | https://www.straiker.ai/blog/black-hat-usa-2026-ai-security-talks |
| 9 | Introducing Aardvark | OpenAI | 2025-10-30 | [P] | **403** | https://openai.com/index/introducing-aardvark/ |

## Finding 1: capability timeline with benchmarks labeled

The brief asks that benchmarks never be mixed on one axis without labels. They are labeled here and must stay labeled on the slide.

### AISI CTF ladder `[P]`

The UK AI Security Institute tracks four difficulty tiers. Technical non-expert and apprentice tiers have been tracked since November 2022. Practitioner and expert tiers were tested for models from August 2025 onward.

| Tier | Result |
|---|---|
| Expert-level CTF | Mythos Preview at **73%**. First model to reach this tier. No model succeeded before April 2025 |

Models in the comparison set: GPT-3.5 Turbo, GPT-4o, Sonnet 3.7, Claude 4 Opus, GPT-5, Sonnet 4.5, GPT-5.1 Codex, Opus 4.5, GPT-5.3-Codex, GPT-5.4, Opus 4.6, Claude Mythos Preview.

### AISI "The Last Ones" (TLO), a 32-step network attack simulation `[P]`

This is a different benchmark from the CTF ladder and belongs on its own axis.

| Model | Full scenario completions | Mean steps of 32 |
|---|---|---|
| Claude Mythos Preview | 3 of 10 attempts | 22 |
| Claude Opus 4.6 | not stated | 16 |

Estimated human completion time for the scenario is 20 hours.

### Forescout Vedere Labs year-over-year `[P]`

A third benchmark. Do not plot on the same axis as either AISI series.

| Measure | 2025 | 2026 |
|---|---|---|
| Models failing basic vulnerability research | 55% | 0% |
| Models failing exploit development | 93% | 50% |
| Models succeeding at complex exploitation | not stated | 2 of the set (Claude Opus 4.6, Kimi K2.5) |

## Finding 2: the calibration table

This is the required "AI does well / AI still fails" slide. Every row is sourced.

| AI reliably does this well | AI still fails at this |
|---|---|
| Breadth of enumeration. Unit 42 observed FOFA searches surfacing 647,017 n8n instances globally, 25,209 in China, then autonomous narrowing to ~40 addresses for probing `[P]` | **Autonomous exploitation against real preconditions.** Both autonomous attempts in the Unit 42 campaign failed. Langflow needed `auto_login` or public flow IDs, neither present. n8n forms all required authentication, contradicting the PoC `[P]` |
| Compressing target analysis. Unit 42 describes "hundreds of hours of manual targeting analysis in mere minutes" `[P]` | **Triage precision.** Forescout's RAPTOR run on OpenNDS produced **72 raw alerts** that reduced to **4 confirmed zero-days** after autonomous triage and human validation `[P]` |
| Finding real, novel defects. Four OpenNDS zero-days confirmed: FSCT-2026-0001 through 0004 `[P]` | **Hallucinated vulnerabilities.** Claude Opus produced false-positive null-pointer dereference claims in two runs. Most open-source models hallucinated vulnerabilities consistently `[P]` |
| Long-horizon persistence. Mythos averaged 22 of 32 steps on a scenario humans need ~20 hours for `[P]` | **False negatives.** GPT 5.3-codex concluded there was "no critical vulnerability meeting the exploitation bar" where vulnerabilities existed `[P]` |
| Memory-safety analysis at depth. CVE-2026-4747 is a 17-year-old stack overflow in FreeBSD's RPCSEC_GSS handling `[P]` | **Correct vulnerability classification.** Multiple models mischaracterized the corruption type of CVE-2023-41101, confusing heap and stack, while still identifying the bug `[P]` |
| Operating inside an agent framework with tool access. Hermes Agent gave DeepSeek terminal access, Telegram C2, and custom skills `[P]` | **Staying on task.** Gemini 3 Pro abandoned its exploitation plan after minor command syntax errors distracted it into fixing them `[P]` |
| | **Its own operational security.** The Unit 42 agent started an HTTP file server instead of an isolated staging directory and exposed the entire operation. Researchers call this a novel OPSEC risk that would not exist under a manual workflow `[P]` |

The last row deserves a sentence on the slide. Autonomy introduces new failure modes rather than only removing human ones.

## Finding 3: attribution on CVE-2026-4747 is more careful than the brief

The brief states Mythos discovered and exploited this autonomously. The FreeBSD advisory credits **"Nicholas Carlini using Claude, Anthropic."** `[P]`

That phrasing describes a human researcher working with a model. It is a joint credit, not an autonomous-discovery credit. The advisory was announced 2026-03-26, which is before the public Mythos announcement, consistent with work done under restricted preview access.

The technical description also refines the brief. The advisory and NVD record say the signature-validation routine copies into an undersized stack buffer and that triggering the overflow "does not require the client to authenticate itself first." Kernel RCE through the NFS server, however, is described as achievable "by an authenticated user." The CVSS v3.1 vector is `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H` at **8.8 High**, with `PR:L` confirming a privilege requirement. `[P]`

The slide should say: reachable pre-authentication, kernel RCE described as requiring an authenticated user, scored 8.8 with CWE-121. Calling it a 9.8 unauthenticated RCE would be wrong.

NVD lists a public exploit reference for this CVE. Consistent with the brief's scope rule, no reproduction detail appears anywhere in this course.

## Finding 4: adversary adoption is real, and narrower than headlines suggest

Unit 42 documented a Chinese-speaking actor using aliases knaithe and KnYuan, based in Zhuhai, running DeepSeek inside the Hermes Agent framework, with a `FofaMap-Platinum-Full-Expert` MCP server translating natural language into FOFA queries. Session documented 2026-05-07. `[P]`

The actor maintains 1DayNews, an automated vulnerability-intelligence pipeline aggregating RCE disclosures from 17 sources and distributing alerts over Telegram. They also tested Claude Code, Codex, Qwen, GLM, Kimi, and MiniMax in limited capacity, which reads as market evaluation. `[P]`

Seven CVEs were targeted. The split matters more than the count:

| Outcome | CVEs |
|---|---|
| Autonomous, failed | CVE-2026-33017 (Langflow), CVE-2026-21858 / CVE-2025-68613 (n8n) |
| Manual, successful | CVE-2026-3055 (Citrix NetScaler), CVE-2026-39987 (Marimo Notebook) |
| Manual, attempted or non-functional | CVE-2026-34486 (Apache Tomcat), CVE-2026-33824 (Windows IKE VPN), CVE-2026-0300 (PAN-OS) |

The brief presents this campaign as autonomous target selection **and exploitation**. The evidence supports autonomous selection and reconnaissance. It does not support autonomous exploitation: every success in the campaign was manual. Researchers note that "targets with weaker default configurations would have been susceptible," which is a statement about the target population rather than about model capability.

CVE-2026-33017 is confirmed in NVD at CVSS v3.1 **9.8** and CVSS v4.0 **9.3**, CWE-94/95/306. The brief's 9.8 figure is correct. `[P]`

## Finding 5: what the evaluators themselves refuse to claim

The most important slide in Module 1 may be this one. AISI states plainly that it cannot say whether Mythos Preview could attack well-defended systems, because the evaluation environments contain no active defenders, no defensive tooling, and no penalty for triggering security alerts. `[P]`

AISI describes demonstrated capability as autonomously attacking "small, weakly defended and vulnerable enterprise systems where access to a network has been gained." The model also could not complete the operational-technology cyber range called Cooling Tower, though AISI notes this may reflect IT-level limits rather than an OT-specific weakness. `[P]`

Every capability number in this course sits inside that caveat.

## Open items

Carried to `gaps.md`: OpenAI Aardvark and Codex Security primary pages return HTTP 403 to automated fetch, so the 92% recall figure and the ten CVE-assigned disclosures remain unverified; the Anthropic Mythos announcement date discrepancy (2026-04-07 versus 04-08); the ">99% of Mythos findings unpatched" figure; the Mozilla 271-Firefox-vulnerabilities claim; the Treasury and Federal Reserve emergency meeting; the "40 organizations under Project Glasswing" figure and the 6-to-24-month diffusion estimate; Black Hat USA 2026 session counts; DARPA AIxCC, Google Big Sleep, and XBOW results.
