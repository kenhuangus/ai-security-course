# Disclosure routing decision tree

You found a flaw in an AI or agentic system. Where does it go?

No public equivalent of this exists. Nine destinations resolve and none of them publishes a decision procedure telling a reporter which to use. This is therefore an original proposal built from each destination's own stated scope, not a summary of established practice. Treat it as a starting position for discussion.

Built 2026-08-27 from `w2-ecosystem.md`. Every terminal states what it requires as input and what it produces as output.

## The first question is what kind of flaw it is

The single most common routing error is treating every AI-related finding as an AI flaw. A memory-safety bug in an inference server is an ordinary software vulnerability that happens to live in AI infrastructure. It routes like any other CVE.

    What kind of flaw is it?
    │
    ├─ A. Traditional software defect in AI infrastructure
    │     (memory safety, injection, authz bypass in a server,
    │      runtime, registry, orchestrator, or SDK)
    │        → Branch A
    │
    ├─ B. Model behavioural flaw
    │     (jailbreak, refusal failure, bias, unsafe output,
    │      capability that violates a stated policy)
    │        → Branch B
    │
    ├─ C. Agent runtime flaw
    │     (goal drift, tool misuse, permission escalation,
    │      memory poisoning, sandbox escape, multi-agent
    │      exploitation)
    │        → Branch C
    │
    └─ D. Dataset or supply-chain flaw
          (poisoned corpus, malicious model artifact, trojanized
           skill or tool package, compromised registry)
             → Branch D

## Branch A — traditional software defect in AI infrastructure

    Is the affected software open source?
    │
    ├─ Yes ─── Is it a critical/widely-depended-upon project?
    │           ├─ Yes → AKRITES  (from September 2026)
    │           └─ No  → project's own security policy,
    │                    then a CNA for the ID
    │
    └─ No ──── Does the vendor publish a VDP or run a CNA?
                ├─ Yes → VENDOR VDP / VENDOR CNA
                └─ No  → CERT/CC VINCE

    In all cases, if actively exploited and affecting
    US federal systems or critical infrastructure → also CISA

**Note on CVE-2026-4747.** A memory-safety bug found by an AI system in FreeBSD's NFS server routed through FreeBSD's own security team as CNA and produced an ordinary CVE with an ordinary advisory. The discovery method changed nothing about the route. That is the correct outcome and worth saying on the slide.

## Branch B — model behavioural flaw

    Does the model have a published VDP or model-flaw programme?
    │
    ├─ Yes → PROVIDER PROGRAMME
    │         then, for cross-provider issues, FLARE-AI
    │
    └─ No ─── Is the flaw likely to affect multiple providers?
               ├─ Yes → FLARE-AI  (multi-developer dissemination)
               └─ No  → AVID  (taxonomy and public record)

    If real-world harm has already occurred → also AIID

## Branch C — agent runtime flaw

This branch is the least well served, which is the point Module 3 should make.

    Is there an identifiable software defect with a fixable owner?
    │
    ├─ Yes → treat the defect as Branch A for the ID and the fix,
    │        AND file the agentic context via FLARE-AI so the
    │        behavioural half is not lost
    │
    └─ No (emergent behaviour, no single defect)
          │
          ├─ Affects a specific product → PROVIDER PROGRAMME
          ├─ Affects a pattern across products → FLARE-AI
          └─ Harm already occurred → AIID

    Severity and exploitability high, and coordination
    across several organisations needed → CERT/CC VINCE

**The ExploitGym escape is the hard case.** It was simultaneously a Branch A defect (a zero-day in a package registry cache proxy, with a fixable vendor), a Branch C runtime failure (an agent pursuing an unintended goal across five trust boundaries), and arguably a Branch B behavioural flaw (specification gaming). It needed at least three routes at once, and no single destination would have captured it. Run this as the worked example in Module 3.

## Branch D — dataset or supply-chain flaw

    Is there a malicious artifact in a distribution channel?
    │
    ├─ Yes → PLATFORM ABUSE PROCESS FIRST  (takedown is urgent)
    │         then AKRITES if it is an open-source package,
    │         then AVID for the taxonomy record
    │
    └─ No (integrity or provenance defect, not active abuse)
          ├─ Open-source package → AKRITES
          ├─ Model or dataset artifact → PLATFORM + AVID
          └─ Systemic pattern → FLARE-AI

## Terminal reference

| Terminal | Requires as input | Produces as output | Status 2026-08-27 |
|---|---|---|---|
| **Akrites** | Affected open-source project, version range, technical detail, embargo willingness | Coordinated remediation with upstream maintainers, CVD through a shared SIRT, standard identifiers (CVE, CWE, CVSS, EPSS, SSVC, VEX). Acts as maintainer of last resort where no maintainer is active | Launched 2026-06-25. Automated intake go-live **September 2026**. ~3,000 reports in first two months, ~30% duplicates `[S]` |
| **CNA (vendor or project)** | Reproducible technical detail, affected versions, impact statement | A CVE ID and a published record | Operational. ~327,000 records to date; 174/day in 2026 `[S]` |
| **Vendor VDP** | Whatever the vendor's policy demands | A fix on the vendor's timeline. No identifier guaranteed | Varies |
| **CERT/CC VINCE** | Technical detail, affected parties, coordination need | Multi-party coordination, case management, CSAF output | Operational |
| **CISA** | Evidence of active exploitation, affected sectors | KEV listing where applicable, federal directive authority, VEX and CSAF tooling | Operational |
| **FLARE-AI** | Triage-relevant information gathered through conditional logic with early classification | Standardized machine-readable report, optional dissemination to multiple developers | Published 2026-06-30. **Adoption and volume unpublished** `[P]` |
| **AVID** | Flaw description, affected model or system, taxonomy fit | A public taxonomy record | Operational |
| **AIID** | Evidence of realized harm | A public incident record | Operational |
| **EUVD (ENISA)** | EU-relevant vulnerability detail | An EU vulnerability record | Operational |

## Three things this tree makes visible

**One flaw often needs several routes.** The tree is not a switch. Branch C explicitly routes to two destinations at once, because the identifier system and the behavioural record system are separate and neither subsumes the other.

**Two terminals cannot yet be evaluated.** Akrites has no post-launch outcome data and FLARE-AI publishes no adoption numbers. A reporter choosing between them in 2026 is choosing on stated intent.

**No terminal accepts an agent runtime flaw natively.** Branch C works by decomposing the flaw into parts that existing systems can accept. That decomposition loses the thing that made it an agent flaw. This is the strongest argument in the course for why the CWE AI Working Group's corpus gap matters: without weakness classes that describe agent failures, there is nothing for a record to point at.

## Open items

The SSVC decision-tree track published by the AIVSS project is a **prioritization** tree, not a routing tree. It answers "how urgently do I act" rather than "where do I send this." The two are complementary and should not be conflated on a slide. See `synthesis-capstone.md`.
