# Quickstart Guide: Todo Backend

## Prerequisites
- Python 3.9+
- PostgreSQL access (Neon Serverless in production)
- Better Auth configured for frontend

## Setup

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create `.env` file with:
```
DATABASE_URL=postgresql://neondb_owner:npg_1DSbphLfr8kU@ep-bold-dew-a7lnppzl-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
BETTER_AUTH_SECRET=G8P173a4T0HV3dBfnNBbyFg1uvcmeWQF
API_BASE_URL=http://localhost:8000
```

### 4. Initialize Database
```bash
python init_db.py
```

### 5. Start Server
```bash
uvicorn main:app --reload --port 8000
```

Server will start at `http://localhost:8000`

## API Usage

### Getting Started
1. Register/login via frontend to get JWT token
2. Use token in Authorization header for all API calls
3. Replace `{user_id}` with your actual user ID from the token

### Example Requests

#### List User's Tasks
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8000/api/YOUR_USER_ID/tasks"
```

#### Create New Task
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title": "New Task", "description": "Task description"}' \
     "http://localhost:8000/api/YOUR_USER_ID/tasks"
```

#### Update Task
```bash
curl -X PUT \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title": "Updated Title", "completed": true}' \
     "http://localhost:8000/api/YOUR_USER_ID/tasks/1"
```

#### Toggle Task Completion
```bash
curl -X PATCH \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8000/api/YOUR_USER_ID/tasks/1/complete"
```

#### Delete Task
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8000/api/YOUR_USER_ID/tasks/1"
```

## Integration with Frontend

### Frontend Configuration
The backend expects:
- Authorization header: `Bearer {token}`
- API calls to `/api/{user_id}/...`
- JSON request/response bodies

### Authentication Flow
1. Frontend authenticates user with Better Auth
2. Frontend extracts JWT token from session
3. Frontend makes API calls with Authorization header
4. Backend validates token and user_id match

## Testing

### Health Check
```bash
curl http://localhost:8000/
```

### Authentication Test
```bash
# Should return 401 without token
curl http://localhost:8000/api/user123/tasks

# Should return 403 with invalid user_id
curl -H "Authorization: Bearer VALID_TOKEN" \
     http://localhost:8000/api/WRONG_USER_ID/tasks
```

## Troubleshooting

### Common Issues

#### Database Connection
- Verify DATABASE_URL is correct
- Check network connectivity to Neon
- Ensure SSL requirements are met

#### Authentication Problems
- Confirm BETTER_AUTH_SECRET matches frontend
- Verify JWT token format: `Bearer <token>`
- Check that user_id in URL matches JWT subject

#### CORS Issues
- Ensure frontend domain is in CORS configuration
- Default allows `http://localhost:3000`

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://...` |
| BETTER_AUTH_SECRET | JWT verification secret | `G8P173a4T0HV3dBfnNBbyFg1uvcmeWQF` |
| API_BASE_URL | Backend service URL | `http://localhost:8000` |

## Security Notes

### JWT Token Handling
- Tokens are validated using HS256 algorithm
- User isolation enforced by comparing JWT subject to URL user_id
- No session storage required

### Input Validation
- All string inputs are validated for length
- Numeric inputs validated for type
- Path parameters validated for format

## Production Deployment

### Environment Configuration
- Use secure DATABASE_URL with SSL
- Set strong BETTER_AUTH_SECRET
- Configure proper domain in CORS settings

### Performance Tuning
- Enable connection pooling
- Use reverse proxy (nginx, Apache)
- Configure appropriate worker processes