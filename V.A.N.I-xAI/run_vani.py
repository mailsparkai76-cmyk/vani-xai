import subprocess
import webbrowser
import time
import sys
import os
from pathlib import Path

# Get the backend directory
backend_dir = Path(__file__).parent / "backend"
os.chdir(backend_dir)

# Start Flask server in background
print("🚀 Starting V.A.N.I-xAI Backend...")
server_process = subprocess.Popen(
    [sys.executable, "main.py"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Wait for server to start
print("⏳ Waiting for server to initialize...")
time.sleep(3)

# Open browser
print("🌐 Opening V.A.N.I-xAI in browser...")
webbrowser.open("http://127.0.0.1:5000")

print("✅ V.A.N.I-xAI is running!")
print("🔗 URL: http://127.0.0.1:5000")
print("\nPress Ctrl+C to stop the server...")

try:
    server_process.wait()
except KeyboardInterrupt:
    print("\n🛑 Shutting down V.A.N.I-xAI...")
    server_process.terminate()
    server_process.wait()
    print("✅ Server stopped.")
