# Todo API Backend

This is the backend service for the Todo application, built with FastAPI and PostgreSQL.

## Features

- Secure JWT authentication with Better Auth integration
- User isolation - users can only access their own tasks
- Full CRUD operations for tasks
- Filtering and sorting capabilities
- RESTful API design

## Tech Stack

- FastAPI - Web framework
- SQLModel - ORM for database operations
- PostgreSQL - Database (Neon Serverless)
- python-jose - JWT token handling
- uvicorn - ASGI server

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=your_secret_here
   API_BASE_URL=http://localhost:8000
   ```

3. Initialize the database:
   ```bash
   python init_db.py
   ```

4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

Or use the automated script:
```bash
python start_server.py
```

## API Endpoints

All endpoints follow the pattern: `/api/{user_id}/{endpoint}`

- `GET /tasks` - Get all tasks for user (with status and sort query params)
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `PATCH /tasks/{id}/complete` - Toggle task completion

## Security

- JWT token verification on all endpoints
- User ID validation to ensure data isolation
- Proper error handling with appropriate HTTP status codes

## Integration

This backend is designed to work with the frontend at http://localhost:3000 and integrates with Better Auth for user management.