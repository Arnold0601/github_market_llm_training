## Purpose
Short, opinionated instructions to help an AI coding agent be immediately productive in this repository.

## Quick checklist for contributors
- Repo contains four primary projects: `02_python_tools`, `03_python_fastapi_project`, `04_market`, `05_design`.
- Backend: `03_python_fastapi_project` (FastAPI + async SQLAlchemy + SQLite `app.db`).
- Legacy/basic Frontend: `04_market` (Vite + React + TypeScript) – simple CRUD.
- Design/front-end refinement sandbox: `05_design` (Vite + React + Tailwind, iterating on dialogs, cards, tokens). This is the active UI playground.
- Small utility package: `02_python_tools` (a `src/` layout Python package).

## How to run (concrete commands / examples)
- FastAPI backend (recommended): from `03_python_fastapi_project` run:
  - `uv sync` (install deps via `uv` if available)
  - `uv run uvicorn main:app --reload` — dev server with auto-reload (app at http://localhost:8000)
  - Production example: `uv run uvicorn main:app --host 0.0.0.0 --port 8000`
  - The app creates DB tables on startup (see `main.py` lifespan -> `create_tables()`).

- Frontend (from `04_market`):
  - `npm install` then `npm run dev` (port 5173 default)
  - Build: `npm run build`; Preview: `npm run preview`.

- Design frontend (`05_design`):
  - `npm install` then `npm run dev`
  - Uses Tailwind tokens (see below) and modal/card refinements.

- Small Python tool: `02_python_tools` - run with `python main.py` from that folder.

## Key patterns & integration points
- Config: `03_python_fastapi_project/config.py` uses `pydantic-settings` and `.env` (look for `DATABASE_URL`, `APP_NAME`, `DEBUG`).
- DB: `03_python_fastapi_project/database.py` uses async SQLAlchemy + `sqlite+aiosqlite:///./app.db`. There are no migration scripts — schema is created at runtime via `create_tables()`.
- API surface: `03_python_fastapi_project/main.py` exposes REST endpoints under `/products/`. CORS allows localhost Vite ports (5173+ variants) for both `04_market` and `05_design`.
- Project layout: Python projects use `src/` package layout and `pyproject.toml` (Hatchling). Frontends each have their own `package.json` + `tsconfig.json`.

### 05_design UI specifics
- Product list uses cards only (table removed) with action buttons row (View/Edit/Delete) at bottom.
- Details dialog: fixed width 444px, heading "Product Details", product name, description, separator line, two-column Price / Stock, Product ID below.
- Add/Edit/Delete dialogs: styled to Figma spec (custom radii, icon button for close, warning icon for delete).
- Shadows: layered subtle elevation (`shadow-sm` base, stronger on hover) and custom box-shadows for dialog where needed.

### Tailwind design tokens (05_design / tailwind.config.js)
- Colors: `muted #717182`, `destructive #D4183D`, `ink.{900,950}`, `primary` scale (50–950).
- Radii: `rounded-btn 6.75px`, `rounded-card 12.75px`, `rounded-cardsm 8.75px` (smaller dialog/card variant).
- Font sizes: `xs2 11.3px`, `sm2 12.8px`, `base2 13.2px` plus ad‑hoc 14px / 16px inline utilities where Figma requires.
- Utilities defined in `src/styles.css`: `.btn-primary`, `.btn-outline`, `.btn-danger`, `.icon-btn`, `.input`.

### TypeScript / parsing note
- 05_design intends to use TypeScript (`tsconfig.json` present). If you see parser errors like `Unexpected token :` for type annotations, ensure the bundler is running in the `05_design` directory (Vite). Running from outside or misconfigured tooling can make the editor treat files as plain JS.
- If friction persists, temporarily remove explicit type annotations in `App.tsx` and rely on JSDoc until tooling is fixed.

### Common UI adjustments tasks
- Adjust card spacing or shadows: edit `ProductCards.tsx` & tailwind classes.
- Modify dialog layout: edit `App.tsx` (modal instances) or `Modal.tsx` for container shell.
- Update tokens: edit `05_design/tailwind.config.js` and restart dev server.
- Form validation logic: `components/ProductForm.tsx` (inline simple validation). Consider migrating to a schema validator if complexity grows.

## Developer conventions to follow
- Use the `uv` toolchain in the FastAPI project when present: `uv sync`, `uv run ...` (this repo's README and pyproject expect it).
- Async DB usage: prefer async SQLAlchemy session (`AsyncSession`) and `get_db()` dependency from `database.py` for request-scoped sessions.
- No migrations: assume local `app.db` is authoritative. If you change models, update `create_tables()` or add a migration workflow (none exists today).

## Files to consult when making changes
- Backend: `03_python_fastapi_project/main.py`, `config.py`, `database.py`, `pyproject.toml`, `app.db` (runtime DB file).
- Frontend: `04_market/src/*`, `04_market/package.json`, `vite.config.ts`, `index.html`.
- Design frontend: `05_design/src/*` (cards, modals, tokens).
- Tools: `02_python_tools/src/sza_fancy_pack/fancy_pack.py`, `02_python_tools/main.py`.

## When you edit code, run these quick checks
- Backend smoke: start server (`uv run uvicorn main:app --reload`) and curl `GET /` to verify.
- Frontend smoke (04_market): `npm run dev` and open `http://localhost:5173`.
- Design frontend smoke (05_design): run its own `npm run dev` (also port 5173; stop the other if port conflict) then open the URL.
- Tests (if working on backend): `uv run pytest` from `03_python_fastapi_project` (pytest is in dev extras in `pyproject.toml`).

## Examples of actionable tasks an AI agent can do first
- Implement a new product field: update `Product` model in `database.py`, adjust Pydantic DTOs in `main.py`, and verify `create_tables()` creates the new column (note: SQLite + create_all may silently skip some changes).
- Add a new endpoint: follow patterns in `main.py` (use `AsyncSession` via `Depends(get_db)`, `select()` queries, `response_model`).
- Add a field & propagate to 05_design UI (update backend Product + DTOs, then adjust `types.ts`, `ProductForm.tsx`, card display, details dialog).
- Refine dialog sizing or tokens (update tailwind config + component classes, verify in browser).
- Introduce loading skeletons for ProductCards (replace initial Loading text with skeleton components using pulse animation).

## Limitations / things to ask the human
- No migration tool present — ask whether to add Alembic or a migration strategy before doing schema changes that require data preservation.
- `uv` may not be installed; fallback to `pip install -r requirements.txt` (generate via `uv export` if needed) or run `python -m uvicorn main:app --reload`.
- No formal frontend test setup in 05_design yet; consider adding Vitest + React Testing Library for regression coverage.

If anything here is unclear or you'd like the AI to prefer different conventions (migrations, testing strategy, package manager), tell me which parts to change.
