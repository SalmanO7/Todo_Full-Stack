# Data Model: Complete Beautiful & Responsive Frontend Implementation

## Entity Definitions

### User
Represents an authenticated user with unique identity, authentication credentials, and personal preferences.

**Fields**:
- `id`: string - Unique identifier for the user
- `email`: string - Email address used for authentication
- `name`: string - User's display name
- `createdAt`: string (ISO date) - Timestamp when user account was created
- `updatedAt`: string (ISO date) - Timestamp when user account was last updated

**Validation**:
- Email must be a valid email format
- Name must be 1-100 characters
- ID must be unique

### Task
Represents a user's task with properties including title (required, 1-200 chars), description (optional, max 1000 chars), completion status, creation timestamp, and update timestamp.

**Fields**:
- `id`: string - Unique identifier for the task
- `userId`: string - Foreign key linking to the user who owns this task
- `title`: string - Task title (required, 1-200 characters)
- `description`: string (optional) - Detailed task description (max 1000 characters)
- `completed`: boolean - Whether the task is marked as complete
- `createdAt`: string (ISO date) - Timestamp when task was created
- `updatedAt`: string (ISO date) - Timestamp when task was last updated

**Validation**:
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- UserId must reference an existing user
- Completed defaults to false

### Session
Represents an authenticated user session with JWT token for secure API communication.

**Fields**:
- `token`: string - JWT token for API authentication
- `expiresAt`: string (ISO date) - Expiration timestamp for the token
- `userId`: string - Reference to the authenticated user
- `createdAt`: string (ISO date) - Timestamp when session was created

**Validation**:
- Token must be a valid JWT format
- ExpiresAt must be in the future
- UserId must reference an existing user

## Relationships

- **User → Task**: One-to-many (one user can have many tasks)
- **User → Session**: One-to-one (one user has one active session at a time)

## State Transitions

### Task State Transitions
- **Active** → **Completed**: When user marks task as complete
- **Completed** → **Active**: When user unmarks task as complete

### Session State Transitions
- **Authenticated** → **Unauthenticated**: When user logs out or token expires
- **Unauthenticated** → **Authenticated**: When user successfully logs in

## Business Rules

1. **User Isolation**: Users can only access their own tasks (filtered by userId)
2. **Data Integrity**: Tasks must have a valid associated user
3. **Security**: All API requests must include a valid session token
4. **Validation**: All data must pass validation before being accepted
5. **Immutability**: User and task IDs cannot be changed after creation