"""
Application entry point for Hugging Face Spaces deployment.
This file serves as the main entry point for the FastAPI application when deployed on Hugging Face Spaces.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tasks
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
            "https://huggingface.co",  # Hugging Face main domain
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
    # Allow credentials for authentication
    allow_credentials=True,
)

# Include task routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!", "environment": os.getenv("ENVIRONMENT", "development")}

# --- DATABASE INITIALIZATION ---
def init_database():
    """Initialize database and create tables if not already created"""
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("init_db", "init_db.py")
        init_db = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(init_db)
        init_db.create_tables()
        print("Database initialized successfully!")
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


# This is important for Hugging Face Spaces
# The app instance should be named 'app' for Hugging Face to pick it up
# When running on Hugging Face Spaces, it will automatically use the 'app' object
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Hugging Face uses PORT environment variable
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=(os.getenv("ENVIRONMENT") == "development"))