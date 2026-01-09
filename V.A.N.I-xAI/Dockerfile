# Dockerfile for V.A.N.I-xAI backend + frontend
# Uses Python slim image and installs system deps needed for Pillow
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Install system dependencies (note: pyautogui/X11 won't work in container)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      gcc \
      ca-certificates \
      && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy project
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port
EXPOSE 5000

# Health check (Edgeone will use this to verify the app is running)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:5000/health', timeout=5)"

# Use gunicorn to serve Flask app
CMD ["gunicorn", "-b", "0.0.0.0:5000", "--workers", "2", "--worker-class", "sync", "--timeout", "30", "backend.main:app"]
