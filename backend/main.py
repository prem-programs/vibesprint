import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import PyPDF2
import io
from dotenv import load_dotenv

# Load .env.local dynamically from the project root
load_dotenv(".env.local")

app = FastAPI()

# Allow CORS for Next.js on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/reality-check")
async def reality_check(goal: str = Form(...), resume: UploadFile = File(...)):
    # Load all keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... or fallback to GEMINI_API_KEY
    api_keys = []
    for i in range(1, 11):  # check up to 10 keys
        key = os.environ.get(f"GEMINI_API_KEY_{i}", "")
        if key:
            api_keys.append(key)
    # Fallback to single key if numbered ones not set
    if not api_keys:
        single = os.environ.get("GEMINI_API_KEY", "")
        if single:
            api_keys.append(single)
    
    if not api_keys:
        raise HTTPException(status_code=500, detail="No Gemini API keys found. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... in .env.local")

    if not goal or not resume:
        raise HTTPException(status_code=400, detail="Goal and resume are required.")

    # Parse PDF text
    try:
        contents = await resume.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in pdf_reader.pages:
            if page.extract_text():
                resume_text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    prompt = f"""You are a brutally honest tech career coach.
A user wants to achieve this goal: "{goal}".

Here is their current resume:
\"\"\"
{resume_text}
\"\"\"

Evaluate how realistic this goal is based EXACTLY on their resume.
Respond ONLY with a raw JSON object using this exact schema (no markdown, no extra text):
{{
  "delusion_score": <number 0-100>,
  "the_roast": "<brutally honest, slightly humorous 2-sentence reality check>",
  "required_hours": <estimated realistic hours needed>,
  "adjusted_timeline": "<realistic timeframe, e.g. '6 Months'>",
  "realistic_roadmap": [{{"week": "1-2", "focus": "..."}}]
}}"""

    try:
        last_error = None
        json_res = None

        for key in api_keys:
            try:
                print(f"Trying Gemini key ending in ...{key[-6:]}")
                client = genai.Client(api_key=key)
                response = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt
                )

                text_res = response.text.strip()

                # Strip markdown code fences if present
                if text_res.startswith("```"):
                    text_res = text_res.split("```")[1]
                    if text_res.startswith("json"):
                        text_res = text_res[4:]
                    text_res = text_res.strip()

                json_res = json.loads(text_res)
                break  # Success — stop trying more keys

            except Exception as key_error:
                err_str = str(key_error)
                print(f"Key ...{key[-6:]} failed: {err_str}")
                last_error = err_str
                # Only continue rotating if it's a quota/auth issue
                if any(x in err_str.lower() for x in ["expired", "quota", "429", "invalid", "api_key"]):
                    continue
                else:
                    raise  # Non-key error, abort immediately

        if json_res:
            return json_res

        # All keys failed
        raise Exception(last_error or "All Gemini API keys failed.")

    except Exception as e:
        print(f"Gemini API Error: {e}")
        error_msg = str(e)

        # Fallback for expired/quota errors so the UI still renders
        if "expired" in error_msg.lower() or "quota" in error_msg.lower() or "429" in error_msg:
            return {
                "delusion_score": 99,
                "the_roast": "Your biggest delusion isn't your career goal — it's thinking an expired API key would get you anywhere. (MOCK DATA - API KEY ISSUE)",
                "required_hours": 9999,
                "adjusted_timeline": "Whenever your API key works",
                "realistic_roadmap": [
                    {"week": "1", "focus": "Open aistudio.google.com/app/apikey"},
                    {"week": "2", "focus": "Generate a fresh API key"},
                    {"week": "3", "focus": "Paste it into .env.local and restart uvicorn"}
                ]
            }

        raise HTTPException(status_code=500, detail=error_msg)
