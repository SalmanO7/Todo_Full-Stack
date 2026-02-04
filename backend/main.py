from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tasks
from routes import auth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure allowed origins based on environment
def get_allowed_origins():
    environment = os.getenv("ENVIRONMENT", "development")
    if environment == "production":
        # For production deployment, allow the deployed frontend URL
        origins = [
            "https://full-stack-todo-app-psi-sand.vercel.app",  # Deployed frontend
            "https://huggingface.co",  # Hugging Face main domain (if deployed there)
            "https://*.hf.space",      # Hugging Face Spaces subdomains
        ]

        # Add any custom frontend URLs from environment
        custom_frontend_url = os.getenv("CUSTOM_FRONTEND_URL")
        if custom_frontend_url:
            origins.append(custom_frontend_url)

        return origins
    else:
        # Development origins
        return [
            "http://localhost:3000",  # Next.js dev server
            "http://localhost:3001",  # Alternative Next.js port
            "http://localhost:8005",  # Backend server (for testing)
            "http://localhost:8000",  # Alternative backend port
            "http://127.0.0.1:3000",  # Alternative localhost format
            "http://127.0.0.1:3001",  # Alternative localhost format
            "http://localhost:7860",  # Common Hugging Face Space port
            "https://huggingface.co",  # Hugging Face main domain
            "https://*.hf.space",      # Hugging Face Spaces subdomains
            "https://full-stack-todo-app-psi-sand.vercel.app",  # Deployed frontend
        ]

app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="Full-stack Todo Application API with user authentication and task management"
)

# Add CORS middleware to allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth and task routes
app.include_router(auth.router, tags=["auth"])
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!", "environment": os.getenv("ENVIRONMENT", "development")}

# --- DATABASE INITIALIZATION ---
def init_database():
    """Initialize database and create/update tables if not already created"""
    try:
        import importlib.util
        from sqlmodel import SQLModel
        from models import User, Task
        from db import engine

        # Create all tables based on models
        SQLModel.metadata.create_all(engine)
        print("Database initialized successfully!")

        # For production, also ensure the hashed_password column exists
        import sqlalchemy as sa
        from sqlalchemy import text

        with engine.connect() as conn:
            # Check database dialect
            dialect = engine.dialect.name

            column_exists = False
            if dialect == 'postgresql':
                # PostgreSQL query
                result = conn.execute(text("""
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = 'users' AND column_name = 'hashed_password'
                """))
                column_exists = result.fetchone() is not None
            else:
                # SQLite query
                result = conn.execute(text("PRAGMA table_info(users)"))
                columns = [row[1] for row in result.fetchall()]
                column_exists = 'hashed_password' in columns

            if not column_exists:
                print("Adding missing hashed_password column to users table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255) NOT NULL DEFAULT ''"))
                conn.commit()
                print("hashed_password column added successfully!")

    except Exception as e:
        print(f"Database initialization failed: {e}")
        # In production environments, we might want to handle this differently
        if os.getenv("ENVIRONMENT") == "production":
            print("Critical: Database initialization failed in production!")

# Initialize DB when app starts
init_database()
# --- END DATABASE INITIALIZATION ---

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": os.getenv("ENVIRONMENT", "development")}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7860))  # Hugging Face uses PORT environment variable
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=(os.getenv("ENVIRONMENT") == "development"))