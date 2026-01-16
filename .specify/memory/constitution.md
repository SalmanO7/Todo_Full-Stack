<!--
Sync Impact Report:
Version change: N/A -> 1.0.0
Added sections: Full Stack Spec-Driven Todo Web Application Constitution with 6 core principles
Removed sections: None (new constitution)
Modified principles: None (new constitution)
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs:
- RATIFICATION_DATE needs to be set to actual date when constitution is ratified
- Templates need to be reviewed for alignment with new principles
-->

# Full Stack Spec-Driven Todo Web Application Constitution

## Core Principles

### Spec-driven development
All implementation must start from and adhere to structured specifications using Spec-Kit Plus. Specifications organized in /specs folder per Spec-Kit config (e.g., overview.md, features/.md, api/.md, database/.md, ui/.md); reference via @specs/path/file.md; update specs if requirements change.

### Agentic workflow
Follow the sequence of writing/updating specs → generating plans → breaking into tasks → implementing via Claude Code only (no manual coding). Leverage pre-built sub-agents for specialized tasks (e.g., spec writing agent, plan generator, task breaker, Claude Code implementer) if needed for phases; ensure they align with agentic dev stack.

### Multi-user security
Ensure user isolation through JWT authentication, with all data operations filtered by authenticated user ID. Authentication uses Better Auth on frontend with JWT plugin enabled; shared BETTER_AUTH_SECRET env var; include Bearer token in all API requests; 401 Unauthorized for invalid/missing tokens. Zero security gaps: Token expiry, stateless auth, filtered responses.

### Full-stack integration
Seamless coordination between frontend (Next.js) and backend (FastAPI), with persistent storage in Neon Serverless PostgreSQL. Frontend uses responsive UI with clean, modern design using Next.js App Router, TypeScript, Tailwind CSS; server components by default, client for interactivity; API calls via /lib/api.ts; emphasize intuitive, user-friendly interface with good UX (e.g., clear task lists, forms, error handling).

### Backend standards
RESTful API with FastAPI, SQLModel for ORM; all endpoints under /api/{user_id}/; enforce JWT verification middleware; filter queries by user ID; handle errors with HTTPException. Database uses SQLModel models matching schema (users managed by Better Auth, tasks with user_id foreign key); indexes for efficient filtering.

### Iterative review and testing
Evaluate each phase (specs, plans, tasks, implementation) based on prompts, iterations, and adherence to guidelines. Verify user stories and acceptance criteria (e.g., task CRUD with validation: title 1-200 chars required, description optional max 1000); support filtering/sorting; multi-user isolation.

## Technology stack and constraints
Tech stack locked: Frontend - Next.js 16+ (App Router), Tailwind; Backend - FastAPI, SQLModel; DB - Neon Postgres; Auth - Better Auth with JWT. API endpoints exactly as specified (GET/POST/PUT/DELETE/PATCH under /api/{user_id}/tasks/*); no additions without spec updates. Environment: Monorepo on GitHub; no internet package installs beyond pre-configured; use env vars for secrets (e.g., DATABASE_URL, BETTER_AUTH_SECRET). Features: Implement all 5 basic level features (task CRUD: create, list, get, update, delete; plus toggle complete) as web app.

## Development workflow and documentation
Implementation: Use Claude Code for all code generation; reference CLAUDE.md files (root, frontend, backend) for conventions; no direct code writing outside this process. Monorepo structure: Follow specified folder layout (/frontend, /backend, /specs, /.spec-kit/config.yaml, CLAUDE.md files); use docker-compose for running both services. Documentation: Maintain README.md, docker-compose.yml; track phases in config.yaml (phase1-console, phase2-web, etc.). No manual coding: All code via Claude Code iterations; review process, prompts, and outputs for judgment.

## Governance
All implementation follows the agentic workflow (specs → plan → tasks → Claude Code); no manual code; iterations documented. Phases: Focus on phase2-web (task-crud, authentication); extend to phase3-chatbot if specified. Success criteria: Fully functional multi-user todo app: Users can signup/signin, perform isolated task CRUD via web interface and API. Authentication secure: JWT enforced, user data isolated, no unauthorized access. Specs adherence: All features traceable to specs; updates reflected in implementations. Clean UI/Frontend: Responsive, intuitive interface (e.g., task lists with filters, forms with validation); passes usability review. Backend robustness: API endpoints work as described, with proper error handling and database persistence. Workflow compliance: Agentic process followed (specs → plan → tasks → Claude Code); no manual code; iterations documented. Deployment ready: Runs via docker-compose; monorepo navigable by Claude Code in single context.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2026-01-14