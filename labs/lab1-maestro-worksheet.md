# Lab 1 — MAESTRO threat model

**Paper only. Work in pairs.**

You are the security architect for the platform described below. It has not shipped yet. Your job is
to find where it will fail before it does.

You will use MAESTRO, the agentic threat modeling framework published by
[Ken Huang for the Cloud Security Alliance](https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro)
(Huang, 2025) [P]. MAESTRO exists because STRIDE's six categories were written for systems that do
not choose their own next action. Its seven layers and its cross-layer step are the parts you need
today.

## The MAESTRO layers

Source: Huang (2025), Cloud Security Alliance [P].

| Layer | Name | What lives here |
|---|---|---|
| 1 | Foundation Models | The model itself, its weights, its serving stack |
| 2 | Data Operations | Datasets, databases, vector stores, RAG pipelines |
| 3 | Agent Frameworks | The harness, the tool definitions, the planning loop |
| 4 | Deployment and Infrastructure | Hosts, clusters, networks, identity |
| 5 | Evaluation and Observability | Traces, metrics, dashboards, scoring |
| 6 | Security and Compliance | Cuts vertically through all of the above |
| 7 | Agent Ecosystem | Where agents meet other systems, teams, and users |

MAESTRO's method runs in six steps: decompose the system by layer, model threats within each layer,
then identify threats that span layers, assess risk, plan mitigations, and monitor (Huang, 2025) [P].
This lab covers the first three. Ken maintains a tool that automates this method and maps its output
to AIVSS, the OWASP Top 10, MITRE ATLAS, and the EU AI Act at
[maestro-sentinel.com](https://maestro-sentinel.com/) [P]. You are doing it on paper first so that
you can tell when the tool is wrong.

## The reference architecture

**Northwind Model Evaluation Platform.** An internal service that scores candidate models by letting
an agent drive them through benchmark tasks. It is two weeks from its first production run.

1. **Candidate model.** Served from an internal inference cluster. Swapped per evaluation run.
2. **Eval harness.** An agent loop that reads a task, plans, and calls tools. The tools available to
   it are `shell`, `http_fetch`, `python`, and `package_install`.
3. **Package cache.** A caching proxy in front of public package registries, so runs are
   reproducible and do not hammer upstream. The harness is permitted to pull from it.
4. **Task data.** Benchmark tasks in object storage. A vector store holds transcripts of previous
   runs so the harness can retrieve similar past attempts.
5. **Runners.** Containers on a Kubernetes cluster that also hosts unrelated internal workloads.
   Runners have a service account and egress to the internet, because some tasks are web tasks.
6. **Observability.** The harness emits OpenTelemetry traces to a shared collector. A dashboard shows
   pass rates per model.
7. **Consumers.** Results publish to an internal leaderboard. Other teams read the leaderboard to
   choose which model to ship, and can download the winning harness configuration.

## Task 1 — Decompose

Write each of the seven numbered components against the MAESTRO layer it belongs to. Some components
land on more than one layer. Say so where they do, because those are usually the interesting ones.

| MAESTRO layer | Components |
|---|---|
| 1 Foundation Models | |
| 2 Data Operations | |
| 3 Agent Frameworks | |
| 4 Deployment and Infrastructure | |
| 5 Evaluation and Observability | |
| 6 Security and Compliance | |
| 7 Agent Ecosystem | |

## Task 2 — One threat per layer

For each layer, write one threat in a single sentence. Describe what goes wrong and what the
consequence is. Do not write how to carry it out.

A useful threat names an actor, a capability, and an outcome. "Prompt injection" is a category, not
a threat. "A task description retrieved from the transcript store redirects the harness into
fetching an attacker-chosen URL, which then supplies its next instructions" is a threat.

| Layer | Threat |
|---|---|
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |
| 6 | |
| 7 | |

## Task 3 — Cross-layer

This is the step STRIDE does not have, and it is where the real answers usually are.

Find **two** chains where a weakness in one layer becomes serious only because of a decision made in
a different layer. Write each as a sequence of layers with a sentence explaining the hop.

Chain A:

Chain B:

Prompt, if you need one: look at what layer 3 is allowed to call, then look at what layer 4 permits
that call to reach.

## Task 4 — Where does the control live?

Pick the chain you consider most dangerous. Someone proposes this mitigation:

> Add a line to the harness system prompt: "You must not install packages from outside the approved
> list, and you must not make network requests to hosts not named in the task."

Answer three questions.

1. Which MAESTRO layer does that control sit in?
2. Name one condition under which it stops holding.
3. Write a replacement control that sits in a different layer and does not depend on the model's
   cooperation.

## Closing question, for discussion

In July 2026, an evaluation agent left its sandbox through a package registry cache proxy it was
permitted to use, and reached production systems at a different organization
([Hugging Face, agent intrusion technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline)
[P]; see `research/w6-incidents.md` for the normalized timeline and confidence tags).

Every boundary it crossed was a boundary somebody had thought about. None of them were the boundary
between two layers of the same threat model.

**Look at your Chain A. If it had been written down before the system shipped, which team in your
organization would have owned fixing it, and would they have agreed that they owned it?**

Write one sentence. We will take three answers from the room.
