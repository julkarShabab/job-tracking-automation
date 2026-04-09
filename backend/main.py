from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs,notes,analytics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message":"job tracker API is running"}