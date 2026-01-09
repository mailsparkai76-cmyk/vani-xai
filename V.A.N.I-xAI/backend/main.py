from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import psutil
import sys
from pathlib import Path

# Add backend directory to path for absolute imports
sys.path.insert(0, str(Path(__file__).parent))

from ai_brain import ask_ai
from system_control import (
    open_app, open_website, google_search, youtube_play, 
    get_system_stats, get_time_info, get_jokes, get_system_diagnostics,
    get_network_status, get_memory_info
)

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Health check endpoint (used by Edgeone to verify app is running)
@app.route("/health")
def health():
    return jsonify({"status": "✅ V.A.N.I-xAI is running"}), 200

@app.route("/")
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route("/system-info")
def system_info():
    """Provide real-time system information"""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory().percent
    return jsonify({"cpu": int(cpu), "ram": int(ram)})

@app.route("/command", methods=["POST"])
def command():
    user_text = request.json.get("text", "").lower()

    # SYSTEM DIAGNOSTICS
    if "diagnostics" in user_text or "diagnostic" in user_text:
        diagnostics = get_system_diagnostics()
        return jsonify({"reply": diagnostics, "type": "diagnostics"})

    # NETWORK STATUS
    if "network" in user_text:
        network = get_network_status()
        return jsonify({"reply": network, "type": "network"})

    # MEMORY/PROCESS INFO
    if "memory" in user_text or "process" in user_text:
        memory = get_memory_info()
        return jsonify({"reply": memory, "type": "memory"})

    # SYSTEM STATS
    if "system" in user_text or "stats" in user_text or "status" in user_text:
        stats = get_system_stats()
        return jsonify({"reply": stats, "type": "system"})

    # TIME & DATE
    if "time" in user_text or "date" in user_text or "what is the" in user_text:
        time_info = get_time_info()
        return jsonify({"reply": time_info, "type": "time"})

    # JOKES & FACTS
    if "joke" in user_text or "funny" in user_text or "humor" in user_text:
        joke = get_jokes()
        return jsonify({"reply": joke, "type": "joke"})

    # APP CONTROL
    app_result = open_app(user_text)
    if app_result:
        return jsonify({"reply": app_result, "type": "app"})

    # WEBSITE
    if "open" in user_text:
        site = user_text.replace("open", "").strip()
        open_website(f"https://{site}.com")
        return jsonify({"reply": f"Opening {site}", "type": "website"})

    # GOOGLE SEARCH
    if "search" in user_text:
        query = user_text.replace("search", "").strip()
        google_search(query)
        return jsonify({"reply": "Searching on Google", "type": "search"})

    # YOUTUBE
    if "play" in user_text:
        query = user_text.replace("play", "").strip()
        youtube_play(query)
        return jsonify({"reply": "Playing on YouTube", "type": "youtube"})

    # AI RESPONSE
    ai_reply = ask_ai(user_text)
    return jsonify({"reply": ai_reply, "type": "ai"})


if __name__ == "__main__":
    # Don't run debug mode in production (Edgeone)
    debug = os.getenv('FLASK_ENV') != 'production'
    print(f"🚀 Starting V.A.N.I-xAI Flask server (debug={debug})...")
    app.run(debug=debug, host='0.0.0.0', port=5000)
