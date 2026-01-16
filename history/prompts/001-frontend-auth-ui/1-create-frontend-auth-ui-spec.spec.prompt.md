---
id: 1
title: Create Frontend Auth UI Spec
stage: spec
date: 2026-01-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-frontend-auth-ui
branch: 001-frontend-auth-ui
user: HZTech
command: sp.specify
labels: ["frontend", "authentication", "ui", "ux"]
links:
  spec: specs/001-frontend-auth-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-frontend-auth-ui/spec.md
 - specs/001-frontend-auth-ui/checklists/requirements.md
tests:
 - none
---

## Prompt

```text
# Feature: Complete Responsive Frontend Implementation with Beautiful UI
@phase phase2-web
@depends authentication, task-crud

## Overview
Implement the full modern, responsive, clean-looking frontend for the multi-user Todo application using Next.js App Router. The UI must be exceptionally beautiful, intuitive, and professional-grade, emphasizing great user experience with polished visuals, smooth interactions, and modern design principles. Prioritize aesthetics: use harmonious color schemes, subtle animations, high-quality typography, and responsive layouts that look stunning on all devices (mobile, tablet, desktop).

The frontend must:
- Handle user authentication (signup, signin, signout) using Better Auth with JWT enabled.
- Display, create, edit, delete, and toggle completion of tasks.
- Show only the current user's tasks.
- Be mobile-friendly, accessible, and follow modern UI/UX best practices.
- Use Tailwind CSS exclusively for styling to achieve a beautiful, consistent design.

## Core Requirements

### 1. Authentication Flow (Better Auth)
- Configure Better Auth with email/password authentication and JWT plugin enabled (use shared BETTER_AUTH_SECRET env var).
- Pages:
  - /signin → Beautiful login form with subtle background (e.g., gradient or minimal illustration), centered card layout, input fields with floating labels, password visibility toggle, and "Sign Up" link.
  - /signup → Similar registration form with name, email, password fields; include password confirmation and "Sign In" link.
  - Protected routes: Use middleware or hooks to redirect unauthenticated users to /signin with a smooth transition.
- After successful login: Redirect to /tasks with a loading spinner or fade-in animation.
- Include a sign-out button in the header, with confirmation dialog for safety.
- Error handling: Display elegant toast notifications for invalid credentials or errors (e.g., using react-hot-toast or sonner library if compatible with Next.js).

### 2. Main Layout & Navigation
- Root layout (/app/layout.tsx):
  - Persistent header: Fixed or sticky, with a clean navbar including app logo ("Todo Pro" in elegant font), user avatar/initials (if logged in), dropdown menu for profile and sign-out.
  - Use shadow-md for depth, subtle border-bottom.
  - Responsive: On mobile, collapse to hamburger menu with slide-in sidebar.
- Sidebar (optional but recommended for beauty): Left-aligned, collapsible on mobile, with links to "All Tasks", "Pending", "Completed"; use icons (e.g., from lucide-react) for visual appeal.
- Footer (optional): Minimal, with copyright or version info.
- Use Next.js metadata: Set title to "Todo App", favicon, and theme-color for PWA feel.
- Global styles: Apply smooth scrolling, anti-aliased fonts, and base Tailwind resets.

### 3. Protected Routes / Pages
- / (root): Redirect to /tasks if logged in, else to /signin (use server-side redirect for security).
- /tasks: Main todo list page.
- Use modals for create/edit instead of separate pages for a smoother, app-like experience (avoids full page reloads).

### 4. Main Tasks Page (/tasks)
UI Components:
- Header section: "My Tasks" in bold, modern heading (e.g., font-bold text-3xl), plus a prominent "Add Task" button (e.g., blue bg-primary rounded-full with plus icon).
- Filter bar: Elegant dropdown or segmented control (tabs) for "All | Pending | Completed"; include a sort dropdown (e.g., "By Date", "By Title") with chevron icon.
- Task List:
  - Display as a grid of cards on desktop (2-3 columns), stack vertically on mobile.
  - Each Task Card: Beautiful card with rounded-xl, shadow-lg, hover:scale-105 transition-transform duration-300 for interactivity.
    - Checkbox: Custom styled (e.g., green checkmark on complete).
    - Title: Bold, with line-through and gray text if completed.
    - Description: Truncated to 2-3 lines, with "..." ellipsis; clickable to expand if needed.
    - Metadata: Small text for created/updated dates, perhaps with calendar icon.
    - Actions: Edit (pencil icon), Delete (trash icon) – use tooltips on hover.
  - Empty state: Centered, beautiful illustration (e.g., empty box icon), with motivational text like "No tasks yet! Let's get productive." and prominent "Add Task" button.
- Implement subtle animations: Fade-in on load, slide-up for new tasks.

### 5. Create / Edit Task (Modal)
- Use a modern modal library like Headless UI, Radix UI, or custom with Tailwind (ensure accessibility with focus trap).
- Modal design: Overlay with blur backdrop, centered card with rounded-2xl, shadow-2xl, and close button (X icon).
- Form fields:
  - Title: Input with placeholder, required validation (show red border/error text if empty or >200 chars).
  - Description: Textarea with auto-resize, optional, max 1000 chars (character counter if space allows).
  - Submit button: "Create Task" or "Save Changes" – disabled during submission, with loading spinner.
  - Cancel button: Outline style.
- Client-side validation: Use React Hook Form or Zod for robust, real-time feedback.
- Optimistic UI: Add/update task locally before API response for snappy feel; rollback on error.
- Success: Close modal, show success toast (e.g., "Task created! 🎉").

### 6. API Client (/lib/api.ts)
- Create a typed API client using TypeScript (define interfaces for Task).
- Use fetch with base URL from env (e.g., process.env.API_URL).
- Automatically attach Authorization: Bearer <token> (get token from Better Auth session).
- Handle errors: If 401, redirect to /signin; throw custom errors for others.
- Methods (async functions):
  - getTasks(userId: string, status?: 'all'|'pending'|'completed', sort?: 'created'|'title'): Promise<Task[]>
  - createTask(userId: string, data: {title: string, description?: string}): Promise<Task>
  - getTask(userId: string, id: string): Promise<Task>
  - updateTask(userId: string, id: string, data: Partial<Task>): Promise<Task>
  - deleteTask(userId: string, id: string): Promise<void>
  - toggleComplete(userId: string, id: string): Promise<Task>
- Note: Use {user_id} from auth session in endpoints.

### 7. State Management
- Use TanStack Query (react-query) for data fetching, caching, and mutations – ideal for beautiful, reactive UI (automatic refetch on mutate).
- Fallback: React Context with useReducer for tasks state.

### 8. Styling & Design System
- Tailwind CSS only: No inline styles or custom CSS files unless absolutely necessary.
- Color scheme: Professional and beautiful – primary: blue-600 (buttons), success: green-500 (completed), error: red-500, neutral: gray-50 to gray-900.
- Typography: Use sans-serif font (e.g., Inter or system), with weights for hierarchy (light for body, bold for titles).
- Spacing: Consistent (p-6 for cards, space-y-4 for forms).
- Transitions: Apply to hovers, modals (fade-in/out), task additions (scale-up).
- Dark mode: Implement using next-themes – auto-detect system preference, toggle in header.
- Responsiveness: Use Tailwind breakpoints (sm:, md:, lg:) – ensure no overflows, stack elements on small screens.

### 9. UX / Polish Requirements
- Loading states: Beautiful skeletons (e.g., gray pulsing placeholders for cards) using react-loading-skeleton or custom.
- Error handling: Global toast system for API errors, auth issues (position: top-right, auto-dismiss).
- Success feedback: Confetti animation on first task create (optional, using party.js if compatible).
- Confirmations: Sweet alert or modal for delete (e.g., "Are you sure? This can't be undone.").
- Accessibility: ARIA labels on icons/buttons, keyboard-navigable (tab focus with outlines), screen-reader friendly.
- Performance: Use Next.js Image for any assets, lazy-load offscreen elements.
- Edge cases: Handle no internet (offline toast), long titles (truncate with tooltip), many tasks (virtualized list if >50).

### 10. Folder Structure (Suggested – Ensure Clean Organization)
app/
├── layout.tsx
├── page.tsx               # Root redirect
├── signin/page.tsx
├── signup/page.tsx
├── tasks/
│   ├── layout.tsx         # Optional sub-layout
│   └── page.tsx           # Task list
components/
├── ui/                    # Reusable primitives (button, input, modal from shadcn/ui if allowed, else custom)
├── Header.tsx
├── Sidebar.tsx            # If used
├── TaskCard.tsx
├── TaskList.tsx
├── TaskModal.tsx          # For create/edit
├── EmptyState.tsx
├── ToastProvider.tsx
lib/
├── api.ts                 # API client
├── auth.ts                # Better Auth hooks
├── queries.ts             # TanStack Query hooks
types/
└── index.ts               # Task, User types

## Acceptance Criteria
- Visual beauty: UI looks professional, modern, and engaging – passes design review (clean, no clutter, balanced whitespace).
- Functionality: Full auth flow works; tasks CRUD with user isolation; filters/sorts apply correctly.
- Responsiveness: Flawless on mobile (no horizontal scrolls, touch-friendly).
- No errors: Console clean; handles invalid inputs gracefully; no crashes on edge cases.
- Performance: Loads fast, smooth interactions.
- Security: JWT always sent; no data leaks.

## References
@specs/features/task-crud.md
@specs/features/authentication.md
@specs/api/rest-endpoints.md
@specs/ui/components.md          (if exists)
@frontend/CLAUDE.md

Implement the complete frontend following modern Next.js + Tailwind best practices. Use server components by default, client components only for interactivity (e.g., modals, forms). Prioritize clean, typed code, exceptional UI beauty, and flawless user experience. Test thoroughly for no bugs or visual glitches.
```

## Response snapshot

Created comprehensive feature specification for Complete Responsive Frontend Implementation with Beautiful UI. The specification includes:

1. Three user stories covering core functionality (P1: Authentication and task management, P2: Interactive task management, P3: Filtering and sorting)
2. 14 functional requirements covering authentication, task operations, UI/UX, and accessibility
3. Key entities: User, Task, and Session
4. 8 measurable success criteria with specific performance and usability metrics
5. Edge cases for error handling and security considerations

The specification follows the template structure and is technology-agnostic, focusing on user value and business needs rather than implementation details. A quality checklist was created and all validation criteria passed.

## Outcome

- ✅ Impact: Complete feature specification created with user stories, requirements, and success criteria
- 🧪 Tests: none
- 📁 Files: Created specs/001-frontend-auth-ui/spec.md and specs/001-frontend-auth-ui/checklists/requirements.md
- 🔁 Next prompts: Ready for /sp.plan to generate implementation plan
- 🧠 Reflection: Specification successfully abstracts implementation details while maintaining clear user-focused requirements.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - All required specification sections completed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.plan to create implementation plan