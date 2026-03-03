# ICEM Tech Fest 2026 Website

Single-page React + Vite website for ICEM Tech Fest 2026 registration and event showcase.

## Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- Tailwind CSS (via CDN in `index.html`)

## Run locally

1. Install dependencies:
   `npm install`
2. Start development server:
   `npm run dev`
3. Build production bundle:
   `npm run build`
4. Run type check:
   `npm run lint`

## Registration API

- Configure endpoint in `.env.local`:
  `VITE_REGISTRATION_API_URL=<your-google-apps-script-web-app-url>`
- Reference backend setup:
  `docs/registration-backend.md`
