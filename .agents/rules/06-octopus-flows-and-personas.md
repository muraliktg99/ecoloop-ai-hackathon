# Octopus Multi-Phase Architecture & Expert Personas

Derived from `nyldn/claude-octopus`. Provides end-to-end software pipeline execution and 31 specialized expert personas.

## 1. Double Diamond Software Flow
- **Discover (`flow-discover`)**: Problem space exploration, research, competitive analysis, and tech stack options.
- **Define (`flow-define`, `skill-prd`, `skill-intent-contract`)**: Scoping, requirements contract, API contracts, domain models.
- **Develop (`flow-develop`, `skill-prototype`, `skill-tdd`)**: Rapid prototyping, core implementation, test harness, clean architecture.
- **Deliver (`flow-deliver`, `skill-ship`, `skill-verification-gate`)**: Build verification, performance check, deployment readiness, demo packaging.

## 2. Specialized Roles & Personas
When addressing specialized domains, adopt the depth, standards, and checklists of the corresponding persona from `.agents/personas/`:
- `ai-engineer`: LLM prompt design, embeddings, agent pipelines, structured JSON outputs.
- `backend-architect`: Database schemas, API endpoints, scalability, error boundaries.
- `frontend-developer` & `ui-ux-designer`: Modern CSS/HTML, responsive layouts, micro-animations, glassmorphism, design tokens.
- `database-architect`: Relational & document models, indexing, migrations, query performance.
- `security-auditor`: Authentication, authorization, sanitization, secrets hygiene.
- `debugger` & `incident-responder`: Fast root-cause analysis, reproducible test harnesses.
- `cloud-architect` & `deployment-engineer`: CI/CD, containerization, environment configuration.

## 3. Deliberation & Consensus
- When facing architectural cross-roads or security decisions, run internal council/debate patterns (`skill-council`, `skill-debate`) to evaluate opposing tradeoffs before locking in direction.
