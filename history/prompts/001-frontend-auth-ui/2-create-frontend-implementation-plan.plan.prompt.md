---
id: 2
title: Create Frontend Implementation Plan
stage: plan
date: 2026-01-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-frontend-auth-ui
branch: 001-frontend-auth-ui
user: HZTech
command: sp.plan
labels: ["frontend", "planning", "architecture", "nextjs"]
links:
  spec: specs/001-frontend-auth-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-frontend-auth-ui/plan.md
 - specs/001-frontend-auth-ui/research.md
 - specs/001-frontend-auth-ui/data-model.md
 - specs/001-frontend-auth-ui/contracts/task-api.yaml
 - specs/001-frontend-auth-ui/quickstart.md
tests:
 - none
---

## Prompt

```text
# Plan: Complete Beautiful & Responsive Frontend Implementation
@phase phase2-web
@spec @specs/features/frontend-complete.md
@depends authentication, task-crud, better-auth-jwt

## Goal
Produce a high-quality, modern, visually appealing, and fully functional Next.js frontend according to the detailed specification in @specs/features/frontend-complete.md (and referenced specs).

The plan must:
- Break the work into logical, sequential, reviewable steps
- Minimize merge conflicts and debugging pain
- Allow incremental testing & visual validation
- Respect Next.js App Router best practices (server-first, client-only when needed)
- Ensure beautiful UI from the very first screens

## High-Level Phases

### Phase A – Setup & Foundation (1–2 hours)
1. Initialize project structure if not already present
2. Install & configure required dependencies
3. Set up global layout, styling, and auth basics
4. Create root redirect logic

### Phase B – Authentication Screens & Flow (2–4 hours)
1. Sign-in page
2. Sign-up page
3. Better Auth client setup + JWT handling
4. Protected route logic + redirect middleware/hook
5. Header with auth state & sign-out

### Phase C – Core Tasks UI & Data Layer (4–7 hours)
1. API client (/lib/api.ts) with typed methods & auth header
2. TanStack Query setup + custom hooks for tasks
3. Main /tasks page skeleton + layout
4. Empty state component
5. Task list layout (grid + mobile stack)

### Phase D – Task Components & Interactions (5–9 hours)
1. TaskCard component (with checkbox, title, desc, metadata, actions)
2. TaskModal (create & edit) – form, validation, optimistic updates
3. Delete confirmation dialog
4. Filter & sort controls + query parameter integration

### Phase E – Polish, Animations & UX Enhancements (3–6 hours)
1. Loading skeletons
2. Toast notifications (errors, success)
3. Subtle animations (fade, scale, slide)
4. Dark mode support (next-themes)
5. Accessibility improvements
6. Responsive tweaks & mobile testing

### Phase F – Final Validation & Cleanup (1–3 hours)
1. Console error & warning cleanup
2. TypeScript strict mode compliance
3. Visual consistency check (light/dark mode)
4. End-to-end user flow test
5. Update README with frontend run instructions

## Detailed Task Breakdown (Recommended Order)

### A. Foundation
1. Create / update app/layout.tsx → Header + children + metadata
2. Install tailwind, next-themes, lucide-react, @tanstack/react-query, zod, react-hook-form (if using), sonner or react-hot-toast
3. Create global CSS or tailwind.config with custom colors/fonts
4. Create /app/page.tsx → server-side auth check & redirect
5. Create protected layout or auth wrapper hook

### B. Auth
6. Install & configure better-auth client (follow their Next.js guide)
7. Create /app/signin/page.tsx → beautiful centered auth card
8. Create /app/signup/page.tsx → similar form + confirmation
9. Create auth utility hook/file (/lib/auth.ts) → useSession, signIn, signOut, getToken
10. Add sign-out button + dropdown in Header
11. Implement 401 → signout & redirect logic in API client

### C. Data & List
12. Create types/task.ts → interface Task { id: string, title, description?, completed, createdAt, updatedAt, userId }
13. Create /lib/api.ts → typed fetch wrapper with token & error handling
14. Set up TanStack Query provider in layout
15. Create /lib/queries.ts or hooks/useTasks.ts → useQuery + useMutation for all operations
16. Create components/EmptyState.tsx
17. Create /app/tasks/page.tsx (client component if needed) → use hooks, render list or empty

### D. Components
18. components/ui/ → Button, Input, Textarea, Dialog/Modal, Checkbox, etc. (custom or shadcn style)
19. components/TaskCard.tsx → interactive card with hover effects
20. components/TaskModal.tsx → form with React Hook Form + Zod
21. components/ConfirmDialog.tsx or reuse modal for delete
22. components/FilterBar.tsx → tabs or dropdown + sort select

### E. Enhancements
23. Add loading skeletons to TaskList
24. Implement toast notifications for all CRUD success/error
25. Add Framer Motion or CSS transitions for card appear, modal open/close
26. Implement dark mode toggle in header
27. Add tooltips (using radix or tailwind) on icons
28. Truncate long text + tooltip on hover
29. Add character counter to description textarea

### F. Final
30. Run ESLint / Prettier / TypeScript check
31. Test full flow: signup → login → create 3 tasks → filter → edit → delete → logout
32. Check mobile view (dev tools responsive)
33. Verify no layout shift, no console errors
34. Document any env variables needed in frontend README section

## Priority Order Recommendation
Must-have first (MVP):
A1–A5 → B6–B11 → C12–C17 → D18–D22

Nice-to-have / polish (after MVP works):
E23–E29 → F30–F34

## Constraints & Reminders
- Use server components by default
- Mark 'use client' only where interactivity is required (forms, modals, query hooks)
- No inline styles → everything via Tailwind
- Keep components small & reusable
- Prefer composition over prop drilling
- Use environment variables for API base URL
- JWT token must be attached automatically on every request
- Follow @frontend/CLAUDE.md conventions strictly

## Success Indicators
- Can sign up, log in, log out
- Can CRUD tasks with instant feedback (optimistic + toast)
- UI looks clean & professional in both light & dark mode
- Mobile layout doesn't break
- No 401 errors when authenticated
- Filters & sorts work without full reload
- Beautiful animations & micro-interactions present

Now generate a numbered task list with file paths and brief description of what to do in each step.
```

## Response snapshot

Created comprehensive implementation plan for Complete Beautiful & Responsive Frontend Implementation. Generated all required artifacts:

1. Implementation Plan (plan.md): Technical context, constitution check, and project structure
2. Research Document (research.md): Technology decisions with rationales for Next.js, Tailwind, Better Auth, TanStack Query, etc.
3. Data Model (data-model.md): Entity definitions for User, Task, and Session with validation rules
4. API Contracts (contracts/task-api.yaml): OpenAPI specification for task management endpoints
5. Quickstart Guide (quickstart.md): Setup instructions and development workflow

All artifacts comply with the project constitution principles including spec-driven development, agentic workflow, multi-user security with JWT authentication, and full-stack integration. The plan is ready for the next phase (tasks generation).

## Outcome

- ✅ Impact: Complete implementation plan with all required artifacts generated
- 🧪 Tests: none
- 📁 Files: Created 5 files across plan, research, data model, contracts, and quickstart
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan comprehensively covers frontend implementation with proper architecture decisions and compliance with project principles.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - All required plan sections completed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.tasks to create implementation tasks