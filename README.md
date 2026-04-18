<div align="center">

<br/>

```
   ██╗ ██████╗ ██████╗ ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗
   ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║██║   ██║██████╔╝   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
██  ██║██║   ██║██╔══██╗   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
╚█████╔╝╚██████╔╝██████╔╝   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
 ╚════╝  ╚═════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

**AI-Powered Job Application Intelligence Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square&logo=groq&logoColor=white)](https://groq.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

*Stop managing jobs in spreadsheets. Start making better decisions.*

[Features](#-core-capabilities) · [Architecture](#️-system-architecture) · [Setup](#️-setup-instructions) · [API](#-api-overview)

</div>

---

##  Overview

Job searching is chaotic — dozens of applications, scattered notes, no visibility into what's working.

**JobTracker** centralizes everything into a structured, AI-augmented workspace:

-  **Track** every application through its full lifecycle
-  **Analyze** job descriptions to extract skills, keywords & requirements
-  **Match** your CV against any role and get a scored gap analysis
-  **Generate** tailored cover letters in seconds
-  **Visualize** your application funnel and monthly trends

This is not just a CRUD app — it's a **decision-support system for job seekers**.

---

##  Core Capabilities

###  Application Management

Track jobs across a structured status lifecycle:

```
Applied  →  HR Call  →  Interview  →  Offer
```

Attach notes, timestamps, and context to every application — all in one place.

---

###  AI-Powered Intelligence

#### 1. Job Description Analyzer
Paste any job posting and instantly extract:
-  Required skills & tech stack
-  Key search keywords
-  Experience level
-  Job type classification

#### 2. CV Matching Engine
Upload your CV and a job description to receive:
-  A numeric match score
-  Identified skill gaps
-  Actionable improvement suggestions

#### 3. Cover Letter Generator
Provide job context and get a tailored, human-like cover letter — no more copy-paste rewrites.

---

###  Analytics Dashboard

> Know what's working. Double down on it.

- Application success rate by stage
- Monthly application volume trends
- Stage conversion performance

---

##  System Architecture

```
┌─────────────────────────┐
│   Frontend (React+Vite) │
└────────────┬────────────┘
             │ HTTP / REST
┌────────────▼────────────┐
│   Backend API (FastAPI) │
└───┬──────────┬──────────┘
    │          │
┌───▼────┐  ┌──▼──────────────┐
│Supabase│  │  Groq (Llama 3.1)│
│  (DB)  │  │   AI Layer       │
└────────┘  └──────────────────┘
             │
┌────────────▼────────────┐
│   n8n Automation Layer  │
└─────────────────────────┘
```

---

##  Tech Stack

| Layer        | Technology                            |
|:-------------|:--------------------------------------|
| **Frontend** | React, Vite, TailwindCSS, Recharts    |
| **Backend**  | FastAPI (Python 3.10+)                |
| **Database** | Supabase (PostgreSQL)                 |
| **AI**       | Groq API — Llama 3.1                  |
| **Automation** | n8n workflows                       |

---

##  Project Structure

```
job-tracker/
├── backend/
│   ├── routes/          # API endpoint definitions
│   ├── models/          # Pydantic data models
│   ├── db/              # DB connection & migrations
│   ├── main.py          # App entry point
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── pages/       # Route-level views
        ├── components/  # Reusable UI components
        ├── services/    # API call abstractions
        └── hooks/       # Custom React hooks
```

---

##  Setup Instructions

### Prerequisites

- Python `3.10+`
- Node.js `18+`
- [Supabase](https://supabase.com) account
- [Groq API key](https://console.groq.com)

---

###  Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
```

Start the server:

```bash
uvicorn main:app --reload
```

---

###  Frontend

```bash
cd frontend
npm install
npm run dev
```




##  Future Improvements

- [ ] Authentication (multi-user support)
- [ ] Email follow-up reminders
- [ ] Resume parsing improvements
- [ ] Browser extension for one-click job import
- [ ] Docker + CI/CD deployment pipeline

---

##  Author

**Your Name**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/julkarShabab)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/julkar-niene)

---

<div align="center">

If you found this useful, consider giving it a ⭐

</div>
