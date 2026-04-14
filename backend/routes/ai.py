import pdfplumber
import docx
import io
from fastapi import APIRouter,HTTPException,UploadFile,File
from pydantic import BaseModel
from typing import Optional
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.1-8b-instant"

class AnalyzeRequest(BaseModel):
    description: str

class CVMatchRequest(BaseModel):
    cv:str
    description: str

class CoverLetterRequest(BaseModel):
    description: str
    cv: Optional[str] = None
    name: Optional[str] = None

def call_groq(system_prompt: str , user_prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3
    )
    return response.choices[0].message.content

@router.post("/analyze")
def analyze_job(req: AnalyzeRequest):
    try:
        system_prompt = """You are a job description analyzer. 
        Extract information and return ONLY a valid JSON object with no markdown, no backticks, no extra text.
        IMPORTANT:
        - Always try to identify the company name from the description.
        - If the company is not clearly mentioned, return "Not mentioned".
        - Do NOT guess random company names.
        - Extract the exact years of experience mentioned in the job description (e.g., "2-4 years", "3+ years").
        - Do NOT convert it into "Junior/Mid/Senior".
        - If no experience is mentioned, return "Not mentioned".

        The JSON must have exactly these fields:
        {
            "company":"Company name or Not mentioned",
            "skills": ["skill1", "skill2"],
            "keywords": ["keyword1", "keyword2"],
            "experience_required": "e.g. 2-4 years or Not mentioned",
            "job_type": "Full-time/Part-time/Remote/Contract",
            "location": "City, Country or Remote",
            "salary": "Salary range or Not mentioned",
            "benefits": ["benefit1", "benefit2"],
            "apply_method": {
                "type": "link/email/both/not mentioned",
                "value": "the actual URL or email address or null"
            },
            "summary": "Brief 2-3 sentence summary"
        }"""

        result = call_groq(system_prompt,req.description)

        result = result.replace("```json","").replace("```","").strip()

        parsed = json.loads(result)
        return parsed

    except json.JSONDecodeError:
        raise HTTPException(status_code=500,detail="AI return invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    
@router.post("/cv-match")
def cv_match(req: CVMatchRequest):
    try:
        system_prompt = """You are a CV and job description matcher.
        Compare the CV with the job description and return ONLY a valid JSON object with no markdown, no backticks.
        IMPORTANT:
        - Calculate a realistic match score between 0 and 100.
        - The score must reflect how well the CV matches required skills and experience.
        - Do NOT use a fixed number.
        - Base the score on actual overlap of skills, experience, and keywords.
        The JSON must have exactly these fields:
        {
            "match_score": number between 0 and 100,
            "matching_skills": ["skill1", "skill2"],
            "missing_skills": ["skill1", "skill2"],
            "recommendations": ["recommendation1", "recommendation2"],
            "summary": "Brief summary of the match"
        }"""

        user_prompt = f"CV:\n{req.cv}\n\nJob Description:\n{req.description}"

        result = call_groq(system_prompt,user_prompt)
        result = result.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(result)
        return parsed
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500,detail="AI return invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    
@router.post("/cover-letter")
def generate_cover_letter(req: CoverLetterRequest):
    try:
        system_prompt = """You are a professional cover letter writer.
        Write a compelling, personalized cover letter based on the job description.
        Return ONLY the cover letter text, no extra commentary."""
        
        user_prompt = f"""Write a cover letter for this job:
        

        Job Description:
        {req.description}

        {"CV/Background: " + req.cv if req.cv else ""}
        {"Applicant Name: " + req.name if req.name else ""}

        Write a professional cover letter that highlights relevant skills and experience."""
        
        result = call_groq(system_prompt,user_prompt)
        return {"cover_letter": result}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    
@router.post("/extract-cv")
async def extract_cv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = ""
        
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        
        elif file.filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(contents))
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
                
        else:
            raise HTTPException(status_code=400,detail="Only PDF and DOCX files are supported")
        if not text.strip():
            raise HTTPException(status_code=400,detail="Could not extract text from file")
        
        return {"text": text.strip()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

