from flask import Blueprint
from controllers.analysis_controller import (
    analyze_controller,
    history_controller
)

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    return analyze_controller()

@analysis_bp.route("/history", methods=["GET"])
def get_history():
    return history_controller()
