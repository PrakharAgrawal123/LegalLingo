from datetime import datetime
from bson import ObjectId
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.db import analyses_collection
from data.mock_data import mock_contracts

@jwt_required()
def analyze_controller():
    user_id = get_jwt_identity()
    
    # Read fields from form data (multipart) or JSON body
    data = request.get_json() if request.is_json else {}
    
    filename = request.form.get("filename") or data.get("filename", "")
    template_key = request.form.get("templateKey") or data.get("templateKey", "")
    input_type = request.form.get("inputType") or data.get("inputType", "document")
    pasted_text = request.form.get("text") or data.get("text", "")

    # MOCK OCR / FILE PARSING LOGIC
    # Guess file name if missing
    if not filename:
        if input_type == "text":
            filename = "Pasted_Contract_Text.txt"
        else:
            filename = "Uploaded_Contract.pdf"

    # Guess template key if missing
    if not template_key:
        search_source = (pasted_text + " " + filename).lower()
        if any(kw in search_source for kw in ["offer", "employee", "job", "work", "employment"]):
            template_key = "employment_contract"
        elif any(kw in search_source for kw in ["saas", "term", "service", "cloud", "subscription"]):
            template_key = "saas_terms"
        else:
            template_key = "rent_agreement"

    # Load matched contract analysis
    analysis_template = mock_contracts.get(template_key, mock_contracts["rent_agreement"])

    # Create user analysis record to insert
    analysis_record = {
        "userId": ObjectId(user_id),
        "name": filename,
        "type": analysis_template["type"],
        "healthScore": analysis_template["healthScore"],
        "stats": analysis_template["stats"],
        "summary": analysis_template["summary"],
        "clauses": analysis_template["clauses"],
        "createdAt": datetime.utcnow()
    }

    # Insert into database
    result = analyses_collection.insert_one(analysis_record)
    
    # Format response
    response_data = {
        "_id": str(result.inserted_id),
        "name": filename,
        "type": analysis_template["type"],
        "healthScore": analysis_template["healthScore"],
        "stats": analysis_template["stats"],
        "summary": analysis_template["summary"],
        "clauses": analysis_template["clauses"],
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
