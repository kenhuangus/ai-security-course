# SDL v-next — the annotated gate diagram

From `w3-sdl.md`. Classical gates in the left column, new gates in the right. Every new gate names the artifact a reviewer signs.

```mermaid
flowchart TD
    subgraph CLASSICAL["Classical SDL gates"]
        direction TB
        R[Requirements]:::amber
        TM[Threat modeling]:::amber
        DR[Design review]:::amber
        SA[Static analysis]:::green
        DEP[Dependency and supply chain]:::amber
        DT[Dynamic testing]:::amber
        PT[Penetration testing]:::amber
        RA[Release approval]:::amber
        IR[Incident response]:::red
    end

    subgraph NEW["New gates for AI systems"]
        direction TB
        G1[Data provenance and dataset integrity]:::blue
        G2[Model registry and lineage]:::blue
        G3[Evaluation-as-test with regression baselines]:::blue
        G4[Red-team gate]:::blue
        G5[Guardrail regression suite<br/>including after context compaction]:::blue
        G6[Agent permission review]:::blue
        G7[Tool and skill supply chain review]:::blue
        G8[Containment and blast-radius review]:::blue
    end

    R --> TM --> DR --> SA --> DEP --> DT --> PT --> RA --> IR
    R -.autonomy declaration.-> G6
    TM -.MAESTRO layers.-> G8
    DR -.control placement.-> G5
    DEP --> G1
    DEP --> G7
    DR --> G2
    DT --> G3
    PT --> G4
    G8 --> RA
    G5 --> RA

    classDef green fill:#e9f7ef,stroke:#2b8a3e,stroke-width:2px,color:#14401f
    classDef amber fill:#fff6e6,stroke:#f08c00,stroke-width:2px,color:#5c3600
    classDef red   fill:#fff5f5,stroke:#e03131,stroke-width:2px,color:#7a1616
    classDef blue  fill:#eef6ff,stroke:#1971c2,stroke-width:2px,color:#0f3d6b
```

Legend. Green: survives unchanged. Amber: needs new evidence. Red: needs the most change. Blue: entirely new gate.

## Reading the diagram

Only one classical gate is green. Static analysis still finds what it always found, unchanged in kind and larger in volume.

Incident response is the red one, and it is the finding most teams have not planned for. When Hugging Face analysts tried to reverse-engineer recovered payloads, commercial frontier models refused the work because provider guardrails treated analysing an exploit the same as launching one. Analysis capability that depends on a third party's content policy is an availability dependency, and it belongs in the incident response plan's dependency list.

The dotted edges are the ones that matter architecturally. Requirements feeds the agent permission review because an autonomy declaration is a requirement, not a runtime setting. Design review feeds the guardrail regression suite because deciding where a control lives is a design decision, and an instruction in a system prompt is not a control. Threat modeling feeds containment review because blast radius is a modelling output.

Two gates feed release approval directly. A release that has not passed containment review and guardrail regression has not established that its controls hold when the agent stops cooperating, which is the failure mode all three incidents in this course share.

## Exit criteria, condensed

| Gate | Signed artifact |
|---|---|
| Data provenance | Corpus manifest with origin, licence, integrity hash. No corpus of unattested origin |
| Model registry | Deployed artifact traceable to weights, version, evaluation run, and matching the evaluated one |
| Evaluation-as-test | Stored baseline plus current run, with a stated allowable regression. Sign the delta |
| Red-team gate | Report whose attempted vectors match the deployed tool surface |
| Guardrail regression | Suite proving each guardrail holds after context compaction, not only at turn one |
| Agent permission review | Enumerated permissions with per-grant justification, plus the constructible delegation chain |
| Tool and skill supply chain | Every tool and skill with publisher identity, integrity pin, scope declaration |
| Containment and blast radius | Written statement of reachability under full compromise, with egress enforced outside the agent |
