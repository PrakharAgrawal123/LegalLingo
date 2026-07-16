from datetime import datetime
from bson import ObjectId
from flask_bcrypt import generate_password_hash, check_password_hash

class UserModel:
    @staticmethod
    def create_user_dict(full_name, email, password=None, provider="email", google_id=None, profile_picture=None):
        pw_hash = None
        if password:
            pw_hash = generate_password_hash(password).decode("utf-8")
            
        return {
            "fullName": full_name,
            "email": email.lower().strip(),
            "passwordHash": pw_hash,
            "provider": provider,
            "googleId": google_id,
            "profilePicture": profile_picture or "",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "lastLogin": datetime.utcnow(),
            "isVerified": True if provider == "google" else False
        }

    @staticmethod
    def verify_password(pw_hash, password):
        if not pw_hash or not password:
            return False
        try:
            return check_password_hash(pw_hash, password)
        except Exception:
            return False

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password).decode("utf-8")

    @staticmethod
    def to_json(user_doc):
        if not user_doc:
            return None
        
        # Serialize MongoDB ObjectId to string
        user_id = str(user_doc.get("_id"))
        
        return {
            "id": user_id,
            "fullName": user_doc.get("fullName"),
            "email": user_doc.get("email"),
            "provider": user_doc.get("provider"),
            "googleId": user_doc.get("googleId"),
            "profilePicture": user_doc.get("profilePicture"),
            "createdAt": user_doc.get("createdAt").isoformat() if isinstance(user_doc.get("createdAt"), datetime) else user_doc.get("createdAt"),
            "updatedAt": user_doc.get("updatedAt").isoformat() if isinstance(user_doc.get("updatedAt"), datetime) else user_doc.get("updatedAt"),
            "lastLogin": user_doc.get("lastLogin").isoformat() if isinstance(user_doc.get("lastLogin"), datetime) else user_doc.get("lastLogin"),
            "isVerified": user_doc.get("isVerified", False)
        }
