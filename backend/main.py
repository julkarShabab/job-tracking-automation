from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs,notes,analytics

app = FastAPI(
    title="job tracker API",
    description="backend for the job tracker app",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message":"job tracker API is running"}