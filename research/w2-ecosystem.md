# W2 — Vulnerability governance ecosystem

Research date: 2026-08-27. Confidence tags: `[P]` primary, `[S]` secondary, `[A]` anonymous or single-outlet, `[H]` hypothesis.

## Source table

| # | Source | Publisher | Date | Confidence | HTTP | URL |
|---|---|---|---|---|---|---|
| 1 | Linux Foundation and industry leaders launch Akrites | Linux Foundation | 2026-06-25 | [P] | 200 | https://www.linuxfoundation.org/press/linux-foundation-and-industry-leaders-launch-akrites-to-defend-critical-open-source-software-against-ai-enabled-cyber-threats |
| 2 | Linux Foundation's Akrites to go live | Infosecurity Magazine | 2026-08-19 | [S] | 200 | https://www.infosecurity-magazine.com/news/linux-foundations-akrites-go-live/ |
| 3 | FLARE-AI: Flaw Reporting for AI (arXiv 2606.31567) | Longpre et al. | 2026-06-30 | [P] | 200 | https://arxiv.org/abs/2606.31567 |
| 4 | Announcing FLARE-AI | MIT AI Risk Initiative | 2026 | [P] | 200 | https://airisk.mit.edu/blog/announcing-flare-ai |
| 5 | CMU researchers help close a critical security gap | Carnegie Mellon University | 2026-07 | [S] | 200 | https://www.cmu.edu/news/stories/archives/2026/july/cmu-researchers-help-close-a-critical-security-gap-across-ai-platforms |
| 6 | CWE community working groups | MITRE | 2026 | [P] | 200 | https://cwe.mitre.org/community/working_groups.html |
| 7 | CVE program working groups | CVE Program | 2026 | [P] | 200 | https://www.cve.org/ProgramOrganization/WorkingGroups |
| 8 | CVE-AI-Discussion subgroup | CVE-CWE-Programs (groups.io) | 2026 | [P] | 200 | https://cve-cwe-programs.groups.io/g/CVE-AI-Discussion/subgroups |
| 9 | AI companies to play bigger role in CVE program | Infosecurity Magazine | 2026-04-15 | [S] | 200 | https://www.infosecurity-magazine.com/news/ai-companies-to-play-bigger-role/ |

## Finding 1: Akrites is no longer data-free, and the first data point is the interesting one

The brief instructed that Akrites has little or no operational data and that this should be stated as a finding. That was true at the time the brief was drafted. It is no longer true, and the change is favourable for the course.

Reported by Infosecurity Magazine on 2026-08-19, eight days before the brief date, quoting Christopher Robinson, who serves as CTO of **both** OpenSSF and Akrites: `[S]`

| Measure | Value |
|---|---|
| Vulnerability reports received in the first two months | approximately 3,000 |
| Share that were duplicates | approximately 30% |
| Go-live for automated report intake | September 2026 |

A 30% duplicate rate on 3,000 reports, before automated AI-sourced intake has even opened, is the single most useful operational number in this workstream. It is direct evidence for the Module 1 thesis that the engineering problem is absorbing findings rather than producing them. Pair it on the slide with the Forescout 72-alerts-to-4-confirmed ratio from W4.

State the go-live as September 2026 and flag the delivery-date dependency from README open decision 2. If the course is delivered after go-live, Akrites is operational and this section needs a status refresh.

### Launch facts, corrected

The Linux Foundation press release lists **19** named founding organizations: `[P]`

Amazon Web Services, Anthropic, Chainguard, Cisco, Citi, Endor Labs, Ericsson, Google, IBM, JPMorganChase, Microsoft and GitHub, NVIDIA, OpenAI, RapidFort, Red Hat, Rust Foundation, Sonatype, Vodafone, Zscaler.

The brief's list omitted RapidFort, the Rust Foundation, and Sonatype. Secondary coverage says "over 20 founding members," which does not match the 19 named in the release. Use the press release list and the phrase "19 named founding organizations."

Akrites was co-founded by the Linux Foundation and OpenSSF. Alpha-Omega provides seed funding to initiate operations. `[P]`

### Operating model

A shared Security Incident Response Team running one standardized Coordinated Vulnerability Disclosure process, confidentiality-first, built on CVE, TLP, CWE, CVSS, EPSS, SSVC, and VEX. `[P]`

Three design commitments are worth quoting on a slide because they define what kind of body this is:

1. Success is measured in **patch deployment, not patch publication**.
2. The SIRT is "a predictable partner for maintainers rather than a flood of uncoordinated reports."
3. It acts as **maintainer of last resort** for packages with no active maintainer.

On what it will not do: the release commits that bug fixes flow back into each project's original home, on maintainers' terms, and that the initiative will not fragment the ecosystem with proprietary solutions or bypass maintainers. The brief's phrasing "explicitly not fork upstream projects" is a fair paraphrase of this commitment, but the "maintainer of last resort" role sits in tension with it and is worth raising as a discussion question rather than smoothing over.

## Finding 2: FLARE-AI verified in full

Every FLARE-AI fact in the brief holds. `[P]`

| Claim | Verified |
|---|---|
| arXiv 2606.31567 | Yes. Submitted 2026-06-30 |
| Title | FLARE-AI: Flaw Reporting for AI |
| Shayne Longpre and 17 co-authors | Yes, 18 authors total |
| Audited 12 existing flaw reporting systems | Yes |
| 49 experts across 32 organizations | Yes |
| Five design challenges | Yes |

Full author list: Shayne Longpre, Elaine Zhu, Carson Ezell, Avijit Ghosh, Sean McGregor, Kevin Paeth, Kevin Klyman, Sayash Kapoor, Rishi Bommasani, Ruth Appel, Gregory Strom, Lauren McIlvenny, Mark M. Jaycox, Peter Slattery, Nathan Butters, Arvind Narayanan, Percy Liang, Alex Pentland.

The five design challenges, as named in the paper: discoverability, scope, information collection, coordination, and guidance for strict-liability cases.

Mechanism: the system collects triage-relevant information through conditional logic with early classification, then optionally disseminates standardized machine-readable reports to multiple developers.

The interoperability target list (CVE and CWE fields, AVID schema, CERT/CC coordination, CSAF output, CISA VEX) is not stated in the abstract and needs the full PDF. Recorded in `gaps.md`. Adoption and volume numbers remain unpublished, as the brief anticipated.

## Finding 3: AI weakness classification is acknowledged but not yet delivered

The CWE **Artificial Intelligence Working Group** exists. Its stated scope is to "identify and address gaps in the CWE corpus where AI-related weaknesses are not adequately covered," and it was established by CWE and CVE community stakeholders. The establishment date is not given on the page. `[P]`

Two corrections to the brief:

**No AI-specific CWE entries are listed.** The working groups page names no published or proposed AI-related CWE IDs. The gap is acknowledged at the institutional level and not yet closed in the corpus. That is the honest state of play and should be said plainly in Module 3.

**XD-SIG is not on the page.** The brief states that a Cross-Domain Special Interest Group has consolidated previous domain-specific efforts. The current page still lists the Hardware CWE SIG and the ICS/OT SIG as separate active groups and mentions no XD-SIG. Either the consolidation has not happened, or the page is stale. Treat the XD-SIG claim as `[UNVERIFIED]` and leave it off the slide.

Other groups on the page: Root Cause Mapping WG (established by CVE and CWE community stakeholders including Intel, Microsoft, Red Hat, Rapid7, CISA, HSSEDI), User Experience WG, Hardware CWE SIG, ICS/OT SIG, REST API WG.

The `CVE-AI-Discussion` subgroup on the CVE-CWE-Programs list resolves (HTTP 200), consistent with the brief. The 2026 CVE AI Virtual Conference registration page also resolves. Proceedings or recordings from the 2026-07-30 conference have not been located and are recorded in `gaps.md`.

## Finding 4: CVE volume data, fully verified

Every figure in the brief is confirmed against Infosecurity Magazine, 2026-04-15. `[S]`

| Measure | Value |
|---|---|
| Total CVE records to date | ~327,000 |
| Reported in 2026 as of 2026-04-15 | 18,247 |
| Year-over-year growth, same period | 27.9% |
| CVEs per day, 2026 | 174 |
| CVEs per day, 2025 | 132 |
| 2025 actual total | 48,171 |
| FIRST forecast, additional in 2026 | 50,000 |
| Jerry Gamblin (Cisco) projection for 2026 | 70,135, reflecting 45.6% growth |

At VulnCon26, which opened in Scottsdale, Arizona on 2026-04-14, **Lindsey Cerkovnik, Chief of the Vulnerability Response and Coordination (VRC) Branch at CISA**, said AI firms should be better represented in the CVE program, and characterized the moment as a turning point given new AI tools, some finding valid vulnerabilities and others finding things of less value. She described the CVE program as a top priority for CISA and confirmed funding going forward. `[S]`

The "others perhaps finding things with less value" half of that statement is the one to put on the slide. It is a regulator naming the signal-to-noise problem, and it pairs with the Akrites duplicate rate and the Forescout triage ratio.

## Finding 5: the routing problem is real and unowned

Synthesizing across this workstream, the destinations available to someone who finds a flaw in an agentic AI system are now numerous and overlapping: Akrites, FLARE-AI, a CNA, a vendor VDP, AVID, AIID, CERT/CC VINCE, CISA, and the EU's EUVD. All nine endpoints resolve. None of them publishes a decision procedure telling a reporter which one to use.

That absence is what makes the disclosure routing tree in `synthesis-routing-tree.md` the highest-value original artifact in this course, exactly as the brief predicted.

## Open items

Carried to `gaps.md`: the official Akrites site and any published process or governance documentation; FLARE-AI interoperability field mappings from the full PDF; the FLARE-AI live demo and its report field schema; CVE AI Virtual Conference proceedings; any AI-specific CVE assignment rules or scoping guidance; VulnCon26 session materials; the XD-SIG consolidation claim; AVID, AIID, VINCE, CSAF, and EUVD detail beyond confirming the endpoints resolve. The brief-supplied CISA CSAF URL returned HTTP 404 and needs a replacement.
