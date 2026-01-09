# Deploy V.A.N.I-xAI to Edgeone.app

Since Edgeone.app deploys container images, follow these steps to deploy your Flask app.

## Step 1: Build & Push Docker Image

### Prerequisites
- Docker installed on your system
- A Docker Hub account (or GitHub Container Registry, or other container registry)
- `OPENROUTER_API_KEY` ready

### Build locally and push

```bash
# Build the image
docker build -t your-dockerhub-username/vani-xai:latest .

# Log in to Docker Hub
docker login

# Push the image
docker push your-dockerhub-username/vani-xai:latest
```

Replace `your-dockerhub-username` with your actual Docker Hub username.

## Step 2: Deploy on Edgeone.app

1. Go to https://edgeone.app/ and log in to your account
2. Create a new application (or navigate to your existing one)
3. Select **Container Image** as the deployment method
4. Enter the container image reference:
   - Example: `your-dockerhub-username/vani-xai:latest`
5. Configure **Environment Variables**:
   - Add `OPENROUTER_API_KEY` with your API key value
   - Add `FLASK_ENV` with value `production`
6. Set the container port to `5000` (if prompted)
7. Click **Deploy**

## Step 3: Configure Firebase & Google OAuth

Once your app is live at `https://official-vani-xai.edgeone.app/`:

### In Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select your project (`vani-xai-ff759`)
3. Navigate to **Authentication** → **Sign-in method** → **Providers**
4. Under **Authorized domains**, add:
   - `official-vani-xai.edgeone.app`

### In Google Cloud Console (if you created OAuth credentials):
1. Go to https://console.cloud.google.com/
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   - `https://official-vani-xai.edgeone.app`
6. Add to **Authorized redirect URIs**:
   - `https://official-vani-xai.edgeone.app/__/auth/handler`

## Step 4: Test

1. Visit `https://official-vani-xai.edgeone.app/`
2. Try signing in with:
   - Email/password (if you have an account)
   - Google Sign-In
3. Open browser DevTools (F12 → Console) to see any auth errors

## Troubleshooting

**"Popup blocked" error:**
- Your browser's popup blocker may be blocking Google Sign-In popups
- Check DevTools Console for the full error
- The app has a fallback to `signInWithRedirect` for this case

**"OPENROUTER_API_KEY not set" errors:**
- Verify the environment variable is set in Edgeone's settings
- Check the app logs in Edgeone dashboard

**Firebase domain not authorized:**
- Ensure `official-vani-xai.edgeone.app` is in the Authorized domains list in Firebase Console

**Google OAuth redirect fails:**
- Confirm redirect URIs in Google Cloud Console match your Edgeone domain exactly

## Local Testing with Docker

Before pushing to Edgeone, test locally:

```bash
docker run --rm -p 5000:5000 \
  -e OPENROUTER_API_KEY="your_key_here" \
  -e FLASK_ENV=production \
  your-dockerhub-username/vani-xai:latest
```

Then visit `http://localhost:5000`

## Additional Help

For issues, check:
- Edgeone dashboard logs
- Browser DevTools Console (F12)
- Backend logs if accessible via Edgeone dashboard
