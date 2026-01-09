const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const themeIcon = document.getElementById('theme-icon');
const timeDisplay = document.getElementById('timeDisplay');

// System Variables
let isDarkMode = true;
let voiceModeActive = false;

// API endpoint (set from config.js, defaults to localhost for backward compatibility)
const API_URL = window.API_BASE_URL || 'http://127.0.0.1:5000';

// Update time display
function updateTimeDisplay() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTimeDisplay, 1000);
updateTimeDisplay();

// Update system info periodically
function updateSystemInfo() {
  fetch(`${API_URL}/system-info`)
    .then(res => res.json())
    .then(data => {
      if (data.cpu !== undefined) {
        document.getElementById('cpuInfo').textContent = data.cpu + '%';
      }
      if (data.ram !== undefined) {
        document.getElementById('ramInfo').textContent = data.ram + '%';
      }
    })
    .catch(err => console.error('Could not fetch system info'));
}

setInterval(updateSystemInfo, 2000);
updateSystemInfo();

// Theme Management
function toggleTheme() {
  isDarkMode = !isDarkMode;
  const html = document.documentElement;
  
  if (isDarkMode) {
    html.classList.remove('dark-mode');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  }
}

// Voice Mode Toggle
function toggleVoiceMode() {
  voiceModeActive = !voiceModeActive;
  
  if (voiceModeActive) {
    addMessage('🎤 VOICE MODE ACTIVATED - LISTENING FOR COMMANDS...', 'ai', 'system');
  } else {
    addMessage('🔇 VOICE MODE DEACTIVATED', 'ai', 'system');
  }
}

// Insert command into input field
function insertCommand(cmd) {
  userInput.value = cmd;
  userInput.focus();
  send();
}

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  isDarkMode = false;
  document.documentElement.classList.add('dark-mode');
  themeIcon.textContent = '☀️';
}

// Main send function
async function send() {
  const text = userInput.value.trim();
  
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  userInput.focus();

  const loadingElement = addLoadingMessage();

  try {
    const res = await fetch(`${API_URL}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    loadingElement.remove();
    
    addMessage(data.reply, 'ai', data.type);
  } catch (error) {
    loadingElement.remove();
    addMessage(`⚠️ CONNECTION ERROR\nBackend not responding on ${API_URL}\nPlease ensure backend server is running.`, 'ai', 'error');
    console.error('Fetch error:', error);
  }
}

// Add message to chat
function addMessage(text, sender, type = 'text') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add loading indicator
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content loading';
  contentDiv.innerHTML = '<span></span><span></span><span></span>';
  
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageDiv;
}

// Clear chat and show welcome
function clearChat() {
  messagesContainer.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-header">
        <div class="pulse-indicator"></div>
        <h3>Welcome to V.A.N.I-xAI</h3>
      </div>
      <p class="welcome-text">Your advanced AI assistant is ready to assist</p>
      <div class="divider-mini"></div>
      
      <div class="command-grid">
        <div class="command-category">
          <div class="category-title">⚙️ System</div>
          <div class="command-buttons">
            <button class="cmd-btn" onclick="insertCommand('system stats')">Stats</button>
            <button class="cmd-btn" onclick="insertCommand('system diagnostics')">Diagnostics</button>
            <button class="cmd-btn" onclick="insertCommand('network status')">Network</button>
          </div>
        </div>

        <div class="command-category">
          <div class="category-title">🎮 Control</div>
          <div class="command-buttons">
            <button class="cmd-btn" onclick="insertCommand('open chrome')">Chrome</button>
            <button class="cmd-btn" onclick="insertCommand('open notepad')">Notepad</button>
            <button class="cmd-btn" onclick="insertCommand('open explorer')">Explorer</button>
          </div>
        </div>

        <div class="command-category">
          <div class="category-title">🎯 Functions</div>
          <div class="command-buttons">
            <button class="cmd-btn" onclick="insertCommand('tell me a joke')">Joke</button>
            <button class="cmd-btn" onclick="insertCommand('what time is it')">Time</button>
            <button class="cmd-btn" onclick="insertCommand('process memory')">Memory</button>
          </div>
        </div>

        <div class="command-category">
          <div class="category-title">🔍 Search</div>
          <div class="command-buttons">
            <button class="cmd-btn" onclick="insertCommand('search anything')">Search</button>
            <button class="cmd-btn" onclick="insertCommand('play music')">YouTube</button>
            <button class="cmd-btn" onclick="insertCommand('tell me about')">Info</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Event Listeners
userInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
});
