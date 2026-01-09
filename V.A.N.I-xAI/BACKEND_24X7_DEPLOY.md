# Deploy Backend to Edgeone.app (24/7 Running)

Your frontend is configured to call `https://backend-vani-xai.edgeone.app/` but the backend isn't deployed yet. Follow these steps to deploy the backend as a separate Edgeone app that runs continuously.

## Step 1: Build Backend Docker Image

```bash
# Build using the existing Dockerfile (for full backend stack)
docker build -t your-username/vani-xai-backend:latest .

# Log in to Docker Hub
docker login

# Push to registry
docker push your-username/vani-xai-backend:latest
```

## Step 2: Deploy Backend on Edgeone.app

1. **Go to Edgeone.app dashboard**
2. **Create a NEW application** (separate from frontend app)
   - Name: `backend-vani-xai` (or similar)
   - This is where your backend will run 24/7

3. **Select Container Image** deployment method

4. **Enter image reference:**
   ```
   your-username/vani-xai-backend:latest
   ```

5. **Configure Environment Variables** (CRITICAL):
   ```
   OPENROUTER_API_KEY=<your_actual_api_key_here>
   FLASK_ENV=production
   ```

6. **Port configuration:**
   - Container port: `5000`
   - Expose to internet: YES

7. **Restart policy** (for 24/7 uptime):
   - Set to: **Always restart** or **Auto-restart on failure**
   - This ensures backend restarts if it crashes

8. **Click Deploy**

## Step 3: Verify Backend is Running

Wait 2-3 minutes for deployment, then test:

```bash
# Test health endpoint
curl https://backend-vani-xai.edgeone.app/health

# Should return:
# {"status":"✅ V.A.N.I-xAI is running"}
```

If successful, visit your frontend at `https://official-vani-xai.edgeone.app/` and try sending a chat message. It should now connect to the backend.

## Step 4: Configure for 24/7 Operation

### Option A: Edgeone Auto-Restart (Recommended)
- Most Edgeone plans include automatic restart on failure
- Go to app settings and enable "Auto-restart on crash"
- Your backend will restart automatically if it goes down

### Option B: Health Monitoring
- Edgeone has built-in health checks
- Backend includes `/health` endpoint that responds with status
- Edgeone will restart if health check fails

### Option C: Add Monitoring (Optional)
- Set up alerts in Edgeone dashboard
- Monitor backend logs for errors
- Check monthly uptime stats

## Troubleshooting

### Backend doesn't start
**Check Edgeone logs:**
1. Go to backend app dashboard
2. Click "Logs" or "Activity"
3. Look for error messages

**Common errors:**
- `OPENROUTER_API_KEY not set` → Add environment variable
- `ModuleNotFoundError` → Image build failed (rebuild and push)
- `Port already in use` → Usually Edgeone issue, try redeploying

### Frontend can't reach backend
- Verify backend app URL is `https://backend-vani-xai.edgeone.app/`
- Test with: `curl https://backend-vani-xai.edgeone.app/health`
- Check CORS is enabled (it is, in `backend/main.py`)
- Verify `frontend/config.js` points to correct backend URL

### Backend keeps restarting
**Possible causes:**
- API key is invalid → check OPENROUTER_API_KEY
- Out of memory → upgrade container size in Edgeone
- Import errors → rebuild Docker image

**Check logs:**
```bash
# Monitor logs in real-time (if Edgeone provides CLI)
edgeone logs backend-vani-xai -f
```

## Configuration Files Ready for Deployment

Your project already has everything needed:

- ✅ `Dockerfile` — backend server setup
- ✅ `requirements.txt` — dependencies
- ✅ `backend/main.py` — Flask app with health check
- ✅ `backend/config.py` — reads env variables
- ✅ `frontend/config.js` — points to backend URL
- ✅ `.dockerignore` — optimizes image size

## Expected Behavior After Deployment

### Frontend → Backend Communication:
1. User visits `https://official-vani-xai.edgeone.app/` (frontend)
2. Frontend loads and shows login screen
3. User logs in with email or Google
4. User sends a chat message
5. Frontend sends request to `https://backend-vani-xai.edgeone.app/command`
6. Backend processes request (calls OpenRouter AI, system info, etc.)
7. Backend returns response
8. Frontend displays response in chat

### 24/7 Uptime:
- Backend container runs continuously on Edgeone
- Automatic restart on crash
- Health check every 30 seconds
- Logs available in Edgeone dashboard

## Cost Note

Running services 24/7 on Edgeone will incur costs. Check:
- Container compute time (per minute/hour)
- Data transfer
- Storage

See Edgeone pricing for your region.

## Next Steps

1. **Build backend image** (5-10 min):
   ```bash
   docker build -t your-username/vani-xai-backend:latest .
   docker push your-username/vani-xai-backend:latest
   ```

2. **Deploy on Edgeone** (2-3 min via dashboard)

3. **Verify health** (check `/health` endpoint works)

4. **Test end-to-end** (send message from frontend)

5. **Monitor logs** (watch Edgeone dashboard first day)

Questions? Check Edgeone docs for container deployment or reply with error messages from logs.

🚀 Starting V.A.N.I-xAI Flask server (debug=True)...
 * Running on http://127.0.0.1:5000
