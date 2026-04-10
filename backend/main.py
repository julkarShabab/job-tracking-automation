from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs, notes, analytics, timeline  # add timeline here

app = FastAPI()

@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["Timeline"])  # add this

@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}