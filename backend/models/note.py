from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    job_id:str
    content:str

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    