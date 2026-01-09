import os

# Read secrets and configuration from environment variables for safer deployment.
# Do NOT commit secrets to source control. Set OPENROUTER_API_KEY in your environment.
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Model and endpoint can also be overridden via environment variables
MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-lite-001")
OPENROUTER_URL = os.getenv("OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions")

if not OPENROUTER_API_KEY:
	# It's better to fail fast at runtime or log a warning; keep empty here so deployments
	# can inject secrets via environment variables or secret managers.
	pass
