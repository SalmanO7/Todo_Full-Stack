# Data Model: Todo Backend

## Entities

### User
Represents a user in the system, created and managed by Better Auth.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | str | Primary Key | Unique user identifier from Better Auth |
| email | str | Unique, Not Null | User's email address |
| name | str | Nullable | User's display name |
| created_at | datetime | Default: now() | Timestamp when user was created |

### Task
Represents a task belonging to a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | Primary Key, Auto-increment | Unique task identifier |
| user_id | str | Foreign Key, Not Null | Reference to owning user |
| title | str | Not Null, Max 200 chars | Task title |
| description | str | Nullable, Max 1000 chars | Optional task description |
| completed | bool | Default: False | Completion status |
| created_at | datetime | Default: now() | Timestamp when task was created |
| updated_at | datetime | Default: now() | Timestamp when task was last updated |

## Relationships

### User → Task
- One-to-Many relationship
- User can own multiple tasks
- Task belongs to exactly one user
- Foreign key constraint ensures referential integrity

## Indexes

### Task Table
- `idx_task_user_id`: Index on user_id field for efficient filtering
- `idx_task_completed`: Index on completed field for efficient status queries
- Primary key index on id field

## Validation Rules

### User
- Email must be unique across all users
- Email format validated by application layer
- Name is optional and can be null

### Task
- Title is required and must be 1-200 characters
- Description is optional and max 1000 characters
- User_id must reference an existing user
- Completed defaults to false
- created_at and updated_at are automatically managed

## State Transitions

### Task Completion
- `completed = false` → `completed = true` (when marked complete)
- `completed = true` → `completed = false` (when marked incomplete)
- updated_at timestamp updated on any change

## Data Integrity

### Constraints
- Foreign key constraint ensures task.user_id references valid user
- Not-null constraints on required fields
- Length constraints on string fields
- Automatic timestamp management

### Cascade Behavior
- No cascade deletes (user deletion doesn't remove tasks)
- Manual cleanup required if user accounts are deleted