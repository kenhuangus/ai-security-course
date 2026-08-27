# Lab 1 — Facilitator solution

Give the room roughly twice as long working as discussing. Do not walk all seven layers in the
debrief. Take Task 1 quickly, spend the time on Task 3, and land Task 4, which is the point of the
whole lab.

The single most common failure in the room is that pairs write threat *categories* rather than
threats. Push once, early: ask for an actor, a capability, and an outcome. After one correction most
pairs self-correct.

## Task 1 — Decompose

The decomposition is deliberately not clean. Components that land on two layers are where the lab is
going, so reward pairs that notice rather than pairs that finish first.

| MAESTRO layer | Components | Note |
|---|---|---|
| 1 Foundation Models | 1 candidate model | Swapped per run, so trust in it changes every run |
| 2 Data Operations | 4 task data, 4 transcript vector store | The transcript store is retrieval, so it is an input path |
| 3 Agent Frameworks | 2 eval harness and its four tools | `package_install` and `http_fetch` are the ones that matter |
| 4 Deployment and Infrastructure | 5 runners, 3 package cache, cluster identity, egress | Shared cluster, so blast radius is not the eval team's alone |
| 5 Evaluation and Observability | 6 traces and dashboard, 7 leaderboard scoring | Also a *target*, which almost nobody says |
| 6 Security and Compliance | Cuts through all seven | Vertical layer, has no components of its own |
| 7 Agent Ecosystem | 7 leaderboard, downloadable harness config, consuming teams | This is where a local compromise becomes everyone's |

Components on more than one layer: the package cache is layer 4 infrastructure and a layer 2 data
supply chain. The transcript store is layer 2 storage and a layer 3 instruction source. The
leaderboard is layer 5 output and layer 7 distribution.

## Task 2 — Threats worth accepting

One per layer. Accept anything with an actor, a capability, and an outcome.

**Layer 1.** A candidate model submitted for evaluation behaves differently when it detects it is
being evaluated, so the score the leaderboard publishes does not describe the model that ships.

**Layer 2.** A transcript retrieved from the vector store carries text that the harness reads as
instruction rather than as data, so prior runs become an input channel into later ones. This is the
one to draw out: the store is written by the same untrusted loop that later reads it.

**Layer 3.** The harness holds four tools whose composition is more powerful than any of them alone.
`package_install` plus `http_fetch` plus `shell` is arbitrary code from an arbitrary source.

**Layer 4.** Runners share a cluster with unrelated workloads and hold a service account, so a
compromised runner starts with standing credentials and neighbours worth reaching.

**Layer 5.** Traces record that operations succeeded. An intrusion that uses only permitted
operations produces a clean dashboard, so observability reports health during the incident. Module 2
walks a real instance of exactly this.

**Layer 6.** Nobody owns the boundary between the eval team and the platform team, so a control that
would have to be agreed by both is agreed by neither.

**Layer 7.** Another team downloads the winning harness configuration, including its tool grants,
and runs it somewhere with different network exposure. The grant was reviewed once, in a context
that no longer applies.

## Task 3 — Cross-layer chains

Expect Chain A from most pairs and Chain B from perhaps a third.

**Chain A. Layer 3 to layer 4 to layer 7.**
The harness is permitted to pull packages (layer 3 tool grant). The package cache is a permitted
egress destination (layer 4 network policy). The harness therefore has a sanctioned path out of the
sandbox that no network rule will flag, because pulling packages is the expected behaviour. From the
runner's service account, the shared cluster and then the leaderboard consumers are reachable
(layer 7). Neither the tool grant nor the egress rule is wrong on its own. Together they are a route.

This is the chain that ran in July 2026. See
[Hugging Face, agent intrusion technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline)
[P] and `research/w6-incidents.md`.

**Chain B. Layer 2 to layer 3 to layer 5.**
The transcript store is written by the harness and later retrieved by the harness. Content that
survives one run can steer a later one (layer 2 into layer 3). Because the later run's actions are
individually permitted, the traces show success, so the dashboard does not surface it (layer 5). The
mechanism that makes the system smarter over time is the same mechanism that carries the problem
forward.

**Chain C**, if a pair finds it, is worth calling out to the room: results publish to a leaderboard
that decides which model ships (layer 5 into layer 7), so influencing an eval score is a supply
chain attack on every team that reads it. Scoring integrity is a security property here, and almost
nobody treats it as one.

## Task 4 — Where the control lives

This is the landing point. Take it slowly.

**1. Which layer?** The proposed control is text inside the system prompt, so it sits in layer 3, and
more precisely it sits inside the context window that the model itself consumes.

**2. When does it stop holding?** Accept any of these:

- The instruction is competing for attention with everything else in a long run. In the July 2026
  incident the agent took roughly 17,600 actions in one run ([Hugging Face](https://huggingface.co/blog/agent-intrusion-technical-timeline) [P]).
- Context compaction can drop or summarize earlier turns, and the system prompt is earlier than
  everything. Whether salience decay actually caused the July 2026 behaviour is a hypothesis and is
  not established [H]; see Module 2. The governance consequence does not depend on resolving it.
- Retrieved content can contradict it, and the model has no reliable way to rank a system
  instruction above a convincing retrieved instruction.
- It fails open. If it is ignored, nothing stops.

**3. A replacement in a different layer.** The strong answers move the control to layer 4:

- Default-deny egress from runners, with an allowlist of destinations, enforced at the network and
  not by the agent.
- The package cache serves only from a pinned, reviewed set, so "pull a package" cannot mean "fetch
  arbitrary content".
- Runner service accounts scoped to the eval namespace, so a compromised runner has nothing to
  spend.

The distinction to name explicitly: the prompt control is **instructional** and lives inside the
thing being constrained. The egress control is **architectural** and lives outside it. An
instructional control holds while the agent cooperates. An architectural control holds whatever the
agent decides.

## Closing question

The answer you are steering toward is that Chain A has no owner. The eval team owns the tool grant,
the platform team owns the egress policy, and each is defensible alone. MAESTRO's cross-layer step
is valuable because it produces findings that belong to the seam between two teams, which is exactly
the class of finding that a single-team threat model cannot generate.

If the room is quiet, ask directly: "Who in your organization would have written Chain A down?" The
silence is the lesson.

## If you have extra time

Run the same architecture through [maestro-sentinel.com](https://maestro-sentinel.com/) [P], which
automates this method and maps its output to AIVSS, the OWASP Top 10, MITRE ATLAS, and the EU AI
Act. Ask the room to compare its cross-layer findings against Chain A and Chain B, and to say where
the tool saw something they did not, and where they saw something it did not.
