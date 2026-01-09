V.A.N.I-xAI — Deploying to Edgeone.app

This repository contains a Flask backend (`backend/`) and a static frontend (`frontend/`). The following files were added to support containerized deployment to Edgeone.app or any container platform:

- `Dockerfile` — builds the application image and runs `gunicorn backend.main:app` on port 5000.
- `requirements.txt` — Python dependencies used by the app.

Configuration changes
- The project now reads the OpenRouter API key and related settings from environment variables. Edit `backend/config.py` was updated to use `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `OPENROUTER_URL` from the environment. Do not store API keys in source control.

Using `docker-compose` (local test)

1. Create a `.env` file at the project root with your secret(s):

```env
OPENROUTER_API_KEY=sk-xxxxx
```

2. Start the app with Docker Compose:

```bash
docker compose up --build
```

3. Visit `http://localhost:5000` in your browser.

Edgeone / OAuth notes

- Set `OPENROUTER_API_KEY` in Edgeone's environment/secret settings when creating the app.
- For Firebase Google Sign-In to work on your Edgeone-hosted domain, you must add the Edgeone domain to the Firebase Console under Authentication → Sign-in method → Authorized domains.
- Additionally, if you created OAuth credentials in the Google Cloud Console, add the Edgeone app origin and redirect URI (example):

  - Authorized JavaScript origins: `https://<your-app>.edgeone.app`
  - Authorized redirect URIs: `https://<your-app>.edgeone.app/__/auth/handler`

If you want, I can prepare a `.env.example` and a `docker-compose.override.yml` for development (with a mounted volume and auto-reload). Let me know.

Pre-deployment notes
- The app uses the OpenRouter API key configured in `backend/config.py`. For production, move secrets into environment variables and avoid committing keys to source control.
- The code imports `pyautogui` which expects a desktop/X environment for some features. In container deployments these features may be limited; the container includes minimal X libs so basic imports should work, but desktop automation will be constrained.

Build and test locally with Docker

1. Build the image:

```bash
docker build -t vani-xai:latest .
```

2. Run the container locally (exposes port 5000):

```bash
docker run --rm -p 5000:5000 \
  -e OPENROUTER_API_KEY="your_key_here" \
  -e FLASK_ENV=production \
  vani-xai:latest
```

3. Open the app in your browser:

```
http://localhost:5000
```

Publish to a container registry (Docker Hub example)

```bash
docker tag vani-xai:latest your-dockerhub-username/vani-xai:latest
docker push your-dockerhub-username/vani-xai:latest
```

Deploying on Edgeone.app

Edgeone supports deploying apps from container images. Follow these high-level steps:

1. Push the Docker image to a registry (Docker Hub, GitHub Container Registry, or a private registry).
2. In the Edgeone dashboard, create a new app and select "Container Image" as the runtime.
3. Enter the image reference (for example `your-dockerhub-username/vani-xai:latest`).
4. Configure environment variables (set `OPENROUTER_API_KEY` and any other secrets in Edgeone's environment/secret settings).
5. Set the container port to `5000` if required.
6. Deploy and check logs for startup errors.

Post-deploy checklist
- Confirm the app starts and serves `index.html` from `/frontend`.
- Verify Firebase authentication works from the hosted domain — you may need to add the Edgeone app domain to the OAuth redirect origins in the Firebase Console.
- If Google Sign-In popups are blocked in the hosted environment, ensure OAuth redirect URIs are configured (use the hosted domain) and consider using `signInWithRedirect` as a fallback.

If you want, I can:
- Replace the hard-coded API key with environment variable usage inside `backend/config.py`.
- Add a small `docker-compose.yml` for local testing.
- Add guidance for setting Firebase redirect URIs for your Edgeone domain.

Which of those would you like next?