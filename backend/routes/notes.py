from fastapi import APIRouter,HTTPException
from db.database import supabase
from models.note import NoteCreate,NoteUpdate

router = APIRouter()

@router.get("/{job_id}")
def get_notes_for_job(job_id:str):
    response = supabase.table("notes").select("*").eq("job_id",job_id).execute()
    return response.data

@router.post("/")
def create_note(note: NoteCreate):
    note_data = note.model_dump()
    response = supabase.table("notes").insert(note_data).execute()
    return response.data

@router.put("/{note_id}")
def update_note(note_id:str,note: NoteUpdate):
    update_data = note.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400,detail="no data provided")
    
    response = supabase.table("jobs").update(update_data).eq("id",note_id).execute()

    if not response.data:
        raise HTTPException(status_code=404,detail="note not found")
    return response.data[0]


@router.delete("/{note_id}")
def delete_note(note_id:str):
    response = supabase.table("notes").delete().eq("id",note_id).execute()

    if not response.data:
        raise HTTPException(status_code=404,detail="note not found")
    
    return{"message":"note deleted successfully"}