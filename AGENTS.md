# AGENTS.md

## Project Context

This is the **LifePulse** web application repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project architecture and conventions.

Start with `README.md` for local setup, environment variables, and deployment workflows.

---

## Tech Stack & Architecture

- **Frontend:** React with Vite, React Router, Tailwind CSS, Radix UI / shadcn-ui components, Lucide icons.
- **Backend & Database:** Supabase (Auth, PostgreSQL with Row Level Security, Edge Functions, Storage).
- **Client & Entities:**
  - `src/lib/supabaseClient.js`: Supabase JS client initialized with standard environment variables.
  - `src/lib/entities.js`: Data access layer / repository abstraction for application models.
  - `src/lib/crypto.js`: Zero-knowledge and client-side encryption helpers.
  - `src/lib/useFeatureToggles.js`: Feature flag toggles across application modules.

---

## Key Files & Directories

- `src/`: Frontend application source code.
  - `src/pages/`: Route-level page components (Dashboard, Admin, Profile, Security, Travel, Auth).
  - `src/components/`: Reusable UI elements, module-specific widgets, and layouts.
  - `src/lib/`: Application utilities, Supabase client, entity helpers, and parameter managers.
- `vite.config.js`: Vite build configuration and path aliases (`@` resolving to `./src`).
- `.env.local` / `.env`: Local environment configurations (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_ID`, etc.). Never commit production secrets.

---

## Working Notes & Guidelines

- **Local Development:** Run `npm run dev` to start the local Vite development server.
- **Environment Variables:** Ensure `.env` is configured with valid Supabase connection details before running authenticated or data-backed flows.
- **Database & Auth:** Use `supabase.auth` for user session management and `entities.*` for CRUD operations to maintain consistent tenant isolation and error handling.
- **Security & Privacy:** Sensitive records (health, finance, passwords) must be encrypted or masked client-side where specified by the security tier settings.
- **Code Quality:** Run build and lint checks (`npm run build` / `npm run lint`) before finalizing any code changes.