from fastapi import APIRouter,HTTPException
from db.database import supabase
from models.job import JobCreate,JobUpdate

router = APIRouter()

@router.get("/")
def get_all_jobs():
    response = supabase.table("jobs").select("*").execute()
    return response.data

@router.get("/{job_id}")
def get_job(job_id: str):
    response = supabase.table("jobs").select("*").eq("id",job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404,detail="job not found")
    
    return response.data[0]

@router.post("/")
def create_job(job: JobCreate):
    job_data = job.model_dump(exclude_none=True)
    response = supabase.table("jobs").insert(job_data).execute()
    return response.data[0]

@router.put("/{job_id}")
def update_job(job_id:str,job: JobUpdate):
    update_data = job.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="no data provided to update")
    
    response = supabase.table("jobs").update(update_data).eq("id",job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404,detail="job not found")
    return response.data[0]

@router.delete("/{job_id}")
def delete_job(job_id:str):
    response = supabase.table("jobs").delete().eq("id",job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404,detail="job not found")
    
    return {"message": "Job deleted successfully"}

