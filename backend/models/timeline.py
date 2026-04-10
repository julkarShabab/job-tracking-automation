from pydantic import BaseModel
from typing import Optional
from datetime import date as Date

class TimelineCreate(BaseModel):
    job_id:str
    stage:str
    date: Optional[Date] = None
    notes:Optional[str] = None