import hashlib
import uuid
import requests
from datetime import datetime
from bson import ObjectId
from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required
)
from database.db import users_collection, analyses_collection
from models.user import UserModel
from config.config import Config

def register_controller():
    data = request.get_json() or {}
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    # Validations
    if not all([full_name, email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    email_clean = email.lower().strip()
    
    # Check if duplicate email
    if users_collection.find_one({"email": email_clean}):
        return jsonify({"error": "An account with this email already exists"}), 409

    # Create user document
    user_dict = UserModel.create_user_dict(
        full_name=full_name,
        email=email_clean,
        password=password,
        provider="email"
    )

    result = users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)

    # Fetch inserted user
    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    user_json = UserModel.to_json(user_doc)

    # Generate JWT tokens
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)

    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_json
    }), 201

def login_controller():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    email_clean = email.lower().strip()
    user_doc = users_collection.find_one({"email": email_clean})

    if not user_doc:
        return jsonify({"error": "Invalid email or password"}), 401

    if user_doc.get("provider") == "google":
        return jsonify({"error": "This account is registered via Google. Please log in using Google."}), 400

    # Verify password hash
    if not UserModel.verify_password(user_doc.get("passwordHash"), password):
        return jsonify({"error": "Invalid email or password"}), 401

    user_id = str(user_doc["_id"])

    # Update last login timestamp
    users_collection.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )
    user_doc["lastLogin"] = datetime.utcnow()
    user_json = UserModel.to_json(user_doc)

    # Generate JWT tokens
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_json
    }), 200

def google_login_controller():
    data = request.get_json() or {}
    id_token = data.get("id_token")

    if not id_token:
        return jsonify({"error": "Google ID token is required"}), 400

    # Verify ID token with Google's tokeninfo API
    try:
        google_res = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        )
        if google_res.status_code != 200:
            return jsonify({"error": "Invalid Google OAuth ID token"}), 401
            
        token_info = google_res.json()
    except Exception as e:
        return jsonify({"error": f"Failed to contact Google OAuth API: {str(e)}"}), 500

    # Read profile info
    google_id = token_info.get("sub")
    email = token_info.get("email").lower().strip()
    fullName = token_info.get("name")
    profile_pic = token_info.get("picture")

    if not google_id or not email:
        return jsonify({"error": "Token payload missing Google metadata"}), 400

    # Search for user by Google ID first, then by email
    user_doc = users_collection.find_one({"googleId": google_id})
    if not user_doc:
        user_doc = users_collection.find_one({"email": email})

    if user_doc:
        # User exists, login
        user_id = str(user_doc["_id"])
        
        # Keep profile picture and name updated
        users_collection.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {
                "googleId": google_id,
                "profilePicture": profile_pic or user_doc.get("profilePicture"),
                "lastLogin": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }}
        )
        user_doc["googleId"] = google_id
        if profile_pic:
            user_doc["profilePicture"] = profile_pic
        user_doc["lastLogin"] = datetime.utcnow()
    else:
        # User does not exist, auto-register
        user_dict = UserModel.create_user_dict(
            full_name=fullName,
            email=email,
            provider="google",
            google_id=google_id,
            profile_picture=profile_pic
        )
        result = users_collection.insert_one(user_dict)
        user_id = str(result.inserted_id)
        user_doc = users_collection.find_one({"_id": ObjectId(user_id)})

    user_json = UserModel.to_json(user_doc)

    # Generate JWT tokens
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)

    return jsonify({
        "message": "Google Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_json
    }), 200

def refresh_controller():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": new_access_token}), 200

def logout_controller():
    # Stateless logout endpoint returns confirmation
    return jsonify({"message": "Logout successful"}), 200

def forgot_password_controller():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    email_clean = email.lower().strip()
    user_doc = users_collection.find_one({"email": email_clean})

    # For security reasons, don't leak whether the email exists, just return success
    if not user_doc:
        return jsonify({"message": "If the email is registered, a password reset link has been generated."}), 200

    if user_doc.get("provider") == "google":
        return jsonify({"error": "Google accounts cannot reset passwords here. Please log in using Google."}), 400

    # Generate a secure reset token
    reset_token = uuid.uuid4().hex
    
    # Hash token to store in DB (prevents theft)
    token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
    
    # Expires in 1 hour
    expiration = datetime.utcnow() + Config.JWT_REFRESH_TOKEN_EXPIRES / 168 # 1 hour
    
    users_collection.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {
            "resetTokenHash": token_hash,
            "resetTokenExpires": expiration,
            "updatedAt": datetime.utcnow()
        }}
    )

    # Reset URL
    reset_link = f"http://localhost:5173/reset-password/{reset_token}"
    print(f"[MAIL MOCK] Password reset link for {email_clean}: {reset_link}")

    return jsonify({
        "message": "If the email is registered, a password reset link has been generated.",
        "reset_link": reset_link  # Return link in dev mode for easy local testing
    }), 200

def reset_password_controller():
    data = request.get_json() or {}
    token = data.get("token")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if not token or not password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Hash incoming token to match database
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    user_doc = users_collection.find_one({
        "resetTokenHash": token_hash,
        "resetTokenExpires": {"$gt": datetime.utcnow()}
    })

    if not user_doc:
        return jsonify({"error": "Reset link is invalid or has expired."}), 400

    # Hash new password
    pw_hash = UserModel.hash_password(password)

    users_collection.update_one(
        {"_id": user_doc["_id"]},
        {
            "$set": {
                "passwordHash": pw_hash,
                "updatedAt": datetime.utcnow()
            },
            "$unset": {
                "resetTokenHash": "",
                "resetTokenExpires": ""
            }
        }
    )

    return jsonify({"message": "Password updated successfully"}), 200

@jwt_required()
def get_me_controller():
    user_id = get_jwt_identity()
    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user_doc:
        return jsonify({"error": "User session not found"}), 404

    user_json = UserModel.to_json(user_doc)
    return jsonify(user_json), 200

@jwt_required()
def update_profile_controller():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    full_name = data.get("fullName")

    if not full_name:
        return jsonify({"error": "Full name is required"}), 400

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "fullName": full_name,
            "updatedAt": datetime.utcnow()
        }}
    )

    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    user_json = UserModel.to_json(user_doc)
    return jsonify(user_json), 200

@jwt_required()
def change_password_controller():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not old_password or not new_password:
        return jsonify({"error": "Old and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400

    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    if user_doc.get("provider") == "google":
        return jsonify({"error": "Google sign-in accounts cannot change passwords here"}), 400

    # Verify old password
    if not UserModel.verify_password(user_doc.get("passwordHash"), old_password):
        return jsonify({"error": "Incorrect current password"}), 401

    # Hash and save new password
    new_pw_hash = UserModel.hash_password(new_password)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "passwordHash": new_pw_hash,
            "updatedAt": datetime.utcnow()
        }}
    )

    return jsonify({"message": "Password changed successfully"}), 200

@jwt_required()
def delete_account_controller():
    user_id = get_jwt_identity()
    user_obj_id = ObjectId(user_id)

    # Delete user profile record
    user_delete = users_collection.delete_one({"_id": user_obj_id})

    if user_delete.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404

    # Delete user document audit records
    analyses_collection.delete_many({"userId": user_obj_id})

    return jsonify({"message": "Account and audit history deleted successfully"}), 200
