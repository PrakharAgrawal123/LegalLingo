from flask import Blueprint
from controllers.analysis_controller import (
    analyze_controller,
    history_controller,
    chat_controller,
    compare_controller,
    parse_text_controller
)

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    return analyze_controller()

@analysis_bp.route("/history", methods=["GET"])
def get_history():
    return history_controller()

@analysis_bp.route("/chat", methods=["POST"])
def chat():
    return chat_controller()

@analysis_bp.route("/compare", methods=["POST"])
def compare():
    return compare_controller()

@analysis_bp.route("/parse-text", methods=["POST"])
def parse_text():
    return parse_text_controller()
