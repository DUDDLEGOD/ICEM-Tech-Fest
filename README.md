# 🌌 ICEM TechnoFest 2026: Nexus of Innovation

A highly dynamic, single-page interactive event portal built for **ICEM TechnoFest 2026**. Featuring a WebGL 3D network node visualizer, real-time event registration synced to PostgreSQL, fluid glassmorphism aesthetics, and a fully functional Admin Command Center.

![ICEM TechnoFest](https://icem-tech-fest.vercel.app)

---

## ⚡ Tech Stack Architecture

### Frontend Core
- **React 19** & **TypeScript**: High-performance typed component architecture.
- **Vite**: Ultra-fast build toolchain.
- **Tailwind CSS**: Rapid utility-first styling with custom CSS properties for dynamic theming (`--stormy-teal`, `--deep-purple`).
- **Framer Motion**: State-driven, fluid micro-animations across the UI (Flip-clocks, Modal transitions).
- **React Three Fiber (WebGL)**: Real-time 3D rendering of the background interconnected mesh particle system.

### Backend & Cloud Sync
- **Supabase (PostgreSQL)**: Cloud relational database handling real-time ingestion of all team registrations.
- **Node.js / Express**: Serverless backend mapping (`server/server.ts`) handling secure API routes and database insertion middleware.
- **Nodemailer**: SMTP integration to securely fire automated, encrypted confirmation HTML emails to team leaders upon successful row insertion.
- **Local Storage API**: Client-side caching of CMS Settings (`SiteContext`), allowing live dynamic editing of the Hero and Events directly from the browser.

---

## 🚀 Local Development Setup

### 1. Installation
This project utilizes [Bun](https://bun.sh/) for blisteringly fast dependency resolution and execution.
```bash
bun install
```

### 2. Cloud Database Prep (Supabase)
1. Create a free project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase Dashboard.
3. Open the `supabase_schema.sql` file located in the root of this repository.
4. Copy the contents, paste it into the Supabase SQL Editor, and execute it to generate the required `registrations` and `team_members` tables.

### 3. Environment Configuration
Create a `.env` file in the root directory. You must supply your live Supabase keys and a Gmail App Password string for the automated email system to boot.

```env
# --- Gmail SMTP Configuration ---
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM_NAME="ICEM TechnoFest 2026"

# --- Supabase Database Integration ---
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-anon-jwt-key
```
> *Note: Regular Gmail passwords will not work. You must generate an App Password via Google Account Settings -> 2-Step Verification.*

### 4. Running the Stack
The project is built to seamlessly run the frontend Vite server and the Node backend concurrently:
```bash
bun run dev
```
Wait for the terminal to expose `http://localhost:3000`.

---

## ☁️ Vercel Deployment Guide

This project is custom-configured out of the box for free, serverless Edge deployment on Vercel via the included `vercel.json` routing matrix.

1. **Commit to GitHub**: Push this repository to your personal GitHub account.
2. **Connect Vercel**: Log into Vercel, click "Add New Project", and select your GitHub repository.
3. **Inject Variables**: Before clicking deploy, expand the **Environment Variables** section. Copy and paste all 5 keys from your `.env` file into Vercel.
4. **Deploy**: Vercel will automatically detect the Vite build, compile the static front end, and convert `server/server.ts` into a dynamic Serverless Function mapped to `/api/*`. 

---

## 🛡️ Admin Command Center

The application features a built-in protective CMS overlay to manage the site without writing code.

**How to access:** 
Scroll to the absolute bottom of the page and **click on the Footer Copyright text** to open the Admin Gateway.
- **Password**: `nexus2026admin`

**Capabilities:**
1. **Live Cloud DB Extraction**: View real-time database entries pulled from Supabase. Click the Download icon to instantly generate a comprehensive multi-column `.csv` file detailing every Team Leader, Member, and respective College for offline spreadsheet sorting.
2. **Hero Editor**: Live edit headers, scrambler text, and the target end-date of the Flip-Clock.
3. **Event Manager**: Dynamically alter Event Titles, Requirements, Entry Fees, Venues, and Timings.

---

## 🛠️ Utility Tools

**Standalone Email Diagnostics**
If your custom registration emails are failing during local development, use the built-in diagnostic script rather than continuously filling out the registration form:
```bash
bun run test:email
```
This script isolates the backend `.env` variables and automatically pinpoints SMTP handshake failures or App Password expiration issues, returning a detailed trace.
