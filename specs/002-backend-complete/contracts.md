# API Contracts: Todo Backend

## Overview
REST API for Todo application with JWT-based authentication and user isolation.

## Base URL
`http://localhost:8000` (development)
`https://api.yourdomain.com` (production)

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

## Error Format
All errors follow this structure:
```json
{
  "detail": "Error message"
}
```

## Endpoints

### Tasks

#### GET /api/{user_id}/tasks
Retrieve all tasks for a user with optional filtering and sorting.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)
- `status` (query, optional): "all", "pending", "completed" (default: "all")
- `sort` (query, optional): "created", "title" (default: "created")

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- `200 OK`: Array of Task objects
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Sample task",
    "description": "Task description",
    "completed": false,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z"
  }
]
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject

#### POST /api/{user_id}/tasks
Create a new task for a user.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "New task title",
  "description": "Optional description"
}
```

**Response:**
- `201 Created`: Created Task object
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "New task title",
  "description": "Optional description",
  "completed": false,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject

#### GET /api/{user_id}/tasks/{id}
Retrieve a specific task.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)
- `id` (path): Task ID

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- `200 OK`: Task object
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Sample task",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject or task doesn't belong to user
- `404 Not Found`: Task not found

#### PUT /api/{user_id}/tasks/{id}
Update a task completely.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)
- `id` (path): Task ID

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Response:**
- `200 OK`: Updated Task object
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T11:00:00Z"
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject or task doesn't belong to user
- `404 Not Found`: Task not found

#### DELETE /api/{user_id}/tasks/{id}
Delete a task.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)
- `id` (path): Task ID

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- `204 No Content`: Task successfully deleted

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject or task doesn't belong to user
- `404 Not Found`: Task not found

#### PATCH /api/{user_id}/tasks/{id}/complete
Toggle a task's completion status.

**Parameters:**
- `user_id` (path): User ID (must match JWT subject)
- `id` (path): Task ID

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- `200 OK`: Updated Task object
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Sample task",
  "description": "Task description",
  "completed": true,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T11:00:00Z"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: user_id doesn't match JWT subject or task doesn't belong to user
- `404 Not Found`: Task not found

## Validation Rules

### Input Validation
- `title` (POST, PUT): Required, 1-200 characters
- `description` (POST, PUT): Optional, 0-1000 characters
- `completed` (PUT, PATCH): Boolean value
- `user_id` (path): Must match JWT subject
- `id` (path): Integer value

### Authentication Validation
- JWT token must be valid and not expired
- JWT subject must match the user_id in the path
- Token must be provided in Authorization header

### Authorization Validation
- Users can only access their own tasks
- All operations require valid authentication
- Invalid user_id/token combinations return 403 Forbidden

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 422 | Unprocessable Entity - Validation error (FastAPI auto-generated) |