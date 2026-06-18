# Free AI provider for the Lexo MVP

Lexo now uses Google Gemini as the primary free MVP provider instead of
DeepSeek.

## Why Gemini for the MVP

- Google AI Studio has a free usage tier in supported regions.
- Gemini supports text and vision input, so Lexo can analyze PDF/DOCX text plus
  legal photos and scans.
- The app already has demo fallbacks, so investor demos do not crash if the key
  is missing.

## Required environment variables

Add these locally and in Vercel:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-flash-lite-latest
```

`DEEPSEEK_API_KEY` is optional now and is not required for the MVP.

## How to get the key

1. Open Google AI Studio.
2. Create an API key.
3. Add it to `.env.local`.
4. Add it to Vercel Production environment variables.
5. Redeploy production.

After that, Lexo's Contract Review can perform live AI analysis for PDF, DOCX,
JPG, PNG, WEBP, HEIC, and HEIF files.
