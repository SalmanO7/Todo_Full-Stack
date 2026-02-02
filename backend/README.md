# Todo API Backend - Hugging Face Deployment

This is the backend service for the Todo application, built with FastAPI and PostgreSQL, optimized for deployment on Hugging Face Spaces.

## Features

- Secure JWT authentication with Better Auth integration
- User isolation - users can only access their own tasks
- Full CRUD operations for tasks
- Filtering and sorting capabilities
- RESTful API design
- Optimized for Hugging Face Spaces deployment

## Tech Stack

- FastAPI - Web framework
- SQLModel - ORM for database operations
- PostgreSQL - Database (Neon Serverless)
- python-jose - JWT token handling
- uvicorn - ASGI server

## Hugging Face Spaces Deployment

### Using Docker

1. Make sure your `Dockerfile` is properly configured (included in this repo)
2. Add your environment variables in the Hugging Face Spaces settings
3. The application will run on port 8000 by default

### Environment Variables for Production

For Hugging Face deployment, set these environment variables in the Space settings:

```env
ENVIRONMENT=production
BETTER_AUTH_SECRET=your_better_auth_secret_here
DATABASE_URL=postgresql://username:password@host:port/database_name
CUSTOM_FRONTEND_URL=https://full-stack-todo-app-psi-sand.vercel.app
```

### Configuration for Better Auth Integration

For proper Better Auth integration with your frontend at `https://full-stack-todo-app-psi-sand.vercel.app`:

1. In your frontend (Vercel deployment), set these environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-hf-space-name.hf.space
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-hf-space-name.hf.space
   ```

2. The backend automatically configures CORS to allow your frontend URL when `CUSTOM_FRONTEND_URL` is set

## Local Development Setup

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
- Production-ready CORS configuration for your deployed frontend

## Health Check

Use the `/health` endpoint to verify the application status in production.

## Integration

This backend is designed to work with the frontend deployed at https://full-stack-todo-app-psi-sand.vercel.app and integrates with Better Auth for user management.