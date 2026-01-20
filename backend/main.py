from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tasks
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware to allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Alternative Next.js port
        "http://localhost:8005",  # Backend server (for testing)
        "http://localhost:8000",  # Alternative backend port
        "http://127.0.0.1:3000",  # Alternative localhost format
        "http://127.0.0.1:3001",  # Alternative localhost format
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

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

# Initialize DB when app starts
init_database()
# --- END DATABASE INITIALIZATION ---

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)  # Changed to port 8005 to match frontend config













# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routes import tasks
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# app = FastAPI(title="Todo API", version="1.0.0")

# # Add CORS middleware to allow frontend origins
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",  # Next.js dev server
#         "http://localhost:3001",  # Alternative Next.js port
#         "http://localhost:8005",  # Backend server (for testing)
#         "http://localhost:8000",  # Alternative backend port
#         "http://127.0.0.1:3000",  # Alternative localhost format
#         "http://127.0.0.1:3001",  # Alternative localhost format
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include task routes
# app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

# @app.get("/")
# def read_root():
#     return {"message": "Todo API is running!"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)