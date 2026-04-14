from fastapi import APIRouter, HTTPException
from db.database import supabase
from models.job import JobCreate, JobUpdate,FlagJob

router = APIRouter()

# Helper function to convert date objects to strings
def serialize_data(data: dict):
    serialized = {}
    for key, value in data.items():
        if hasattr(value, 'isoformat'):  # Checks if it's a date or datetime
            serialized[key] = value.isoformat()  # Converts date to "2026-04-09"
        else:
            serialized[key] = value
    return serialized

@router.get("/")
def get_all_jobs():
    response = supabase.table("jobs").select("*").execute()
    return response.data

@router.get("/{job_id}")
def get_job(job_id: str):
    response = supabase.table("jobs").select("*").eq("id", job_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return response.data[0]

@router.post("/")
def create_job(job: JobCreate):
    job_data = serialize_data(job.model_dump(exclude_none=True))
    if 'status' not in job_data:
        job_data['status'] = 'will_apply'
    response = supabase.table("jobs").insert(job_data).execute()
    return response.data[0]

@router.put("/{job_id}")
def update_job(job_id: str, job: JobUpdate):
    try:
        update_data = serialize_data(job.model_dump(exclude_none=True))
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided")
        
        response = supabase.table("jobs").update(update_data).eq("id", job_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return response.data[0]
    
    except Exception as e:
        print(f"Update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{job_id}")
def delete_job(job_id: str):
    response = supabase.table("jobs").delete().eq("id", job_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}


@router.patch("/{job_id}/flag")
def flag_job(job_id:str,flag_data:FlagJob):
    response = supabase.table("jobs").update({
        "is_flagged": flag_data.is_flagged,
        "flagged_analysis": flag_data.flagged_analysis,
        "flagged_match": flag_data.flagged_match
    }).eq("id",job_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404,detail="job not found")
    return response.data[0]

@router.get("/flagged/all")
def get_flagged_jobs():
    response = supabase.table("jobs").select("*").eq("is_flagged",True).execute()
    return response.data