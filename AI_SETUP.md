# Xceed10 AI setup

The AI page is ready, but the live site must call a secure backend. Do NOT put a Gemini API key in GitHub Pages.

## Backend
1. Create a Google AI Studio API key using an account allowed by Google's terms.
2. Deploy `xceed10-ai-worker.js` as a server-side/edge Worker.
3. Add the secret `GEMINI_API_KEY` to the Worker; never commit the key.
4. Allow CORS from `https://hxmza660.github.io` (the Worker code already does this).
5. Copy the deployed Worker URL.

## Website
Open `ai-config.js` and replace:

`PASTE_YOUR_BACKEND_URL_HERE`

with the Worker URL.

Then commit `ai.html`, `ai.js`, `ai-config.js`, `style.css`, and the worker file (the worker is safe to publish only if it contains no secret; the actual secret must be configured in the Worker dashboard).

Google's current Gemini Developer API has a free tier for selected models/limits, and Gemini 3.8 Flash is currently available as `gemini-3.8-flash`; production/high-volume usage can move to paid tiers. See Google's current docs for quotas and billing.
