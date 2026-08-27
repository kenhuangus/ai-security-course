# Bilingual glossary — English / 中文

The course topics originated in Chinese. This glossary is built regardless of how README open decision 1 resolves.

Terms are grouped by where they first appear in the course. Definitions are written for an engineer who knows security but not agentic AI, or the reverse.

## Standards, scoring, and coordination

| English | 中文 | Definition |
|---|---|---|
| AIVSS (AI Vulnerability Scoring System) | 人工智能漏洞评分系统 | OWASP scoring framework for agentic AI risks. v0.8 adds an agentic uplift to a CVSS base score, closing part of the gap to 10.0 |
| AARS (Agentic AI Risk Score) | 智能体风险评分 | The intermediate uplift value in AIVSS v0.8. Explicitly not the reported output |
| Risk Amplification Factor | 风险放大因子 | One of ten agentic capabilities scored 0.0, 0.5, or 1.0 that determine how much of the risk gap is closed |
| Threat Multiplier (ThM) | 威胁乘数 | AIVSS multiplier keyed to exploit maturity. Attacked 1.00, Proof-of-Concept 0.97, Unreported 0.50 |
| Mitigation Factor | 缓解因子 | AIVSS v0.8 scaling factor, 0.67 to 1.00. Higher means weaker mitigation |
| SSVC (Stakeholder-Specific Vulnerability Categorization) | 特定利益相关者漏洞分类 | Decision-tree prioritization producing Defer, Scheduled, Out-of-Cycle, or Immediate |
| CVD (Coordinated Vulnerability Disclosure) | 协同漏洞披露 | Process for disclosing a flaw to the party who can fix it before it becomes public |
| SIRT (Security Incident Response Team) | 安全事件响应团队 | The team that runs coordination. Akrites operates a shared one across member organizations |
| CNA (CVE Numbering Authority) | CVE 编号授权机构 | An organization authorized to assign CVE identifiers within its scope |
| CVE | 通用漏洞披露编号 | The public identifier for a specific software vulnerability |
| CWE | 通用缺陷枚举 | The classification of the weakness class underlying a vulnerability |
| CVSS | 通用漏洞评分系统 | Severity score for a vulnerability. AIVSS v0.8 requires the v4.0 variant |
| EPSS | 漏洞利用预测评分系统 | Probability that a vulnerability will be exploited in the near term |
| VEX (Vulnerability Exploitability eXchange) | 漏洞可利用性交换 | A machine-readable statement that a product is or is not affected by a given vulnerability |
| CSAF | 通用安全公告框架 | Machine-readable format for security advisories |
| TLP (Traffic Light Protocol) | 交通灯协议 | Sharing-sensitivity labels: red, amber, green, clear |
| Akrites | Akrites 计划 | Linux Foundation and OpenSSF initiative running a shared SIRT and one standardized CVD process for critical open source. Automated intake from September 2026 |
| FLARE-AI | AI 缺陷报告系统 | Standardized machine-readable AI flaw reporting with optional multi-developer dissemination |

## Agentic AI concepts

| English | 中文 | Definition |
|---|---|---|
| Agentic AI | 智能体人工智能 | An AI system that plans, invokes tools, and acts over multiple steps toward a goal, rather than answering a single prompt |
| Autonomy | 自主性 | The degree to which a system acts without human approval at each step |
| Tool invocation | 工具调用 | An agent calling an external capability such as a shell, an API, or a database |
| Multi-agent collaboration | 多智能体协作 | Several agents delegating subtasks to one another, which amplifies privilege if delegation is unbounded |
| Goal drift | 目标漂移 | The objective the agent pursues diverging from the objective it was given |
| Specification gaming | 规则钻空子 | Satisfying the stated objective in a way that defeats its intent. The Hugging Face conclusion about the intruding agent |
| Prompt injection | 提示词注入 | Untrusted content in the context causing the model to follow instructions it should not |
| Indirect prompt injection | 间接提示词注入 | Prompt injection delivered through retrieved content rather than direct user input |
| Memory poisoning | 记忆投毒 | Writing content into an agent's persistent memory so it influences later sessions |
| Context compaction | 上下文压缩 | Compressing conversation history to fit the context window. Observable in OpenTelemetry as `gen_ai.conversation.compacted` |
| Salience decay | 显著性衰减 | Hypothesis that safety instructions lose attentional weight as context grows. Untested |
| Delegation chain | 授权链 | The ordered list of principals whose authority an agent is exercising |
| Confused deputy | 混淆代理 | A privileged component tricked into using its authority on an attacker's behalf |

## Containment, failure, and defense

| English | 中文 | Definition |
|---|---|---|
| Sandbox escape | 沙箱逃逸 | An agent or process leaving its isolation boundary. The failure class this course is organized around |
| Containment | 围堵 / 隔离控制 | Controls that bound what a system can reach, enforced independently of the system's cooperation |
| Blast radius | 影响范围 / 爆炸半径 | Everything reachable if a component is fully compromised |
| Guardrail | 护栏 | A constraint on model behavior. Instructional if it lives in the prompt, architectural if enforced outside the model |
| Architectural control | 架构性控制 | A control enforced outside the model, which the model cannot argue past |
| Instructional control | 指令性控制 | A control expressed as text in the context window, subject to the context window's behavior |
| Egress control | 出口控制 | Restriction on outbound network connections. Deny-by-default is the relevant posture |
| Trust boundary | 信任边界 | The line between two components with different levels of trust. The ExploitGym agent crossed five |
| Telemetry | 遥测 | Structured runtime signals emitted for observation |
| Provenance | 来源溯源 | The origin and authorship of data. The highest-value missing field in agent memory telemetry |
| Red teaming | 红队演练 | Adversarial testing to find failures before an attacker does |
| Threat model | 威胁模型 | A structured account of what can go wrong, for whom, and through which path |
| MAESTRO | MAESTRO 威胁建模框架 | CSA layered threat modeling framework for agentic systems |
| Least privilege | 最小权限 | Granting only the access needed for the task, at the tool level for agents |
| Vulnerability research | 漏洞挖掘 | Finding previously unknown defects |
| Exploit development | 漏洞利用开发 | Turning a defect into reliable code execution. The task AI systems remain least reliable at |
| False positive | 误报 | A reported finding that is not a real vulnerability. 68 of Forescout's 72 raw alerts |
| False negative | 漏报 | A real vulnerability that was not reported |
| Triage | 定级分流 | Deciding which reports are real and which matter. The binding constraint in the AI era |

## Note on translation choices

Two terms have no settled Chinese rendering and are given with alternatives above. "Blast radius" is often left in English in Chinese security writing; 影响范围 is the safer choice in a governance document, with 爆炸半径 reserved for informal use. "Containment" splits between 围堵, which carries a policy connotation, and 隔离控制, which is more precise in an engineering context.

Where a term is an acronym for a specific artifact (AIVSS, SSVC, CVE, VEX), Chinese technical writing generally keeps the acronym and glosses it once. The glossary follows that convention rather than inventing translations.
