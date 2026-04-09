from fastapi import APIRouter
from db.database import supabase

router = APIRouter()

@router.get("/")
def get_analytics():
    response = supabase.table("jobs").select("*").execute()
    jobs = response.data

    total = len(jobs)

    interviews = len([ j for j in jobs if j["status"] == "interview"])

    offers = len([ j for j in jobs if j["status"] == "offer"])

    rejected = len([ j for j in jobs if j["status"] == "rejected"])

    success_rate = round((offers/total*100),1) if total > 0 else 0

    return{
        "total_application": total,
        "interviews": interviews,
        "offers":offers,
        "rejected":rejected,
        "success_rate":success_rate
    }