import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from config.config import Config
from database.db import init_db
from routes.auth_routes import auth_bp
from routes.analysis_routes import analysis_bp

# Initialize Flask App
app = Flask(__name__)

# Load config settings
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = Config.JWT_ACCESS_TOKEN_EXPIRES
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = Config.JWT_REFRESH_TOKEN_EXPIRES

# Enable extensions
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Initialize Database connection
init_db()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(analysis_bp, url_prefix="/api")

# Global JWT Error Handlers
@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "error": "The token has expired",
        "subcode": "token_expired"
    }), 401

@jwt.invalid_token_loader
def my_invalid_token_callback(error_string):
    return jsonify({
        "error": "Invalid token provided",
        "details": error_string
    }), 401

@jwt.unauthorized_loader
def my_unauthorized_token_callback(error_string):
    return jsonify({
        "error": "Authorization headers missing",
        "details": error_string
    }), 401

# Root route
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "app": "LegalLingo API",
        "version": "1.0.0",
        "status": "healthy"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Run server
    app.run(host="0.0.0.0", port=port, debug=True)
