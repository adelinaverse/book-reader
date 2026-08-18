# Book Reader (Google TTS)

A small reader that turns PDF text into natural AI speech using Google Cloud
Text-to-Speech. The API key stays server-side in a Vercel environment variable.

## Structure
- `api/speak.js` — serverless function. Receives text, returns MP3 audio from Google.
- `index.html` — the reader frontend (added in Part 3).
- `vercel.json` — Vercel config.

## Setup
1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com (New Project).
3. In Vercel project settings → Environment Variables, add:
   - Name: `GOOGLE_TTS_KEY`
   - Value: your Google Cloud Text-to-Speech API key
4. Deploy. The reader lives at your Vercel URL; the function at `/api/speak`.

## Free tier
Google gives ~1,000,000 characters/month of Neural2 voices free, resets monthly,
does not expire. Roughly one book per month.

## Note
Google caps a single request at 5000 characters, so long text is sent in chunks
by the frontend.
