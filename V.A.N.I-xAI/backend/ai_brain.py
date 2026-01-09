import requests
from config import OPENROUTER_API_KEY, OPENROUTER_URL, MODEL

def ask_ai(user_query):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are V.A.N.I-xAI, a smart desktop AI assistant."},
            {"role": "user", "content": user_query}
        ]
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return "⚠️ Error connecting to AI."
