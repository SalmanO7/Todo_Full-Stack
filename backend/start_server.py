import subprocess
import sys
import os

def install_dependencies():
    """Install required Python packages"""
    print("Installing dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def init_database():
    """Initialize the database and create tables"""
    print("Initializing database...")
    import importlib.util
    spec = importlib.util.spec_from_file_location("init_db", "init_db.py")
    init_db = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(init_db)
    init_db.create_tables()

def start_server():
    """Start the FastAPI server"""
    print("Starting server on http://localhost:8000...")
    subprocess.check_call(["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

if __name__ == "__main__":
    print("Setting up Todo API backend...")

    # Install dependencies
    install_dependencies()

    # Initialize database
    init_database()

    # Start the server
    start_server()