import json
import requests
from config.config import Config

def analyze_contract_text(text, filename):
    """
    Sends the extracted contract text to Google's Gemini API and retrieves
    a structured legal analysis JSON report matching the frontend schema.
    """
    api_key = Config.GEMINI_API_KEY
    model = Config.GEMINI_MODEL

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in the environment.")

    # API Endpoint for Gemini
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Build Prompt
    prompt = f"""
You are a Senior Legal Counsel, Contracts Expert, and plain-English legal translator.
Your task is to analyze the following contract text (from the file: '{filename}') very carefully and provide a structured audit report in JSON format.

INSTRUCTIONS:
1. Simplify dense legalese clauses into clear, plain English translations.
2. Identify warning flags and risks. Rate each key clause as one of the following statuses:
   - "risky": Unfavorable, dangerous, or containing hidden penalties/traps/unreasonable obligations for the signing user.
   - "caution": Standard but needs careful consideration, contains liability shifts, or has strict limits.
   - "safe": Standard, fair, or friendly to the signing user.
3. Calculate an overall "healthScore" (integer from 0 to 100) representing how fair/safe the contract is (higher is safer, 100 is completely safe).
4. Extract up to 6 critical clauses (minimum 3). For each clause, provide:
   - "id": unique identifier (e.g. "c1", "c2", "c3")
   - "title": brief name (e.g. "Security Deposit Forfeiture", "Intellectual Property Assignment", "Termination Notice")
   - "status": "risky" | "caution" | "safe"
   - "original": the EXACT sentence or paragraph from the contract text (Do not summarize the original text).
   - "simplified": a plain English summary explaining exactly what this means in simple terms.
   - "explanation": a description of why this clause matters, what rights are being waived, or why they should be careful.
   - "renegotiate": suggested revised wording, counter-offer, or alternative strategy to negotiate a better deal.
5. Provide a 2-3 sentence executive "summary" of the overall contract.
6. Determine the contract "type" (e.g., "Rent Agreement", "Employment Contract", "Non-Disclosure Agreement (NDA)", "SaaS Terms of Service", etc.).
7. Set "stats" counting the total clauses under "risky", "caution", and "safe".

YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON OBJECT matching this exact structure:
{{
  "healthScore": 75,
  "type": "Rental Lease Agreement",
  "summary": "...",
  "stats": {{
    "risky": 1,
    "caution": 1,
    "safe": 4
  }},
  "clauses": [
    {{
      "id": "c1",
      "title": "...",
      "status": "risky",
      "original": "...",
      "simplified": "...",
      "explanation": "...",
      "renegotiate": "..."
    }}
  ]
}}

Do NOT wrap the output in markdown code blocks like ```json or anything else. Just return raw JSON.

Here is the contract text to analyze:
---
{text}
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

    print(f"[Gemini client] Dispatching API request to {model} for contract: {filename}", flush=True)
    response = requests.post(url, headers=headers, json=payload, timeout=45)

    if response.status_code != 200:
        raise RuntimeError(f"Gemini API returned status code {response.status_code}: {response.text}")

    response_json = response.json()
    try:
        content_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean any accidental markdown wrap that LLMs sometimes add despite instructions
        content_text = content_text.strip()
        if content_text.startswith("```json"):
            content_text = content_text[7:]
        if content_text.endswith("```"):
            content_text = content_text[:-3]
        content_text = content_text.strip()
        
        parsed_analysis = json.loads(content_text)
        return parsed_analysis
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini JSON output: {str(e)}. Raw response: {response.text}")

def generate_chat_response(contract_text, contract_name, user_message, history=None):
    """
    Sends the contract text, chat history, and user's query to Google's Gemini API
    to retrieve a conversational legal advisory response.
    """
    api_key = Config.GEMINI_API_KEY
    model = Config.GEMINI_MODEL

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in the environment.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Build conversation context helper
    history_context = ""
    if history and isinstance(history, list):
        # Format the last 6 messages to preserve context without blowing up prompt size
        for msg in history[-6:]:
            sender_label = "User" if msg.get("sender") == "user" else "AI Legal Copilot"
            history_context += f"{sender_label}: {msg.get('text')}\n"

    prompt = f"""
You are an AI Legal Copilot assisting a user with their contract: '{contract_name}'.
Your goal is to answer their specific questions about this contract clearly, accurately, and in plain language.

CONSTRAINTS & GUIDELINES:
1. Base your answer STRICTLY on the contract text provided below. If the information is not in the contract, explain that it's not specified.
2. If the user asks for alternatives or how to negotiate a clause, suggest standard lawyer-approved counter-offer proposals.
3. Be professional, direct, and concise (limit response to 1-3 short paragraphs).
4. Do NOT say "As an AI..." or "Based on the text...". Respond directly as a knowledgeable legal advisor.

Here is the contract text:
---
{contract_text}
---

Recent conversation history:
{history_context}

User's new question:
{user_message}

AI Legal Copilot response:
"""

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    print(f"[Gemini Chat] Sending message to {model} regarding contract: {contract_name}", flush=True)
    response = requests.post(url, headers=headers, json=payload, timeout=30)

    if response.status_code != 200:
        raise RuntimeError(f"Gemini API returned status code {response.status_code}: {response.text}")

    response_json = response.json()
    try:
        content_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
        return content_text.strip()
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini response text: {str(e)}. Raw response: {response.text}")

