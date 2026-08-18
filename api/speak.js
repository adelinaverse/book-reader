// Vercel serverless function: receives text, returns audio from Google TTS.
// The API key lives in an environment variable (set in Vercel), never in this file.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const key = process.env.GOOGLE_TTS_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Server is missing its API key.' });
  }

  try {
    const { text, voice, rate, pitch } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'No text provided.' });
    }

    // Google caps a single request at 5000 characters. Guard against overshoot.
    const clipped = text.slice(0, 4900);

    const googleRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: clipped },
          voice: {
            languageCode: 'en-US',
            name: voice || 'en-US-Neural2-F',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: rate || 1.0,
            pitch: pitch || 0.0,
          },
        }),
      }
    );

    const data = await googleRes.json();

    if (!googleRes.ok) {
      const msg = data?.error?.message || 'Google TTS request failed.';
      return res.status(googleRes.status).json({ error: msg });
    }

    // data.audioContent is base64-encoded MP3
    return res.status(200).json({ audio: data.audioContent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
}
