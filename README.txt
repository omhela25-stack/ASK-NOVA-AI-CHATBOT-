NOVA AI FRONTEND — MATCHED TO YOUR ORIGINAL STREAMLIT SCREENSHOTS

This version uses your supplied nova_background.jpeg (not a newly generated substitute).
It recreates the two original screens:
1) Welcome/name-entry screen.
2) Main NOVA AI chat screen with left sidebar, model cards, welcome hero,
   Learn something / Build something prompts, composer, microphone and send button.

Files:
- index.html
- style.css
- script.js
- nova-background.jpeg

Deploy on Cloudflare Pages:
- Connect your nova-ai-frontend GitHub repository.
- Framework preset: None
- Build command: leave blank
- Build output directory: /

Important:
The frontend needs your separately deployed FastAPI backend. Click the gear button
in the lower-right corner after deployment and enter the backend URL.
Do not put your Groq API key in frontend files.
