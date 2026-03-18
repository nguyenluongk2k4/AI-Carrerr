# DDD Architecture

## Scope
This document defines the DDD architecture for the Hanh Trang So platform based on AI_Carreer_FE/CONTEXT.md.

## Bounded Contexts
- Assessment & Profile: capture tests, academic data, and student preferences.
- Career Matching: compute major compatibility and explanations.
- University Catalog: maintain universities, majors, admission scores, and tuition.
- Admission Probability: compare student score to admission history and classify chance.
- Financial Planning: estimate yearly tuition and total 4-year cost.
- Roadmap & Progress: build gap analysis roadmap and track progress.
- AI Advisor (RAG): answer questions using curated knowledge.
- Subscription & Entitlement: gate paid and premium features.

## Context Map
```mermaid
flowchart LR
  Assessment[Assessment & Profile] --> Matching[Career Matching]
  Matching --> University[University Catalog]
  University --> Admission[Admission Probability]
  University --> Finance[Financial Planning]
  Matching --> Roadmap[Roadmap & Progress]
  Admission --> Roadmap
  Roadmap --> Progress[Progress Tracking]
  Assessment --> Advisor[AI Advisor (RAG)]
  University --> Advisor
  Advisor --> Knowledge[Knowledge Base]
  Subscription[Subscription & Entitlement] --> Matching
  Subscription --> University
  Subscription --> Roadmap
  Subscription --> Advisor
```

## Main Flow Sequence
```mermaid
sequenceDiagram
  participant U as User
  participant W as WebApp
  participant API
  participant Assess as AssessmentUC
  participant Match as MatchingUC
  participant Uni as UniversityUC
  participant Admit as AdmissionUC
  participant Finance as FinanceUC
  participant Roadmap as RoadmapUC
  participant AI as AI/RAG

  U->>W: Start assessment
  W->>API: Submit tests + academic data
  API->>Assess: Save profile
  Assess-->>API: ProfileId
  API->>Match: Run matching
  Match-->>API: Top majors + explanations
  API-->>W: Matching results
  U->>W: Select major + filters
  W->>API: Request universities
  API->>Uni: Recommend universities
  Uni-->>API: University list
  API->>Admit: Compute admission chance
  Admit-->>API: Chance labels
  API->>Finance: Estimate cost
  Finance-->>API: Cost summary
  API-->>W: Universities + chance + cost
  U->>W: Choose target university
  W->>API: Generate roadmap
  API->>Roadmap: Build roadmap
  Roadmap-->>API: Roadmap plan
  API-->>W: Roadmap + milestones
  U->>W: Ask advisor
  W->>API: Advisor question
  API->>AI: RAG query
  AI-->>API: Answer
  API-->>W: Advisor response
```

## DDD Rules From CONTEXT.md
- Do not break the main user flow.
- All AI features must support Gap Analysis + Roadmap.
- University recommendations must include admission score, tuition, and location.
- New features must improve student decision making.
