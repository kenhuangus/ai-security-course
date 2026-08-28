# W1 — AIVSS and adjacent OWASP standards

Research date: 2026-08-27. Confidence tags: `[P]` primary, `[S]` secondary, `[A]` anonymous or single-outlet, `[H]` hypothesis.

## Source table

| # | Source | Publisher | Date | Confidence | HTTP | URL |
|---|---|---|---|---|---|---|
| 1 | AIVSS Scoring System for OWASP Agentic AI Core Security Risks v0.8 (98 pp) | OWASP AIVSS Project | 2026 | [P] | 200 | https://aivss.owasp.org/assets/publications/AIVSS%20Scoring%20System%20For%20OWASP%20Agentic%20AI%20Core%20Security%20Risks%20v0.8.pdf |
| 2 | AIVSS Scoring System v0.5 (97 pp) | OWASP AIVSS Project | 2025 | [P] | 200 | https://aivss.owasp.org/assets/publications/AIVSS%20Scoring%20System%20For%20OWASP%20Agentic%20AI%20Core%20Security%20Risks%20v0.5.pdf |
| 3 | AIVSS project home | OWASP | 2026 | [P] | 200 | https://aivss.owasp.org/ |
| 4 | AIUC-1 / AIVSS crosswalk | OWASP AIVSS | 2026 | [P] | 200 | https://aivss.owasp.org/aiuc-aivss-crosswalk |
| 5 | AIVSS project repository | OWASP | 2026 | [P] | 200 | https://github.com/OWASP/www-project-artificial-intelligence-vulnerability-scoring-system |
| 6 | AISVS documentation | OWASP | 2026 | [P] | 200 | https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/ |
| 7 | OWASP GenAI Security Project | OWASP | 2026 | [P] | 200 | https://genai.owasp.org/ |
| 8 | OWASP Agentic Skills Top 10 project page | OWASP | 2026 | [P] | 200 | https://owasp.org/www-project-agentic-skills-top-10/ |

Two brief-supplied URLs failed on the first sweep and are recorded in `gaps.md`: the SSVC page returned HTTP 503, and the third-party calculator host did not resolve. The SSVC page was re-fetched successfully on 2026-08-28 and is now extracted below. The third-party host still does not resolve.

## Finding 1: the brief's formula was stale, and the correction matters

The brief described the AIVSS model as a CVSS base score plus an agentic capability assessment, "the sum halved, then multiplied by an environmental context factor." The brief flagged this as needing verification. It does not describe v0.8. It describes v0.5.

### v0.5, the superseded model

    AIVSS = ((CVSS_Base + AARS) / 2) × ThM

AARS was itself a 0 to 10 score formed by summing ten capability factors directly.

Worked example from the v0.5 document, Agentic AI Tool Misuse:

    AARS  = 8.5   (sum of ten factors)
    AIVSS = ((9.4 + 8.5) / 2) × 0.97 = 8.6815 → 8.7
    Vector: (CVSS:9.4/AARS:8.5)

### v0.8, the current model

    Risk_Gap  = 10 − CVSS_Base
    AARS      = Risk_Gap × (Factor_Sum / 10) × ThM
    AIVSS_raw = (CVSS_Base + AARS) × Mitigation_Factor
    AIVSS     = RoundHalfUp(AIVSS_raw, 1)

Every variable, as defined in Sections 3.3 and 3.4 of the v0.8 document:

| Variable | Definition | Range | Default |
|---|---|---|---|
| `CVSS_Base` | CVSS **v4.0** base score of the underlying vulnerability | 0.0 – 10.0 | none, required input |
| `Risk_Gap` | `10 − CVSS_Base`. The headroom agentic capability can contribute on top of the technical vulnerability | 0.0 – 10.0 | derived |
| `Factor_Sum` | Sum of the ten Risk Amplification Factors from Section 2.3, each scored 0.0, 0.5, or 1.0 | 0.0 – 10.0 | none, required input |
| `Factor_Sum / 10` | Proportion of the risk gap closed by agentic capability | 0.0 – 1.0 | derived |
| `ThM` | Threat Multiplier, keyed to exploit maturity | 0.50 – 1.00 | 0.97 |
| `AARS` | Agentic AI Risk Score. An intermediate uplift value, explicitly not the reported output | 0.0 – 10.0 | derived |
| `Mitigation_Factor` | Scaling factor for mitigation strength. Higher means weaker mitigation | 0.67 – 1.00 | 1.00 |

The ten Risk Amplification Factors, named exactly as the document sums them:

    Factor_Sum = Autonomy + Tools + Language + Context + Non-Determinism
               + Opacity + Persistence + Identity + Multi-Agent + Self-Mod

Threat Multiplier values (Table 4a):

| Exploit maturity | Description | ThM |
|---|---|---|
| Attacked (A) | Actively exploited in the wild | 1.00 |
| Proof-of-Concept (P) | Functional exploit code or detailed walkthrough exists | 0.97 |
| Unreported (U) | No known exploit, theoretical only | 0.50 |

The document defaults to 0.97 and argues the default should sit near the "actively attacked" value because agentic exploits are often natural language requiring no compilation, and because offensive agentic systems can ingest a raw proof of concept and generate a weaponized exploit autonomously. That reasoning collapses the traditional disclosure-to-attack interval. This is a design judgment stated by the framework, not a measurement.

Mitigation Factor values (Table 4b):

| Mitigation strength | Description | Value |
|---|---|---|
| No/Weak | Mitigations absent or ineffective | 1.00 |
| Partial | Incomplete, not reliably enforceable, or not validated against realistic adversarial conditions | 0.83 |
| Strong | Validated, consistently enforceable, fail-closed where applicable | 0.67 |

The 0.67 floor is described in the document as a provisional anchor set by framework design consensus, open to community review and awaiting empirical calibration. The stated rationale is that no mitigation can fully eliminate residual risk from agentic amplification. Teach this as a declared assumption, not a finding.

Severity bands, adopted from CVSS convention: Critical 9.0 to 10.0, High 7.0 to 8.9, Medium 4.0 to 6.9, Low 0.1 to 3.9. The document warns that AIVSS scores reflect amplified agentic risk and are not directly comparable to CVSS base scores.

### Why the change is pedagogically interesting

Averaging in v0.5 pulled severe technical vulnerabilities **down**. Agentic AI Tool Misuse carries CVSS 9.4 and scored AIVSS 8.7 under v0.5. Adding agentic capability made the number smaller. That is the wrong direction for a framework whose whole purpose is to express amplification.

The v0.8 gap-closing model can only add. The same risk now scores 9.9. This is a clean, concrete example of a scoring-design defect and its repair, and it belongs in Module 3 as a lesson about building severity models rather than as an AIVSS advertisement.

## Finding 2: the ten core risks, with the arithmetic shown

Every score below is reproduced from the worked examples in Section 3.6 of the v0.8 document. `FS/10` is the `Factor_Sum / 10` term as the document writes it. All ten examples use ThM 0.97 and Mitigation_Factor 1.0.

| # | Core risk | CVSS v4.0 | FS/10 | AARS | AIVSS | Band |
|---|---|---|---|---|---|---|
| 3.6.1 | Agentic AI Tool Misuse | 9.4 | 0.90 | 0.5238 | **9.9** | Critical |
| 3.6.2 | Agent Access Control Violation | 8.7 | 0.80 | 1.0088 | **9.7** | Critical |
| 3.6.3 | Agent Cascading Failures | 7.1 | 0.80 | 2.2504 | **9.4** | Critical |
| 3.6.4 | Agent Orchestration and Multi-Agent Exploitation | 9.4 | 0.95 | 0.5529 | **10.0** | Critical |
| 3.6.5 | Agent Identity Impersonation | 7.4 | 0.75 | 1.8915 | **9.3** | Critical |
| 3.6.6 | Agent Memory and Context Manipulation | 5.8 | 0.75 | 3.0555 | **8.9** | High |
| 3.6.7 | Insecure Agent Critical Systems Interaction | 6.9 | 0.75 | 2.25525 | **9.2** | Critical |
| 3.6.8 | Agent Supply Chain and Dependency | 9.3 | 0.65 | 0.44135 | **9.7** | Critical |
| 3.6.9 | Agent Untraceability | 5.3 | 0.65 | 2.96335 | **8.3** | High |
| 3.6.10 | Agent Goal and Instruction Manipulation | 2.1 | 0.65 | 4.98095 | **7.1** | High |

The brief's single published example, Agent Access Control Violation at 9.7, is confirmed at primary source.

The two most instructive rows are the extremes. Agent Goal and Instruction Manipulation moves from CVSS 2.1 to AIVSS 7.1, and Agent Memory and Context Manipulation from 5.8 to 8.9. The v0.8 document addresses this pattern directly: when AARS uplift substantially exceeds CVSS_Base, the agentic deployment context rather than the technical defect is the primary risk driver. That is the single most useful sentence in the document for an engineering audience, because it tells a reader what the number is claiming.

A caution to carry onto the slide. Eight of ten core risks land in the Critical band and the tenth is High. A severity model that rates almost everything Critical has limited power to prioritize. The SSVC decision-tree track exists partly to address this, and Section 3.2 of the document carries a statistical caveat about ordinal versus interval scales that should be quoted rather than skipped.

## Finding 3: statistical caveat is in the document

Section 3.2 is titled "Important Statistical Caveat: Ordinal vs. Interval Scales." The framework itself flags that arithmetic on ordinal severity inputs is not fully sound. Any course that presents AIVSS should present this caveat in the same breath as the formula. Full extraction pending, recorded in `gaps.md`.

## Open items for this workstream

Carried to `gaps.md`:

1. Appendix D contributor survey and relative risk rankings, not yet extracted from the PDF.
2. The AIUC-1 crosswalk mapping structure, fetched but not yet tabulated.
3. Framework mappings to Agentic AI Top 10 for 2026, MAESTRO, and NIST AI RMF, not yet tabulated.
4. ~~SSVC decision tree nodes, branches, and outcomes.~~ Closed 2026-08-28. The page was re-fetched and the full model extracted: three inputs with their values, ten capability factors in three categories, the agent-level classification thresholds, the 27-cell outcome matrix and the four remediation windows. Published in `reference/aivss-primer.html`.
5. Certification roadmap language. The brief places certification at Year 3 and industry application at Year 2, not yet confirmed against the project site.
6. The MAESTRO canonical CSA publication URL. The brief-supplied URL returned HTTP 404.
