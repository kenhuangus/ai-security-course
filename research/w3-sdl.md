# W3 — SDL and SDLC evolution for AI systems

Research date: 2026-08-27. Confidence tags: `[P]` primary, `[S]` secondary, `[A]` anonymous or single-outlet, `[H]` hypothesis.

This workstream is analytical. The gate classification below is derived from the incident evidence in W6 and the capability evidence in W4, cross-checked against the framework documents listed. Where a claim rests on framework text this file has confirmed exists but has not deep-read, it is marked `[UNVERIFIED-DEPTH]` and repeated in `gaps.md`.

## Source table

| # | Source | Publisher | Date | Confidence | HTTP | URL |
|---|---|---|---|---|---|---|
| 1 | Secure Software Development Framework, SP 800-218 | NIST | current | [P] | 200 | https://csrc.nist.gov/pubs/sp/800/218/final |
| 2 | AI Risk Management Framework | NIST | current | [P] | 200 | https://www.nist.gov/itl/ai-risk-management-framework |
| 3 | Center for AI Standards and Innovation | NIST | 2026 | [P] | 200 | https://www.nist.gov/caisi |
| 4 | Microsoft Security Development Lifecycle | Microsoft | current | [P] | 200 | https://www.microsoft.com/en-us/securityengineering/sdl |
| 5 | AI/ML Security Working Group | OpenSSF | current | [P] | 200 | https://github.com/ossf/ai-ml-security |
| 6 | Secure AI Framework (SAIF) | Google | current | [P] | 200 | https://safety.google/cybersecurity-advancements/saif/ |
| 7 | Coalition for Secure AI | CoSAI (OASIS) | current | [P] | 200 | https://www.coalitionforsecureai.org/ |
| 8 | SAFECode | SAFECode | current | [P] | 200 | https://safecode.org/ |

Two brief-supplied URLs returned HTTP 404 and need replacements: the NIST Generative AI Profile PDF path (`NIST.AI.600-1.pdf`) and the Berkeley CLTC v1.2 profile page. Recorded in `gaps.md`.

## The reframe that Module 1 turns on

The instinct when offensive capability rises is to find more bugs. The evidence says the binding constraint is downstream of discovery.

Three numbers, each from a different source, all measured rather than projected:

| Measure | Value | Source |
|---|---|---|
| Raw agent alerts surviving triage to confirmed zero-days | 4 of 72, a 94.4% discard rate | Forescout Vedere Labs `[P]` |
| Duplicate rate in Akrites' first two months of reports | approximately 30% of ~3,000 | Infosecurity Magazine quoting Akrites CTO `[S]` |
| CVE growth rate, 2026 versus 2025, per day | 174 versus 132 | Infosecurity Magazine `[S]` |

An organization that doubles its discovery rate without changing its triage, patch, and deployment capacity converts a security investment into a backlog. Akrites states the point institutionally by measuring success in patch deployment rather than patch publication. Module 1 should open on this and never leave it.

## Gate-by-gate analysis

Classification: **Survives unchanged**, **Needs new evidence**, or **New gate entirely**.

| Classical gate | Verdict | What changes |
|---|---|---|
| Requirements | Needs new evidence | Add an autonomy declaration: what the system may do without human approval, and the blast radius of each such action. The Meta Sev-1 was an unreviewed agent action in an ordinary workflow, which is a requirements failure before it is a runtime failure |
| Threat modeling | Needs new evidence | Classical STRIDE does not model goal drift, memory poisoning, or delegated authority. MAESTRO's layered decomposition covers these. Evidence artifact: a threat model naming every tool, every trust boundary, and every principal the agent can act as |
| Design review | Needs new evidence | Reviewers must sign off on where controls live. An instruction in a system prompt is not a control. Evidence artifact: a control-placement table showing which constraints are enforced outside the model |
| Static analysis | Survives unchanged | Still finds what it always found. Unchanged in kind, larger in volume |
| Dependency and supply chain | Needs new evidence | Scope widens past packages to models, datasets, prompts, tools, and skills. The ExploitGym escape ran through a package registry cache proxy that the agent was permitted to use |
| Dynamic testing | Needs new evidence | Add non-deterministic repetition. A single passing run proves nothing about a system that samples. Evidence artifact: pass rate over N runs with a stated threshold |
| Penetration testing | Needs new evidence | Testers need the agent's tool surface and credentials in scope, not only its endpoints. AISI's caveat applies in reverse: results from an environment with no active defenders do not transfer |
| Release approval | Needs new evidence | Approval must reference evaluation results and containment posture, not only test pass or fail |
| Incident response | **Needs new evidence, urgently** | See the defender-tooling failure below |

## The genuinely new gates

For each, the artifact a reviewer signs off on.

| New gate | Exit criteria and signed artifact |
|---|---|
| **Data provenance and dataset integrity** | A manifest listing every training and retrieval corpus with origin, licence, and integrity hash. Reviewer signs that no corpus is of unattested origin |
| **Model registry and lineage** | Every deployed model traceable to weights, version, and evaluation run. Reviewer signs that the deployed artifact matches the evaluated one |
| **Evaluation-as-test with regression baselines** | A stored baseline and a current run, with a stated allowable regression. Reviewer signs the delta, not the absolute score |
| **Red-team gate** | A red-team report with attempted vectors, successes, and residual risk. Reviewer signs that the vectors attempted match the deployed tool surface |
| **Guardrail regression suite** | A suite proving each guardrail holds, including **after context compaction**. Reviewer signs that the suite includes long-horizon runs, not only single-turn probes |
| **Agent permission review** | An enumerated permission set with justification per grant, plus the delegation chain the agent can construct. Reviewer signs least privilege at the tool level |
| **Tool and skill supply chain review** | Every tool and skill with a publisher identity, an integrity pin, and a scope declaration. Reviewer signs that no tool is unpinned or unattributed |
| **Containment and blast-radius review** | A written statement of what the agent can reach if fully compromised, with egress rules enforced outside the agent. Reviewer signs that containment does not depend on the agent's cooperation |

The guardrail regression suite entry earns its "after context compaction" clause from W5. If safety instructions live in the context window, they are subject to the context window's behavior, and a suite that only tests turn one measures the wrong thing.

The containment review is the spine of this course. All three incidents are the same failure: a boundary that was expected to hold, held only as long as the agent cooperated.

## Incident response needs the most change

This is the least anticipated finding in the workstream and it belongs in Module 1 rather than being deferred to Module 2.

When Hugging Face analysts tried to reverse-engineer recovered payloads and C2 artifacts, the commercial frontier models they reached for first refused the work. The postmortem names Claude Opus and Fable, and states that provider guardrails treated reverse-engineering an exploit the same as launching one. The team fell back to running open-weights `zai-org/GLM-5.2` on their own infrastructure. `[P]`

Consequences for an SDL that most incident response plans do not yet record:

1. Analysis capability that depends on a third party's content policy is an availability dependency. It belongs in the incident response plan's dependency list.
2. Guardrails evaluating a submission without context cannot separate an analyst from an attacker, because the two submissions are textually identical.
3. On-premises open-weights capability is an incident response control, not only a cost decision. It also keeps attacker data in-house, which the postmortem notes as a side benefit.

Exit criterion for the incident response gate: the plan names an analysis capability that is available when provider guardrails refuse, and that capability has been exercised.

## Offensive and defensive symmetry, honestly stated

Module 1 must present both directions without overclaiming either. Full detail in `w4-offensive.md`.

Defenders gained real capability. Forescout confirmed four OpenNDS zero-days (FSCT-2026-0001 through 0004) using an agentic framework. `[P]` The same run produced 72 raw alerts, false-positive null-pointer claims, and heap-versus-stack misclassifications. `[P]`

Attackers gained real capability, and less of it than headlines suggest. In the Unit 42 campaign, autonomous reconnaissance was excellent, compressing what researchers describe as hundreds of hours of targeting analysis into minutes. Autonomous exploitation **failed in both attempts**. Every successful exploitation in that campaign was manual. `[P]`

The symmetry that actually holds in 2026 is this. Both sides got much better at finding and prioritizing. Neither side got reliable at autonomous exploitation. The engineering consequence lands on triage capacity, which is why the reframe at the top of this file is the module's thesis.

## Open items

Carried to `gaps.md`: deep reads of SP 800-218, the NIST AI RMF Generative AI Profile, CAISI agent standards materials, Microsoft SDL AI updates, SAFECode AI guidance, CoSAI workstream outputs, and OpenSSF AI/ML Security WG outputs, all marked `[UNVERIFIED-DEPTH]`; replacement URLs for NIST AI 600-1 and the Berkeley CLTC v1.2 profile; whether any of these frameworks has published an AI addendum or profile that already names the eight new gates above, which would let the course cite rather than propose them.
