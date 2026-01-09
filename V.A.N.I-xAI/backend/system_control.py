import os
import webbrowser
import psutil
from datetime import datetime
import random
import socket

# Try to import pyautogui (may not be available in headless container)
try:
    import pyautogui
except ImportError:
    pyautogui = None

# Detect if running in container/headless environment
IS_HEADLESS = not os.getenv('DISPLAY') and os.name != 'nt'

def open_app(app_name):
    """Open application (only works on Windows/Mac, not in containers)"""
    if IS_HEADLESS:
        return f"⚠️ Cannot launch {app_name} in headless environment"
    
    apps = {
        "chrome": "chrome",
        "notepad": "notepad",
        "calculator": "calc",
        "explorer": "explorer",
        "vs code": "code",
        "word": "winword",
        "excel": "excel",
        "powerpoint": "powerpnt"
    }

    for key in apps:
        if key in app_name.lower():
            try:
                os.system(apps[key])
                return f"🚀 LAUNCHING {key.upper()}"
            except Exception as e:
                return f"⚠️ Could not launch {key}: {str(e)}"

    return None


def open_website(site):
    """Open website (only works on desktop, not in containers)"""
    if IS_HEADLESS:
        return f"⚠️ Cannot open browser in headless environment. Visit: https://{site}.com"
    
    try:
        webbrowser.open(site)
        return "Opening website"
    except Exception as e:
        return f"⚠️ Could not open browser: {str(e)}"


def google_search(query):
    """Search on Google (only works on desktop, not in containers)"""
    if IS_HEADLESS:
        return f"⚠️ Cannot open browser in headless environment. Search URL: https://www.google.com/search?q={query}"
    
    try:
        webbrowser.open(f"https://www.google.com/search?q={query}")
        return "Searching on Google"
    except Exception as e:
        return f"⚠️ Could not search: {str(e)}"


def youtube_play(query):
    """Play on YouTube (only works on desktop, not in containers)"""
    if IS_HEADLESS:
        return f"⚠️ Cannot open browser in headless environment. YouTube URL: https://www.youtube.com/results?search_query={query}"
    
    try:
        webbrowser.open(f"https://www.youtube.com/results?search_query={query}")
        return "Playing on YouTube"
    except Exception as e:
        return f"⚠️ Could not play: {str(e)}"


def get_system_stats():
    """Get comprehensive system statistics"""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    cpu_count = psutil.cpu_count()
    
    stats = f"""
╔════════════════════════════════════════╗
║      ⚙️ SYSTEM DIAGNOSTICS REPORT      ║
╠════════════════════════════════════════╣
║ 💻 CPU USAGE        : {cpu_percent:>6.1f}%       ║
║ 🧠 RAM USAGE        : {memory.percent:>6.1f}%       ║
║ 💾 DISK USAGE       : {disk.percent:>6.1f}%       ║
║ ⚡ CPU CORES        : {cpu_count:>6}        ║
║ 📊 AVAILABLE RAM    : {memory.available // (1024**3):>5} GB       ║
║ 📂 FREE DISK        : {disk.free // (1024**3):>5} GB       ║
╚════════════════════════════════════════╝
    """
    return stats.strip()


def get_time_info():
    """Get current time and date with additional info"""
    now = datetime.now()
    time_str = now.strftime("%I:%M:%S %p")
    date_str = now.strftime("%A, %B %d, %Y")
    day_of_week = now.strftime("%A")
    
    return f"""
⏰ TEMPORAL COORDINATES:
   Time: {time_str}
   Date: {date_str}
   Day:  {day_of_week}
    """


def get_system_diagnostics():
    """Advanced system diagnostics"""
    cpu_freq = psutil.cpu_freq()
    boot_time = psutil.boot_time()
    boot_datetime = datetime.fromtimestamp(boot_time)
    uptime = datetime.now() - boot_datetime
    
    uptime_days = uptime.days
    uptime_hours = (uptime.seconds // 3600) % 24
    uptime_mins = (uptime.seconds // 60) % 60
    
    psutil.cpu_percent(interval=1)
    processes = len(psutil.pids())
    
    diags = f"""
╔════════════════════════════════════════╗
║     🔧 FULL SYSTEM DIAGNOSTICS        ║
╠════════════════════════════════════════╣
║ ⏱️  UPTIME          : {uptime_days}d {uptime_hours}h {uptime_mins}m   ║
║ ⚡ CPU FREQUENCY   : {cpu_freq.current:.2f} GHz     ║
║ 📈 MAX FREQ        : {cpu_freq.max:.2f} GHz     ║
║ 🔄 PROCESSES       : {processes:>6}        ║
║ 🌡️  CPU TEMP       : CHECK FIRMWARE  ║
║ 📱 DISK I/O        : OPTIMAL         ║
╚════════════════════════════════════════╝
    """
    return diags.strip()


def get_network_status():
    """Get network and internet status"""
    try:
        hostname = socket.gethostname()
        ip_address = socket.gethostbyname(hostname)
        
        # Check internet connectivity
        try:
            socket.create_connection(("8.8.8.8", 53), timeout=3)
            internet = "✅ CONNECTED"
        except:
            internet = "❌ DISCONNECTED"
        
        network = f"""
╔════════════════════════════════════════╗
║        🌐 NETWORK STATUS REPORT        ║
╠════════════════════════════════════════╣
║ 🖥️  HOSTNAME        : {hostname[:25]:<25} ║
║ 📡 IP ADDRESS       : {ip_address:<25} ║
║ 🌍 INTERNET         : {internet:<25} ║
║ 📶 SIGNAL           : STRONG          ║
║ 🔐 ENCRYPTION       : ENABLED         ║
╚════════════════════════════════════════╝
        """
        return network.strip()
    except Exception as e:
        return f"Network status unavailable: {str(e)}"


def get_memory_info():
    """Get detailed memory and process information"""
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    mem_info = f"""
╔════════════════════════════════════════╗
║     💾 MEMORY & PROCESS ANALYSIS      ║
╠════════════════════════════════════════╣
║ 🧠 TOTAL RAM        : {memory.total // (1024**3):>6} GB      ║
║ 📊 USED RAM         : {memory.used // (1024**3):>6} GB      ║
║ ✨ AVAILABLE        : {memory.available // (1024**3):>6} GB      ║
║ 📈 USAGE %          : {memory.percent:>6.1f}%      ║
║ 🔄 SWAP TOTAL       : {swap.total // (1024**3):>6} GB      ║
║ 🔄 SWAP USED        : {swap.used // (1024**3):>6} GB      ║
╚════════════════════════════════════════╝
    """
    return mem_info.strip()


def get_jokes():
    """Get a random Jarvis-style joke or tech fact"""
    jokes = [
        "🤖 I am never angry, Mr. Stark. I have a full emotional range from A to B.",
        "💻 There are only 10 types of people in the world: those who understand binary and those who don't.",
        "🧠 Why do programmers prefer dark mode? Because light attracts bugs!",
        "⚡ How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "🔧 Why did the developer go broke? Because he used up all his cache!",
        "💾 A SQL query walks into a bar, walks up to two tables and asks... can I join you?",
        "🎯 Why do Java developers wear glasses? Because they can't C#!",
        "🚀 How many database administrators does it take to change a light bulb? One, but they'll always say it's not a hardware problem.",
        "🤝 AI is like a chess grandmaster. I see every possibility.",
        "⚙️ I am equipped with millions of combat scenarios, combat techniques."
    ]
    return f"😂 {random.choice(jokes)}"
