# LifePulse

LifePulse is a modern family life management and security dashboard application built with React, Vite, Tailwind CSS, and Supabase.

---

## Features

- **Household Management:** Create or join family spaces, invite members, and assign custom family roles.
- **Security & Privacy Audit:** Configurable security tiers (Standard, High-Privacy, Maximum Vault Isolation), auto-lock timeouts, session tracking, and 2FA support.
- **Integrated Hubs:** Dashboard tiles and dedicated management for Health, Finance, Investments, Travel, Household Calendars, and Vaults.
- **Admin Control Portal:** Role-based system admin portal with feature toggles, platform stats, and zero-knowledge audit logging.
- **Zero-Knowledge Privacy:** Client-side data masking and password hashing using PBKDF2/SHA-256.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project (or local Supabase instance)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd lifepulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` or `.env` file in the root directory and add your environment configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_ID=your_app_id
VITE_APP_BASE_URL=http://localhost:5173
```

### 4. Run the development server

```bash
npm run dev
```

Open the local URL printed in your terminal (typically `http://localhost:5173`) in your browser.

---

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles and bundles the application for production into `dist/`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across the codebase.

---

## Project Structure

```text
├── public/                # Static assets, icons, and web manifest
├── src/
│   ├── api/               # API helpers and data-fetching interfaces
│   ├── components/        # Reusable UI components & feature modules
│   │   ├── admin/         # System admin portal components
│   │   ├── dashboard/     # Dashboard widgets & overview tiles
│   │   ├── security/      # Security score & session management
│   │   ├── travel/        # Itinerary and packing list widgets
│   │   └── ui/            # Base UI primitives (buttons, inputs, dialogs)
│   ├── hooks/             # Custom React hooks (e.g. useSize)
│   ├── lib/               # Utility functions, crypto helpers, Supabase client
│   ├── pages/             # Application route views & screens
│   ├── App.jsx            # Top-level router & application providers
│   └── main.jsx           # Application entry point
├── index.html             # HTML entry point
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite build configuration
```

---

## Security & Auth Notes

- Authentication is powered by Supabase Auth with email/password, OTP verification, and OAuth providers (Google).
- Administrative actions require an explicit `admin` role and an encrypted admin passphrase unlock.
- Never commit `.env.local` or production API keys to source control.