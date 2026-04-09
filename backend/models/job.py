from pydantic import BaseModel
from typing import Optional
from datetime import date

class JobCreate(BaseModel):
    company: str
    role: str
    link : Optional[str] = None
    description : Optional[str] = None
    status: Optional[str] = "applied"
    applied_date : Optional[date] = None
    deadline: Optional[date] = None

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    applied_date: Optional[date] = None
    deadline: Optional[date] = None