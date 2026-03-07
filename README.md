# ICEM TechnoFest 2026: Nexus of Innovation

A dynamic single-page event portal for **ICEM TechnoFest 2026** with animated WebGL visuals, Supabase-backed registrations, and a static markdown-driven content system for production-safe editing.

![ICEM TechnoFest](https://icem-tech-fest.vercel.app)

---

## Tech Stack

### Frontend
- **React 19** and **TypeScript**
- **Vite**
- **Framer Motion**
- **React Three Fiber**

### Backend
- **Supabase (PostgreSQL)** for registration storage
- **Node.js / Express** for `/api/register`
- **Nodemailer** for registration confirmation emails

### Content Management
- **Static markdown config** in `content/site-config.md`
- Parsed at build time, so production stays static and fast

---

## Local Development

### 1. Install dependencies
```bash
bun install
```

### 2. Create the database
1. Create a Supabase project.
2. Open `supabase_schema.sql`.
3. Run it in the Supabase SQL Editor.

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM_NAME="ICEM TechnoFest 2026"

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-anon-jwt-key
```

### 4. Run locally
```bash
bun run dev
```

---

## Static Content Editing

The site content is now controlled by `content/site-config.md`.

### Edit flow
1. Open `content/site-config.md`.
2. Update the JSON block for the section you want to change.
3. Rebuild or redeploy the site.

### Editable sections
- Hero content and countdown
- Announcement banner
- Global registration status
- Social links and contact details
- About-page copy, images, and stats
- Event metadata, brochure visibility, and per-event registration toggles

---

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the `.env` values in Vercel Project Settings.
4. Deploy.

Vercel will build the static frontend and expose `server/server.ts` as the registration API for `/api/register`.

---

## Utility

### Email diagnostics
```bash
bun run test:email
```

Use this when SMTP mail delivery fails during local development.
