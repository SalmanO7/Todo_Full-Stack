---
description: "Task list template for feature implementation"
---

# Tasks: Complete Responsive Frontend Implementation with Beautiful UI

**Input**: Design documents from `/specs/001-frontend-auth-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in frontend/
- [X] T002 Initialize Next.js 14+ project with TypeScript dependencies
- [X] T003 [P] Configure Tailwind CSS with custom colors and typography settings
- [X] T004 [P] Configure ESLint and Prettier with Next.js recommended settings
- [X] T005 Set up tsconfig.json with proper module resolution

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Install and configure Better Auth client with JWT plugin
- [ ] T007 [P] Install TanStack Query and configure QueryClientProvider
- [ ] T008 [P] Install and configure Next Themes for dark/light mode
- [X] T009 Create base types in frontend/types/index.ts for User, Task, and Session
- [ ] T010 Configure error handling and global notification system with Sonner
- [ ] T011 Set up environment configuration management for API URLs

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authenticate and Manage Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to securely sign up, sign in, and create/view their personal tasks through an aesthetically pleasing interface

**Independent Test**: Can be fully tested by registering a new account, logging in, creating tasks, viewing them, and logging out successfully. This delivers the fundamental value proposition of a personalized task management system.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [ ] T012 [P] [US1] Contract test for authentication endpoints in tests/contract/test_auth.py
- [ ] T013 [P] [US1] Integration test for user registration flow in tests/integration/test_auth_flow.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Create User type in frontend/types/index.ts
- [X] T015 [P] [US1] Create Task type in frontend/types/index.ts
- [X] T016 [P] [US1] Create Session type in frontend/types/index.ts
- [X] T017 [US1] Create API client in frontend/lib/api.ts with JWT token attachment
- [X] T018 [US1] Create authentication utilities in frontend/lib/auth.ts
- [X] T019 [US1] Create TanStack Query hooks for tasks in frontend/lib/queries.ts
- [X] T020 [US1] Create root layout in frontend/app/layout.tsx with Header component
- [X] T021 [US1] Create root page in frontend/app/page.tsx with auth redirect logic
- [X] T022 [US1] Create Header component in frontend/components/Header.tsx
- [X] T023 [P] [US1] Create basic UI components in frontend/components/ui/ (Button, Input, Card)
- [X] T024 [US1] Create signin page in frontend/app/signin/page.tsx
- [X] T025 [US1] Create signup page in frontend/app/signup/page.tsx
- [X] T026 [US1] Create tasks layout in frontend/app/tasks/layout.tsx
- [X] T027 [US1] Create tasks page in frontend/app/tasks/page.tsx
- [X] T028 [US1] Create EmptyState component in frontend/components/EmptyState.tsx
- [X] T029 [US1] Create TaskList component in frontend/components/TaskList.tsx
- [X] T030 [US1] Create TaskCard component in frontend/components/TaskCard.tsx
- [X] T031 [US1] Add protected route logic to prevent unauthenticated access
- [ ] T032 [US1] Add validation and error handling for authentication forms
- [ ] T033 [US1] Add loading states and user feedback mechanisms

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Interactive Task Management (Priority: P2)

**Goal**: Enable users to interact with their tasks by editing, deleting, and marking them as complete with a smooth, visually appealing experience

**Independent Test**: Can be tested by performing all task manipulation operations (create, update, delete, toggle completion) and verifying the UI responds appropriately with visual feedback.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T034 [P] [US2] Contract test for task modification endpoints in tests/contract/test_tasks_mod.py
- [ ] T035 [P] [US2] Integration test for task manipulation flow in tests/integration/test_task_ops.py

### Implementation for User Story 2

- [ ] T036 [P] [US2] Update Task type in frontend/types/index.ts with additional fields if needed
- [X] T037 [US2] Enhance API client in frontend/lib/api.ts with update/delete/toggle methods
- [X] T038 [US2] Enhance TanStack Query hooks in frontend/lib/queries.ts with mutation support
- [X] T039 [US2] Create TaskModal component in frontend/components/TaskModal.tsx
- [X] T040 [US2] Create ConfirmDialog component in frontend/components/ConfirmDialog.tsx
- [X] T041 [US2] Add edit functionality to TaskCard component in frontend/components/TaskCard.tsx
- [X] T042 [US2] Add delete functionality with confirmation to TaskCard component
- [X] T043 [US2] Add optimistic updates to task operations
- [X] T044 [US2] Implement toast notifications for CRUD success/error
- [X] T045 [US2] Add optimistic UI for task completion toggling
- [X] T046 [US2] Add form validation with React Hook Form and Zod in TaskModal

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Filter and Sort Tasks (Priority: P3)

**Goal**: Enable users to organize and find their tasks efficiently through filtering and sorting capabilities

**Independent Test**: Can be tested by applying different filter and sort combinations and verifying the task list updates accordingly.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T047 [P] [US3] Contract test for task filtering/sorting endpoints in tests/contract/test_filters.py
- [ ] T048 [P] [US3] Integration test for filtering and sorting functionality in tests/integration/test_filters.py

### Implementation for User Story 3

- [X] T049 [P] [US3] Enhance API client in frontend/lib/api.ts with filter/sort parameters
- [X] T050 [US3] Update TanStack Query hooks in frontend/lib/queries.ts with filter/sort support
- [X] T051 [US3] Create FilterBar component in frontend/components/FilterBar.tsx
- [X] T052 [US3] Update TaskList component to accept filter/sort props
- [X] T053 [US3] Implement client-side filtering and sorting in TaskList
- [X] T054 [US3] Add query parameter integration for filter/sort persistence

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T055 [P] Add loading skeletons to TaskList in frontend/components/TaskList.tsx
- [ ] T056 [P] Enhance animations with CSS transitions in components
- [X] T057 Add dark mode toggle to Header component in frontend/components/Header.tsx
- [ ] T058 [P] Add tooltips to icons in TaskCard and other components
- [ ] T059 Add character counter to description textarea in TaskModal
- [ ] T060 [P] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T061 [P] Optimize responsive design across all components
- [ ] T062 Add performance optimizations (memoization, lazy loading)
- [ ] T063 Run quickstart.md validation checklist
- [ ] T064 Update README.md with frontend run instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds upon US1 functionality
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds upon US1/US2 functionality

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for authentication endpoints in tests/contract/test_auth.py"
Task: "Integration test for user registration flow in tests/integration/test_auth_flow.py"

# Launch all models for User Story 1 together:
Task: "Create User type in frontend/types/index.ts"
Task: "Create Task type in frontend/types/index.ts"
Task: "Create Session type in frontend/types/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence