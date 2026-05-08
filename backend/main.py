import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import PyPDF2
import io
from dotenv import load_dotenv

# Load .env.local from the project root
load_dotenv("../.env.local")

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

    prompt = f"""You are a brutally honest and kind of roaster mood tech career coach.
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
  "realistic_roadmap": [{{"week": "1-2", "focus": "..."}}],
  "core_missing_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "recommended_projects": [{{"title": "<Project Name>", "description": "<Brief 1-sentence description>"}}],
  "top_barrier": "<the single biggest obstacle they face right now>",
  "market_reality_check": "<brutally honest take on industry reality regarding their goal>"
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
                ],
                "core_missing_skills": ["API Key Management", "Reading Error Logs", "Patience"],
                "recommended_projects": [
                    {
                        "title": "Operation Fresh API Key",
                        "description": "Navigate to Google AI Studio and generate a pristine, working API key to unblock your destiny."
                    }
                ],
                "top_barrier": "You literally cannot make API calls.",
                "market_reality_check": "In the real world, engineers actually need working credentials to build AI apps."
            }

        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/declutter")
async def declutter_mind(dump: str = Form(...)):
    api_keys = []
    for i in range(1, 11):
        key = os.environ.get(f"GEMINI_API_KEY_{i}", "")
        if key: api_keys.append(key)
    if not api_keys:
        single = os.environ.get("GEMINI_API_KEY", "")
        if single: api_keys.append(single)
    
    if not api_keys:
        raise HTTPException(status_code=500, detail="No Gemini API keys found.")

    if not dump or len(dump.strip()) < 10:
        raise HTTPException(status_code=400, detail="Brain dump is too short to analyze.")

    prompt = f"""You are a brutally honest but deeply insightful AI cognitive organizer.
A user has just brain-dumped all their overwhelming, chaotic thoughts:

\"\"\"
{dump}
\"\"\"

Analyze their thoughts. Identify what actually matters, what is just noise/anxiety, and what they need to completely drop.
Limit your response to ONLY a raw JSON object matching exactly this schema (no markdown formatting, no code blocks):
{{
  "emotional_load_score": <number 0-100 indicating how overwhelmed they sound>,
  "core_themes": ["<Theme 1>", "<Theme 2>", "<Theme 3>"],
  "prioritized_actions": [{{"task": "<Actionable task>", "reason": "<Why it actually matters>"}}],
  "drop_or_defer": [{{"task": "<Thing they are worrying about>", "status": "<Drop or Defer>", "reason": "<Why it's noise right now>"}}],
  "immediate_focus": "<The single most important thing they must do in the next 24 hours to feel better>",
  "mindset_shift": "<A brutal but necessary 1-2 sentence truth bomb to snap them out of paralysis>"
}}"""

    try:
        last_error = None
        json_res = None

        for key in api_keys:
            try:
                client = genai.Client(api_key=key)
                response = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt
                )
                text_res = response.text.strip()
                if text_res.startswith("```"):
                    text_res = text_res.split("```")[1]
                    if text_res.startswith("json"):
                        text_res = text_res[4:]
                    text_res = text_res.strip()

                json_res = json.loads(text_res)
                break
            except Exception as key_error:
                last_error = str(key_error)
                if any(x in str(key_error).lower() for x in ["expired", "quota", "429", "invalid", "api_key"]):
                    continue
                else:
                    raise

        if json_res:
            return json_res

        raise Exception(last_error or "All Gemini API keys failed.")

    except Exception as e:
        error_msg = str(e)
        if "expired" in error_msg.lower() or "quota" in error_msg.lower() or "429" in error_msg:
            return {
                "emotional_load_score": 100,
                "core_themes": ["API Exhaustion", "Rate Limit Anxiety"],
                "prioritized_actions": [{"task": "Get a new API Key", "reason": "Because this one is dead."}],
                "drop_or_defer": [{"task": "Worrying about this app", "status": "Drop", "reason": "MOCK DATA FALLBACK"}],
                "immediate_focus": "Fix your .env keys so the real AI can help you.",
                "mindset_shift": "You can't declutter your mind if the AI has no API limits left to declutter it with."
            }
        raise HTTPException(status_code=500, detail=error_msg)


@app.post("/api/decisions")
async def better_decisions(
    option1: str = Form(...),
    option2: str = Form(...),
    context: str = Form(...)
):
    api_keys = []
    for i in range(1, 11):
        key = os.environ.get(f"GEMINI_API_KEY_{i}", "")
        if key: api_keys.append(key)
    if not api_keys:
        single = os.environ.get("GEMINI_API_KEY", "")
        if single: api_keys.append(single)
    
    if not api_keys:
        raise HTTPException(status_code=500, detail="No Gemini API keys found.")

    if not option1 or not option2 or not context:
        raise HTTPException(status_code=400, detail="Options and context are required.")

    prompt = f"""You are a brutally logical, unbiased decision strategist.
A user is stuck between two choices and needs absolute clarity.

The dilemma context:
"{context}"

Option 1: "{option1}"
Option 2: "{option2}"

Break down this decision ruthlessly. Identify hidden trade-offs, second-order consequences, and provide a clear, justified recommendation.
Limit your response to ONLY a raw JSON object matching exactly this schema (no markdown formatting, no code blocks):
{{
  "option1_analysis": {{
    "pros": ["<Pro 1>", "<Pro 2>"],
    "cons": ["<Con 1>", "<Con 2>"],
    "hidden_risk": "<A non-obvious downside they probably haven't considered>"
  }},
  "option2_analysis": {{
    "pros": ["<Pro 1>", "<Pro 2>"],
    "cons": ["<Con 1>", "<Con 2>"],
    "hidden_risk": "<A non-obvious downside they probably haven't considered>"
  }},
  "second_order_consequences": ["<Consequence 1 if they do Option 1>", "<Consequence 2 if they do Option 2>"],
  "regret_minimization": "<Which option will they regret LESS in 5 years and why?>",
  "recommendation": "<A firm, unambiguous recommendation of what they should do based on the context>"
}}"""

    try:
        last_error = None
        json_res = None

        for key in api_keys:
            try:
                client = genai.Client(api_key=key)
                response = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt
                )
                text_res = response.text.strip()
                if text_res.startswith("```"):
                    text_res = text_res.split("```")[1]
                    if text_res.startswith("json"):
                        text_res = text_res[4:]
                    text_res = text_res.strip()

                json_res = json.loads(text_res)
                break
            except Exception as key_error:
                last_error = str(key_error)
                if any(x in str(key_error).lower() for x in ["expired", "quota", "429", "invalid", "api_key"]):
                    continue
                else:
                    raise

        if json_res:
            return json_res

        raise Exception(last_error or "All Gemini API keys failed.")

    except Exception as e:
        error_msg = str(e)
        if "expired" in error_msg.lower() or "quota" in error_msg.lower() or "429" in error_msg:
            return {
                "option1_analysis": {
                    "pros": ["It's an option"],
                    "cons": ["Requires an API key"],
                    "hidden_risk": "You might get rate limited."
                },
                "option2_analysis": {
                    "pros": ["It's another option"],
                    "cons": ["Also requires an API key"],
                    "hidden_risk": "Also rate limited."
                },
                "second_order_consequences": ["Your API key is dead.", "You can't make decisions without AI."],
                "regret_minimization": "You'll regret not refreshing your API key.",
                "recommendation": "Fix your .env keys so the real AI can help you decide."
            }
        raise HTTPException(status_code=500, detail=error_msg)
