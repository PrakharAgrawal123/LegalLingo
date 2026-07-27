from datetime import datetime
from bson import ObjectId
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.db import analyses_collection
from data.mock_data import mock_contracts
from utils.file_parser import extract_text_from_file
from utils.gemini_client import analyze_contract_text, generate_chat_response

@jwt_required()
def analyze_controller():
    user_id = get_jwt_identity()
    
    # Read fields from form data (multipart) or JSON body
    data = request.get_json() if request.is_json else {}
    
    filename = request.form.get("filename") or data.get("filename", "")
    template_key = request.form.get("templateKey") or data.get("templateKey", "")
    input_type = request.form.get("inputType") or data.get("inputType", "document")
    pasted_text = request.form.get("text") or data.get("text", "")
    extracted_text = ""

    # Check if a file was uploaded in request.files
    file_upload = request.files.get("file")
    
    if input_type == "document" and file_upload:
        filename = file_upload.filename
        try:
            extracted_text = extract_text_from_file(file_upload, filename)
            print(f"[File Parser] Successfully extracted {len(extracted_text)} characters from {filename}", flush=True)
        except Exception as e:
            return jsonify({"error": f"Failed to parse document: {str(e)}"}), 400
    elif input_type == "text":
        extracted_text = pasted_text
        if not filename:
            filename = "Pasted_Contract_Text.txt"
    else:
        # Fallback if it is document but no file uploaded (e.g. sample contracts)
        if not filename:
            filename = "Uploaded_Contract.pdf"

    # TRY LIVE GEMINI AI ANALYSIS
    gemini_result = None
    if extracted_text.strip():
        try:
            gemini_result = analyze_contract_text(extracted_text, filename)
            print(f"[Gemini AI] Successfully parsed and analyzed contract using live API.", flush=True)
        except Exception as e:
            print(f"[Gemini AI Warning] Failed live parsing. Falling back to mock templates. Reason: {str(e)}", flush=True)

    if gemini_result:
        # Load details from live AI results
        analysis_type = gemini_result.get("type", "Contract Analysis")
        health_score = gemini_result.get("healthScore", 70)
        stats = gemini_result.get("stats", {"risky": 0, "caution": 0, "safe": 0})
        summary = gemini_result.get("summary", "")
        clauses = gemini_result.get("clauses", [])
    else:
        # Guess template key if missing (dynamic fallback based on extracted text contents!)
        if not template_key:
            search_source = (extracted_text + " " + filename).lower()
            if any(kw in search_source for kw in ["offer", "employee", "job", "work", "employment"]):
                template_key = "employment_contract"
            elif any(kw in search_source for kw in ["saas", "term", "service", "cloud", "subscription"]):
                template_key = "saas_terms"
            else:
                template_key = "rent_agreement"

        # Load matched contract analysis
        analysis_template = mock_contracts.get(template_key, mock_contracts["rent_agreement"])
        analysis_type = analysis_template["type"]
        health_score = analysis_template["healthScore"]
        stats = analysis_template["stats"]
        summary = analysis_template["summary"]
        clauses = analysis_template["clauses"]

    # Create user analysis record to insert
    analysis_record = {
        "userId": ObjectId(user_id),
        "name": filename,
        "type": analysis_type,
        "healthScore": health_score,
        "stats": stats,
        "summary": summary,
        "clauses": clauses,
        "extractedText": extracted_text,
        "createdAt": datetime.utcnow()
    }

    # Insert into database
    result = analyses_collection.insert_one(analysis_record)
    
    # Format response
    response_data = {
        "_id": str(result.inserted_id),
        "name": filename,
        "type": analysis_type,
        "healthScore": health_score,
        "stats": stats,
        "summary": summary,
        "clauses": clauses,
        "extractedText": extracted_text,
        "createdAt": analysis_record["createdAt"].isoformat()
    }

    return jsonify(response_data), 200


@jwt_required()
def history_controller():
    user_id = get_jwt_identity()
    
    # Query all analyses matching current user
    history_cursor = analyses_collection.find({"userId": ObjectId(user_id)}).sort("createdAt", -1)
    
    history_list = []
    for doc in history_cursor:
        doc_json = {
            "_id": str(doc["_id"]),
            "userId": str(doc["userId"]),
            "name": doc.get("name"),
            "type": doc.get("type"),
            "healthScore": doc.get("healthScore"),
            "stats": doc.get("stats"),
            "summary": doc.get("summary"),
            "clauses": doc.get("clauses"),
            "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt")
        }
        history_list.append(doc_json)

    return jsonify(history_list), 200

@jwt_required()
def chat_controller():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    analysis_id = data.get("analysisId")
    user_message = data.get("message")
    history = data.get("history", [])

    if not analysis_id or not user_message:
        return jsonify({"error": "Missing analysisId or message parameter"}), 400

    try:
        # Load the analysis record from database
        analysis_record = analyses_collection.find_one({
            "_id": ObjectId(analysis_id),
            "userId": ObjectId(user_id)
        })

        if not analysis_record:
            return jsonify({"error": "Contract analysis not found"}), 404

        contract_text = analysis_record.get("extractedText", "")
        contract_name = analysis_record.get("name", "Document")

        # Fallback to summary if full text wasn't parsed
        if not contract_text:
            contract_text = f"Summary: {analysis_record.get('summary', '')}"

    except Exception as e:
        return jsonify({"error": f"Invalid analysisId: {str(e)}"}), 400

    try:
        # Generate live chat response using Gemini
        ai_response = generate_chat_response(contract_text, contract_name, user_message, history)
    except Exception as e:
        print(f"[Gemini Chat Warning] Live chat failed. Using fallback response. Reason: {str(e)}", flush=True)
        # Simple simulated keyword fallback to protect user experience (fail-safe)
        query_lower = user_message.lower()
        if "leave" in query_lower or "break" in query_lower or "terminate" in query_lower:
            ai_response = "Based on standard terms, early termination typically results in notice periods or deposit forfeiture. Please check your lease Clause 3 for exact terms."
        elif "compete" in query_lower or "work" in query_lower:
            ai_response = "The contract contains standard intellectual property and non-compete clauses. Review Clause 1 and 2 to ensure side projects are carved out."
        else:
            ai_response = "I am currently running in offline fallback mode. Please consult your local attorney or double-check the specific clauses in the sidebar."

    return jsonify({"response": ai_response}), 200

