# Deploy Frontend Only to Edgeone.app

This guide shows how to host **only the V.A.N.I-xAI frontend** on Edgeone.app while running the backend separately (locally or on another server).

## Quick Start

### 1. Build Frontend-Only Docker Image

```bash
# Build using the frontend-specific Dockerfile
docker build -f Dockerfile.frontend -t your-username/vani-xai-frontend:latest .

# Log in and push to Docker Hub
docker login
docker push your-username/vani-xai-frontend:latest
```

### 2. Deploy on Edgeone.app

1. Go to Edgeone.app dashboard
2. Create a new application
3. Select **Container Image** deployment
4. Enter image reference: `your-username/vani-xai-frontend:latest`
5. Expose port `5000`
6. Deploy

That's it! No environment variables needed for frontend-only deployment.

### 3. Configure Backend Endpoint

**Frontend development (localhost):**
- Edit `frontend/config.js`
- Change the production API endpoint (line with `isProduction ? ...`)
- Set it to your backend URL

**Example:**
```javascript
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'                           // Local dev
  : 'https://api.your-domain.com';                    // Production backend
```

### 4. Test

After deploying to Edgeone:
- Visit `https://official-vani-xai.edgeone.app/`
- You should see the login page and UI
- Chat commands will fail if backend isn't running at the configured URL
- Firebase authentication should work (no backend required)

## Backend Options

### Option A: Keep Backend Running Locally
- Your laptop runs: `python run_vani.py`
- Frontend on Edgeone calls: `http://localhost:5000`
- ❌ Won't work (Edgeone can't reach your local machine)

### Option B: Backend on Different Server/Port
- Run backend on a VPS or cloud server
- Frontend calls that server's API
- ✅ Works if CORS is enabled (already done in main.py)

**Example:**
```javascript
// In frontend/config.js
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://api.official-vani-xai.example.com';  // Your backend server
```

### Option C: Backend on Docker (Different Container)
- Run backend on another Edgeone app or separate container
- Frontend calls that backend URL
- ✅ Most reliable for production

**If running backend on another Edgeone app:**
```javascript
// In frontend/config.js
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://backend-vani-xai.edgeone.app';  // Backend app on Edgeone
```

## What's Included in Frontend-Only Image

- `index.html` — App UI
- `style.css` — Styling
- `script.js` — Chat logic
- `auth.js` — Firebase authentication
- `config.js` — API endpoint configuration

**What's NOT included:**
- `backend/` folder (saved ~500MB in image size!)
- `requirements.txt`
- `Dockerfile` (for full stack)

## Troubleshooting

### Frontend loads but chat doesn't work
- **Cause**: Backend URL not responding
- **Fix**: Check `frontend/config.js` has correct backend URL for production

### "Authentication failed" errors
- **Cause**: Firebase domain not authorized
- **Fix**: Add `official-vani-xai.edgeone.app` to Firebase Console → Authorized domains

### Popup blocked on Google Sign-In
- **Cause**: Browser popup blocker
- **Fix**: App will fall back to redirect flow automatically

### API endpoint shows wrong URL in error message
- **Cause**: `config.js` not loaded
- **Fix**: Verify `index.html` has `<script src="config.js"></script>` after Firebase modules

## Docker Image Size Comparison

- **Full stack** (`Dockerfile`): ~400MB (includes Python, Flask, all backend deps)
- **Frontend only** (`Dockerfile.frontend`): ~150MB (minimal Python, no Flask/backend)

## Rebuild After Config Changes

If you modify `frontend/config.js`:

```bash
# Rebuild image
docker build -f Dockerfile.frontend -t your-username/vani-xai-frontend:latest .

# Push update
docker push your-username/vani-xai-frontend:latest

# Redeploy in Edgeone dashboard (pull new image)
```

## Files Modified for Frontend-Only Deployment

- **New**: `Dockerfile.frontend` — lightweight frontend container
- **New**: `frontend/config.js` — API endpoint configuration
- **Updated**: `frontend/index.html` — loads config.js
- **Updated**: `frontend/script.js` — uses `API_BASE_URL` from config

## Next Steps

1. Build and push frontend image
2. Deploy to Edgeone
3. Decide on backend hosting strategy (local dev, separate server, or separate container)
4. Update `frontend/config.js` with your production backend URL
5. Test frontend on Edgeone

Questions? Check Edgeone logs for deployment errors or browser console (F12) for JavaScript errors.
