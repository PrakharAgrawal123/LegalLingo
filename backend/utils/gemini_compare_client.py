import json
import requests
from config.config import Config

def compare_contracts_gemini(text_a, text_b, name_a="Contract A", name_b="Contract B"):
    """
    Sends two contract texts to Gemini API to compare differences, concession changes,
    and output a structured comparative JSON report.
    """
    api_key = Config.GEMINI_API_KEY
    model = Config.GEMINI_MODEL

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in the environment.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Build Prompt
    prompt = f"""
You are a Senior Legal Counsel and expert Contract Auditor.
Your task is to compare two contract versions side-by-side:
Contract A (Original): '{name_a}'
Contract B (Revised): '{name_b}'

Analyze both contracts very carefully. Identify all major differences, concession changes, new risks, and summarize which document is safer and why.

INSTRUCTIONS:
1. Identify up to 6 critical differences. For each difference, provide:
   - "clause": Name of the clause/section (e.g. "Security Deposit", "Liability Limit", "Notice Period").
   - "originalText": The text or terms from Contract A.
   - "revisedText": The text or terms from Contract B.
   - "impact": How this change affects the signing user. Must be exactly one of: "favorable" | "unfavorable" | "neutral".
     - "favorable": Contract B is friendlier/safer for the user than Contract A.
     - "unfavorable": Contract B introduces more risk or penalties than Contract A.
     - "neutral": The terms are modified but the overall net impact is negligible or equal.
   - "explanation": A clear explanation of what changed and why this impact was selected.
2. Provide a 2-3 sentence executive "summary" explaining which contract is generally better for the user and why.
3. Calculate the "healthDifference" string showing the score differential (e.g., "+15 (Contract B is safer)" or "-5 (Contract A is safer)").

YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON OBJECT matching this exact structure:
{{
  "summary": "Contract B is generally more favorable...",
  "healthDifference": "+12 (Contract B is safer)",
  "differences": [
    {{
      "clause": "Intellectual Property Assignment",
      "originalText": "...",
      "revisedText": "...",
      "impact": "favorable",
      "explanation": "..."
    }}
  ]
}}

Do NOT wrap the output in markdown code blocks like ```json or anything else. Just return raw JSON.

Here is Contract A (Original):
---
{text_a}
---

Here is Contract B (Revised):
---
{text_b}
---
"""

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    print(f"[Gemini Compare] Dispatching contract comparison to {model} between '{name_a}' and '{name_b}'", flush=True)
    response = requests.post(url, headers=headers, json=payload, timeout=60)

    if response.status_code != 200:
        raise RuntimeError(f"Gemini API returned status code {response.status_code}: {response.text}")

    response_json = response.json()
    try:
        content_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean any accidental markdown wrap
        content_text = content_text.strip()
        if content_text.startswith("```json"):
            content_text = content_text[7:]
        if content_text.endswith("```"):
            content_text = content_text[:-3]
        content_text = content_text.strip()
        
        parsed_comparison = json.loads(content_text)
        return parsed_comparison
    except Exception as e:
        raise RuntimeError(f"Failed to parse comparison JSON: {str(e)}. Raw response: {response.text}")
