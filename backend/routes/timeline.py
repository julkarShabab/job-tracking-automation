from fastapi import APIRouter,HTTPException
from db.database import supabase
from models.timeline import TimelineCreate

router = APIRouter()

@router.get("/{job_id}")
def get_timeline(job_id:str):
    response = supabase.table("timeline").select("*").eq("job_id",job_id).order("date").execute()
    return response.data


@router.post("/")
def create_timeline(entry: TimelineCreate):
    data = entry.model_dump(exclude_none=True)
    if 'date' in data and hasattr(data['date'],'isoformat'):
        data['date'] = data['date'].isoformat()
    
    response = supabase.table("timeline").insert(data).execute()
    return response.data

@router.delete("/{entry_id}")
def delete_timeline(entry_id: str):
    response = supabase.table("timeline").delete().eq("id",entry_id).execute()
    if not response.data:
        raise HTTPException(status_code=404,detail="entry not found")
    return{"message":"entry deleted"}
