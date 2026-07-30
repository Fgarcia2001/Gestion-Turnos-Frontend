# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The actual application lives in the **`P4-TPI/` subdirectory**, not the repo root. The root-level `package.json`/`package-lock.json` are vestigial and unused — always `cd P4-TPI` (or run npm commands with `--prefix P4-TPI`) before installing, running, or building.

Within `P4-TPI/`, note the non-standard source layout:
- `src/` — components (`src/Components/...`), assets, `services/api.js`, app entry (`main.jsx`, `App.jsx`)
- `View/` — top-level route pages (**sibling of `src/`, not inside it**)
- `CustomHooks/` — context providers/hooks (**also a sibling of `src/`**)

Files cross-reference each other with relative paths like `../src/...` (from `View/`) and `../../../../CustomHooks/...` (from deep inside `src/Components/...`). Double-check relative import depth when adding files instead of assuming everything is under `src/`.

## Commands

Run from `P4-TPI/`:
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview a production build

There is no test runner configured in this project.

## Architecture

**Entry & routing**: `src/main.jsx` → `src/App.jsx`, which wraps the app in `LanguageProvider` > `AuthProvider` > `BrowserRouter` and defines routes: `/` → `View/Login.jsx`, `/booking` → `View/BookingPage.jsx`, `/admin` → `View/Admin.jsx`, `*` → `View/NotFound.jsx`.

**Admin section switching**: `View/Admin.jsx` does not use nested routes — it holds a `section` string in `useState` and renders one of the components in `src/Components/ComponentsAdmin/Sections/` (`Home`, `ManagmentBusiness`, `Appointments`, `Calendar`, `Settings`) based on it, driven by `Navbar`'s `onSelectSection` callback. When adding a new admin section, follow this pattern rather than adding a react-router route.

**Auth**: `CustomHooks/AuthContext.jsx` provides `AuthProvider`/`useAuth()`. It decodes the JWT payload client-side (no signature verification, just `atob` + `JSON.parse`) to derive `user.role`, `user.businessId`, `user.branchId`, etc., and persists the raw token in `localStorage` under the key `auth_token`. A token without an `exp` claim is treated as valid indefinitely.

**i18n**: `CustomHooks/TraslateHook.jsx` (filename typo, intentionally left as-is) provides `LanguageProvider`/`useTranslation()` — a simple key-lookup translator over the dictionary in `CustomHooks/translations.js`, defaulting to Spanish (`"es"`). Section components generally call `t("Some Key") || "Some Key"` as a fallback, so many strings are still hardcoded English inline.

**API layer**: `src/services/api.js` is the single fetch wrapper for the whole app — no axios/react-query. `BASE_URL` is hardcoded to `https://localhost:7032/api` (the backend runs locally over HTTPS on a different port). `fetchJson()`-based reads swallow errors and return `[]`; `signIn`/`signUp` throw on failure. Follow this file's pattern (small named export functions wrapping `fetchJson`/`fetch` directly) when adding new endpoints rather than introducing a different HTTP client.

**Dev-only JWT bypass**: `LoginForm.jsx` reads `import.meta.env.VITE_JWT_TOKEN` from `P4-TPI/.env` (not committed with a value) as a shortcut token for local development against the backend.

**Styling**: Tailwind CSS v4 utility classes inline throughout, with a hardcoded hex color palette in className strings (e.g. `#1a1a2e`, `#f0ede8`, `#e2ddd8`) rather than Tailwind theme tokens — match this existing convention instead of extending `tailwind.config.js`. Section components (see `Appointments.jsx`) tend to be large, self-contained files that define their own inline icon components rather than importing from a shared icon library.
