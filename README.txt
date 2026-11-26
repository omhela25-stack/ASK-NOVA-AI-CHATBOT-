NOVA AI FRONTEND

This is a static frontend designed to match the two NOVA AI screenshots:
- Dark silver/black abstract liquid background
- Blue/purple translucent welcome panel
- Name entry screen
- Left NOVA AI sidebar with the same model labels and controls
- Main chat area, voice recording/transcription, and speech playback

DEPLOY TO CLOUDFLARE PAGES
1. Upload these files to your nova-ai-frontend GitHub repository (keep index.html, style.css, script.js and nova-background.png in the repository root).
2. In Cloudflare Pages, connect that repository.
3. Framework preset: None. Build command: leave blank. Build output directory: / (or . if the UI requires it).
4. Deploy.

CONNECT THE BACKEND
1. Deploy the FastAPI backend separately using the backend starter package.
2. Set GROQ_API_KEY in the backend host's environment variables.
3. Open the deployed Pages website and click the small gear icon at bottom-right.
4. Enter the backend base URL (example: https://your-api-host.example.com), without /chat or /health, then save.

IMPORTANT
The API key belongs only in the backend environment variables. Never put GROQ_API_KEY in these frontend files.
Voice recording requires microphone permission and HTTPS. Voice transcription uses the backend /transcribe endpoint.
