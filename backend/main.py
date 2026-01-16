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
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)