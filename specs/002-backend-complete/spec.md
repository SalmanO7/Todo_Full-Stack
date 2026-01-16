# Feature: Complete Secure Backend Implementation with Database Integration

@phase phase2-web
@depends authentication, task-crud

## Overview
Implement the full secure, performant backend for the multi-user Todo application using FastAPI, integrated seamlessly with the frontend (Next.js) via RESTful API endpoints and JWT authentication. The backend must handle persistent storage in Neon Serverless PostgreSQL, enforce user isolation, and verify JWT tokens issued by Better Auth on the frontend.

The backend must:
- Connect to Neon PostgreSQL using SQLModel for ORM operations.
- Implement all specified RESTful API endpoints, filtering data by authenticated user.
- Verify JWT tokens on every request, extracting user information and enforcing ownership.
- Handle errors gracefully with proper HTTP status codes and messages.
- Integrate with the frontend by assuming API calls include Bearer tokens and use the shared BETTER_AUTH_SECRET for verification.
- Ensure full compatibility: Frontend at http://localhost:3000 calls backend at http://localhost:8000 (or env-defined), with shared DB for users and tasks.

## User Stories

### P1 - User can manage their tasks securely
As an authenticated user, I want to be able to create, read, update, and delete my own tasks so that I can manage my personal tasks securely with proper isolation from other users.

**Acceptance Criteria:**
- User can create a new task with title and optional description
- User can retrieve their own tasks with filtering (all/pending/completed) and sorting (created/title)
- User can update an existing task (title, description, completion status)
- User can delete a task they own
- User can toggle task completion status
- User cannot access tasks belonging to other users
- All operations require valid JWT authentication

### P2 - System ensures secure authentication and authorization
As a system administrator, I want to ensure that all API requests are properly authenticated and authorized so that users can only access their own data.

**Acceptance Criteria:**
- All API endpoints require valid JWT token in Authorization header
- JWT tokens are verified using the shared BETTER_AUTH_SECRET
- User ID in URL path must match the user ID in the JWT token
- Invalid or missing tokens return 401 Unauthorized
- Mismatched user IDs return 403 Forbidden
- Proper error messages are returned for authentication failures

### P3 - System provides reliable database operations
As a developer, I want the system to provide reliable database operations with proper error handling so that the application is robust and resilient.

**Acceptance Criteria:**
- Database connections are established successfully to Neon PostgreSQL
- Tables are created on application startup if they don't exist
- Proper validation is applied to all inputs (title length, etc.)
- Transactions are handled properly to maintain data integrity
- Appropriate error responses are returned for database errors

## Success Criteria
- Database connects successfully to Neon URL; tables created on startup.
- JWT verification works: Invalid token → 401; mismatch user_id → 403.
- All endpoints functional: CRUD operations persist in DB, filtered by user.
- Integration: Frontend can signup (via Better Auth, populates users table), then CRUD tasks via API with token.
- Security: No unauthorized access; data isolated per user.
- Performance: Queries efficient with indexes; no N+1 issues.
- No errors: Handle edge cases (e.g., non-existent task → 404).