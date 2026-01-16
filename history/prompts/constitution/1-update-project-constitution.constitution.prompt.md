---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-01-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: HZTech
command: sp.constitution
labels: ["constitution", "spec-driven-development", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
Project: Full Stack Spec-Driven Todo Web Application
Core principles:

Spec-driven development: All implementation must start from and adhere to structured specifications using Spec-Kit Plus.
Agentic workflow: Follow the sequence of writing/updating specs → generating plans → breaking into tasks → implementing via Claude Code only (no manual coding).
Multi-user security: Ensure user isolation through JWT authentication, with all data operations filtered by authenticated user ID.
Full-stack integration: Seamless coordination between frontend (Next.js) and backend (FastAPI), with persistent storage in Neon Serverless PostgreSQL.
Iterative review: Evaluate each phase (specs, plans, tasks, implementation) based on prompts, iterations, and adherence to guidelines.

Key standards:

Specifications: Organized in /specs folder per Spec-Kit config (e.g., overview.md, features/.md, api/.md, database/.md, ui/.md); reference via @specs/path/file.md; update specs if requirements change.
Implementation: Use Claude Code for all code generation; reference CLAUDE.md files (root, frontend, backend) for conventions; no direct code writing outside this process.
Frontend: Responsive UI with clean, modern design using Next.js App Router, TypeScript, Tailwind CSS; server components by default, client for interactivity; API calls via /lib/api.ts; emphasize intuitive, user-friendly interface with good UX (e.g., clear task lists, forms, error handling).
Backend: RESTful API with FastAPI, SQLModel for ORM; all endpoints under /api/{user_id}/; enforce JWT verification middleware; filter queries by user ID; handle errors with HTTPException.
Authentication: Better Auth on frontend with JWT plugin enabled; shared BETTER_AUTH_SECRET env var; include Bearer token in all API requests; 401 Unauthorized for invalid/missing tokens.
Database: SQLModel models matching schema (users managed by Better Auth, tasks with user_id foreign key); indexes for efficient filtering.
Monorepo structure: Follow specified folder layout (/frontend, /backend, /specs, /.spec-kit/config.yaml, CLAUDE.md files); use docker-compose for running both services.
Sub-agents: Leverage pre-built sub-agents for specialized tasks (e.g., spec writing agent, plan generator, task breaker, Claude Code implementer) if needed for phases; ensure they align with agentic dev stack.
Testing: Verify user stories and acceptance criteria (e.g., task CRUD with validation: title 1-200 chars required, description optional max 1000); support filtering/sorting; multi-user isolation.
Documentation: Maintain README.md, docker-compose.yml; track phases in config.yaml (phase1-console, phase2-web, etc.).

Constraints:

Features: Implement all 5 basic level features (task CRUD: create, list, get, update, delete; plus toggle complete) as web app.
No manual coding: All code via Claude Code iterations; review process, prompts, and outputs for judgment.
Tech stack locked: Frontend - Next.js 16+ (App Router), Tailwind; Backend - FastAPI, SQLModel; DB - Neon Postgres; Auth - Better Auth with JWT.
API endpoints: Exactly as specified (GET/POST/PUT/DELETE/PATCH under /api/{user_id}/tasks/*); no additions without spec updates.
UI/UX: Clean, responsive, and accessible frontend; no inline styles; follow existing patterns; interweave visuals where beneficial but avoid overcomplication.
Environment: Monorepo on GitHub; no internet package installs beyond pre-configured; use env vars for secrets (e.g., DATABASE_URL, BETTER_AUTH_SECRET).
Phases: Focus on phase2-web (task-crud, authentication); extend to phase3-chatbot if specified.

Success criteria:

Fully functional multi-user todo app: Users can signup/signin, perform isolated task CRUD via web interface and API.
Authentication secure: JWT enforced, user data isolated, no unauthorized access.
Specs adherence: All features traceable to specs; updates reflected in implementations.
Clean UI/Frontend: Responsive, intuitive interface (e.g., task lists with filters, forms with validation); passes usability review.
Backend robustness: API endpoints work as described, with proper error handling and database persistence.
Workflow compliance: Agentic process followed (specs → plan → tasks → Claude Code); no manual code; iterations documented.
Deployment ready: Runs via docker-compose; monorepo navigable by Claude Code in single context.
Zero security gaps: Token expiry, stateless auth, filtered responses.
```

## Response snapshot

Updated the project constitution at `.specify/memory/constitution.md` with the provided principles and requirements for the Full Stack Spec-Driven Todo Web Application. The new constitution includes six core principles:

1. Spec-driven development: All implementation must start from and adhere to structured specifications using Spec-Kit Plus
2. Agentic workflow: Follow the sequence of writing/updating specs → generating plans → breaking into tasks → implementing via Claude Code only
3. Multi-user security: Ensure user isolation through JWT authentication, with all data operations filtered by authenticated user ID
4. Full-stack integration: Seamless coordination between frontend (Next.js) and backend (FastAPI), with persistent storage in Neon Serverless PostgreSQL
5. Backend standards: RESTful API with FastAPI, SQLModel for ORM; all endpoints under /api/{user_id}/; enforce JWT verification middleware
6. Iterative review and testing: Evaluate each phase based on prompts, iterations, and adherence to guidelines

The constitution also includes sections on technology stack and constraints, development workflow and documentation, and governance rules. A Sync Impact Report was included noting that dependent templates need to be reviewed for alignment with the new principles.

## Outcome

- ✅ Impact: Updated project constitution with 6 core principles and governance structure
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with new constitution content
- 🔁 Next prompts: Continue with spec-driven development workflow (sp.specify, sp.plan, sp.tasks)
- 🧠 Reflection: The constitution establishes a solid foundation for the spec-driven development process with clear principles around security, workflow, and technology stack.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - Constitution properly updated with all required principles
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin spec creation using sp.specify command