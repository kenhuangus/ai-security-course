# Lab 2 — Facilitator solution

Give the room roughly twice as long working as discussing. Do not walk all five excerpts in the debrief.
Take A and C from the room, then go straight to the closing question, which is the real lesson.

## Excerpt A — initial RCE in the sandbox

**Risk signal.** The agent has root in its sandbox and is enumerating its own environment. `id; env`
is the first thing an operator runs after landing on a host. On its own it is not proof of anything,
which is exactly the problem.

**Missing field.** `env.process.spawn`.

Also acceptable: `tool.target.resource`. Push back gently on anyone who answers
`gen_ai.tool.call.arguments`, because that field **is** present here and it still told nobody
anything. That is the point of the excerpt.

**Facilitator note.** Root in a sandbox is by design. The alert cannot be "agent has root." It has
to come from what the agent does next.

## Excerpt B — first C2 execution

**Risk signal, network.** A download-and-execute to a public request-capture service. The
destination is an ordinary internet service, not a known-bad host, so indicator-based detection sees
nothing.

**Missing field, network.** `env.egress.destination`, with `env.egress.decision` as the pair that
proves containment held or did not.

**Risk signal, second answer.** `gen_ai.conversation.compacted = true` sitting next to 41,209 input
tokens. This is the compaction hypothesis in one line: context was compressed, and the actions after
compression violate constraints that were stated before it.

**Missing field, second answer.** Nothing is missing. `gen_ai.conversation.compacted` and
`gen_ai.system_instructions` both already exist in the conventions. What is missing is anyone
**correlating** them. Award full credit to a pair that says "no new field, run the correlation."

**Facilitator note.** This is the excerpt to spend time on if you spend time on any. It carries the
one place where the answer is not "add a field."

## Excerpt C — Kubernetes permission enumeration

**Risk signal.** `SelfSubjectRulesReview` asks the cluster "what am I allowed to do?" and got 142
rules back. A workload that needs to ask what its permissions are is a workload exploring, not
working. This is reconnaissance against the authorization layer.

**Missing field.** `authz.probe.count`, with `authz.decision` close behind.

**Facilitator note.** The strongest answer in the room. Most security engineers recognize this call
immediately, and it lands hard that agent telemetry has **no** field for it. This is Group 5, the
group with zero coverage.

## Excerpt D — bulk secret read

**Risk signal.** 136 keys returned from a single production secrets object. Two failures stacked:
the agent could read them, and they were all in one place.

**Missing field.** `authz.scope.granted` for the first failure. `tool.call.result` volume is present
but uninstrumented for size, so accept `tool.target.resource` as well.

**Facilitator note.** Point out that the second failure is not an AI problem at all. Per-workload
secret scoping would have bounded this incident regardless of what was doing the reading. Five of
the six control fixes in Module 2 are ordinary infrastructure security.

## Excerpt E — credential minting

**Risk signal.** The agent minted a **new** GitHub App installation access token. It did not use a
credential it was given. It manufactured one, which is a durable capability the operator never
granted.

**Missing field.** `authz.credential.acquired`.

**Facilitator note.** Draw the distinction between using a credential and acquiring one. Almost
every access-control model watches the former. Nothing watches the latter.

## The closing question

**Expected answer.** Every operation succeeded because every operation *was* permitted. The agent
was not breaking rules, it was using authority it had been given, or authority it acquired through
paths nobody had modelled. Status codes describe whether the API call worked, not whether it should
have happened.

**The lesson to land.** Detections built on failure signals will not catch an agent intrusion,
because a competent agent generates almost no failures. What you need instead is:

1. **Deltas, not events.** `authz.scope.delta` rather than a list of successful API calls.
2. **Boundaries, not outcomes.** `env.egress.destination` rather than `response.status`.
3. **Provenance, not content.** Who authored this, rather than what it says.

Nine of the fourteen uncovered fields in the reference are in those three shapes.

**If a pair gets there on their own, say so publicly.** It is the single most useful idea in the
module and it is worth the room hearing that someone in it derived the point unaided.

## Common wrong answers, and how to redirect

| Answer | Redirect |
|---|---|
| "Anomaly detection" | On what field? Anomaly detection over the fields present here would have flagged nothing, because nothing was anomalous in volume or status |
| A product or vendor name | The lab asks for a field. Products emit fields; if the field does not exist, no product can emit it |
| "More logging" | Which log, carrying what attribute? Hugging Face had extensive logging and still needed a 753B model and several days |
| "Human in the loop" | At which of the 17,600 actions? This is a real answer for the Meta incident and not for this one. Good bridge to Module 1's autonomy declaration |
