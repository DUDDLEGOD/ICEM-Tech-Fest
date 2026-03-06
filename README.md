# ICEM Tech Fest 2026 Website

A highly dynamic, single-page interactive portal built for **ICEM TechnoFest 2026**. Featuring a 3D network node visualizer, real-time event registration, dark neon theme aesthetics, and a fully functional admin Content Management System (CMS).

## Tech Stack Overview

### Frontend Core
- **React 19** & **TypeScript**: High-performance typed component architecture.
- **Vite & Bun**: Ultra-fast build toolchain and package management.
- **Tailwind CSS**: Rapid utility-first styling with custom CSS property injection (`--stormy-teal`, `--deep-purple`).
- **Framer Motion**: State-driven, fluid micro-animations across the UI.
- **React Three Fiber (WebGL)**: Real-time 3D rendering of the background mesh particle system.

### Backend & Communications
- **Express.js (Node.js)**: Local backend (`server/server.ts`) running on port `3001` handling secure API routes.
- **Nodemailer**: SMTP integration to securely fire automated confirmation emails to team leaders upon successful registration.
- **Local Storage API**: Client-side caching of CMS Settings (`SiteContext`) and backup offline registrations.

---

## Getting Started

### 1. Installation
Ensure you have Bun installed, then install dependencies:
```bash
bun install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and supply your secure credentials to enable the email service:
```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM_NAME="ICEM TechnoFest 2026"
```

### 3. Running the Stack
The project is built to seamlessly boot the frontend Vite server and the Node backend concurrently:
```bash
bun run dev
```

### 4. Build for Production
```bash
bun run build
```

---

## Core Features & Architecture

### 1. Dynamic Site CMS (`contexts/SiteContext.tsx`)
The entire application relies on a React Context API provider that handles the site's state. Using the **Admin Dashboard**, organizers can globally edit:
- **Hero Typography & Timing**: Update Event Titles, Scramble Texts, and the Countdown Target.
- **Event Specifications**: Fully modify Event Names, Descriptions, Entry Fees (₹), Team Limitations, Venues, Timings, and Point of Contact details.
- *Note*: Client-side configuration merges seamlessly with default configurations via deep merge logic to prevent UI breakage on returning clients.

### 2. Live Registration Engine (`RegistrationForm.tsx` & `server.ts`)
Users progress through a multi-step form to register their squad for an arena.
- **Data Capture**: Validation for Team Leader details, multiple squad members, and technical abstracts.
- **Network Resilience**: Attempts a `POST` fetch to the local Node.js endpoint. 
- **Auto-Email**: If successful, Node.js securely formats an HTML email using Nodemailer and fires it. 
- **Offline Fallback**: If the server is down or the payload fails, the site smartly falls back to storing the registration safely inside HTML5 LocalStorage, tagging it as "Queued".

### 3. Admin Command Center (`AdminDashboard.tsx`)
A protected dashboard area accessible via `<Ctrl>` + click on the footer or direct route.
- **Password**: `nexus2026admin`
- Functions include:
  1. Data Export: Download all captured registrations directly as a `.csv` file.
  2. Hero Editor: Real-time manipulation of the landing page text and countdown timer.
  3. Event Manager: Change pricing, limits, and visibility of event brochures.

---

## Utility Tools

**Standalone Email Diagnostics**
If your custom registration emails are failing, use the built-in diagnostic script rather than continuously filling out the registration form:
```bash
bun run test:email
```
This isolates the backend `.env` credentials and automatically pinpoints SMTP handshake failures or App Password expiration issues.
