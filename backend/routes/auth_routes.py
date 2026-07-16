from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.auth_controller import (
    register_controller,
    login_controller,
    google_login_controller,
    refresh_controller,
    logout_controller,
    forgot_password_controller,
    reset_password_controller,
    get_me_controller,
    update_profile_controller,
    change_password_controller,
    delete_account_controller
)

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    return register_controller()

@auth_bp.route("/login", methods=["POST"])
def login():
    return login_controller()

@auth_bp.route("/google", methods=["POST"])
def google_login():
    return google_login_controller()

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    return refresh_controller()

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return logout_controller()

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    return forgot_password_controller()

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    return reset_password_controller()

@auth_bp.route("/me", methods=["GET"])
def get_me():
    return get_me_controller()

@auth_bp.route("/update-profile", methods=["PUT"])
def update_profile():
    return update_profile_controller()

@auth_bp.route("/change-password", methods=["PUT"])
def change_password():
    return change_password_controller()

@auth_bp.route("/delete-account", methods=["DELETE"])
def delete_account():
    return delete_account_controller()
