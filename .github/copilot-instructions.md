## Purpose
Short, opinionated instructions to help an AI coding agent be immediately productive in this repository. This repo is a full-stack product management app: FastAPI backend, Vite/React/Tailwind frontend, Figma-driven UI.

## Quick checklist for contributors
- Repo contains two primary projects: `03_python_fastapi_project` (backend), `05_design` (frontend).
- Backend: FastAPI, async SQLAlchemy, SQLite, Pydantic, CORS for Vite ports, no migrations, `uv` toolchain.
- Frontend: Vite + React + TypeScript + Tailwind, custom tokens, dialogs/cards per Figma, utility classes in `styles.css`.

## How to run (concrete commands / examples)
- Backend: from `03_python_fastapi_project` run:
  - `uv sync` (install deps via `uv` if available)
  - `uv run uvicorn main:app --reload` (dev server, auto-reload, http://localhost:8000)
  - Production: `uv run uvicorn main:app --host 0.0.0.0 --port 8000`
  - DB tables auto-created on startup (`main.py` lifespan -> `create_tables()`).

- Frontend: from `05_design` run:
  - `npm install` then `npm run dev` (default port 5173)
  - Build: `npm run build`; Preview: `npm run preview`
  - Uses Tailwind tokens, dialogs/cards per Figma, utility classes in `styles.css`

## Key patterns & integration points
- Backend config: `03_python_fastapi_project/config.py` uses `pydantic-settings` and `.env` (`DATABASE_URL`, `APP_NAME`, `DEBUG`).
- DB: async SQLAlchemy + SQLite, no migrations, schema created at runtime (`create_tables()`).
- API: REST endpoints under `/products/` and `/basket/` (`main.py`), CORS for Vite ports (5173+).
- Frontend: fetches from `http://localhost:8000/products/` and `http://localhost:8000/basket/` (`api.ts`).
- Tailwind tokens/radii match Figma spec (`tailwind.config.js`).
- Utility classes for buttons, inputs, icons in `src/styles.css`.

### Database Models
- `Product`: id, name, price, description, stock (existing)
- `BasketItem`: id, product_id (FK), quantity, product (relationship) (NEW - implemented)

### 05_design UI specifics
- Product list uses cards only (no table), action buttons row (View/Edit/Delete) at bottom.
- **Basket functionality**: Each product card has a Plus (+) button in top-right corner for adding to basket.
- **Basket display**: Fixed position basket widget in bottom-left corner showing items, quantities, and total.
- Details dialog: fixed width 444px, heading "Product Details", product name, description, separator, two-column Price/Stock, Product ID below.
- Add/Edit/Delete dialogs: styled to Figma spec (custom radii, icon button for close, warning icon for delete).
- Shadows: layered subtle elevation (`shadow-sm` base, stronger on hover), custom box-shadows for dialogs.

### Tailwind design tokens (05_design / tailwind.config.js)
- Colors: `muted #717182`, `destructive #D4183D`, `ink.{900,950}`, `primary` scale (50–950).
- Radii: `rounded-btn 6.75px`, `rounded-card 12.75px`, `rounded-cardsm 8.75px`.
- Font sizes: `xs2 11.3px`, `sm2 12.8px`, `base2 13.2px`, plus ad-hoc 14px/16px inline utilities.
- Utility classes in `src/styles.css`: `.btn-primary`, `.btn-outline`, `.btn-danger`, `.icon-btn`, `.input`.

### TypeScript / parsing note
- 05_design uses TypeScript (`tsconfig.json`). If you see parser errors like `Unexpected token :` for type annotations, ensure Vite is running from the `05_design` directory. If friction persists, temporarily remove explicit type annotations in `App.tsx` and rely on JSDoc until tooling is fixed.

### Common UI adjustments tasks
- Adjust card spacing/shadows: edit `ProductCards.tsx` & tailwind classes.
- Modify dialog layout: edit `App.tsx` (modal instances) or `Modal.tsx` for container shell.
- Update tokens: edit `05_design/tailwind.config.js` and restart dev server.
- Form validation logic: `components/ProductForm.tsx` (inline simple validation). Consider migrating to a schema validator if complexity grows.

### Basket System Implementation (COMPLETED)
- **Backend**: Full basket API with endpoints for add/get/update/remove/clear operations
  - `POST /basket/` - Add items to basket (handles existing item quantity updates)
  - `GET /basket/` - Retrieve basket contents with product relationships
  - `PUT /basket/{item_id}` - Update item quantities
  - `DELETE /basket/{item_id}` - Remove specific items
  - `DELETE /basket/` - Clear entire basket
- **Frontend**: Complete basket UI integration
  - Plus (+) buttons on each product card for adding to basket
  - Fixed position basket widget in bottom-left corner
  - Real-time quantity management with +/- controls
  - Total price calculation and item count display
  - Stock validation (prevents adding out-of-stock items)
  - Clear basket and individual item removal
- **Database**: `BasketItem` model with foreign key to `Product`, auto-created tables
- **State Management**: React state with refresh keys for real-time updates between components

## Developer conventions to follow
- Use the `uv` toolchain for Python deps when present: `uv sync`, `uv run ...` (see README and pyproject).
- Async DB usage: prefer async SQLAlchemy session (`AsyncSession`) and `get_db()` dependency from `database.py` for request-scoped sessions.
- No migrations: update models and recreate DB if schema changes. If you need migrations, ask about Alembic.

## Files to consult when making changes
- Backend: `main.py`, `database.py`, `config.py`, `pyproject.toml`, `app.db` (runtime DB file).
- Frontend: `src/*`, `package.json`, `tailwind.config.js`, `styles.css`, `vite.config.ts`, `index.html`.
- Components: `ProductCards.tsx` (with basket add buttons), `Basket.tsx` (basket widget), `ProductForm.tsx`, `Modal.tsx`.
- Types: `types.ts` includes `Product`, `BasketItem`, `BasketItemCreate`, `BasketItemUpdate` interfaces.
- API: `api.ts` includes both product and basket API functions.
- Issues: `issues/issue-1.md` contains Figma design links and requirements.

## When you edit code, run these quick checks
- Backend smoke: start server (`uv run uvicorn main:app --reload`), curl `GET /` to verify.
- Frontend smoke: `npm run dev` from `05_design`, open `http://localhost:5173`.
- Backend tests: `uv run pytest` from `03_python_fastapi_project` (pytest in dev extras in `pyproject.toml`).

## Examples of actionable tasks an AI agent can do first
- Implement a new product field: update backend `Product` model, adjust Pydantic DTOs, verify `create_tables()` creates the new column (note: SQLite + create_all may silently skip some changes).
- Add a new endpoint: follow patterns in `main.py` (use `AsyncSession` via `Depends(get_db)`, `select()` queries, `response_model`).
- Add a field & propagate to 05_design UI (update backend Product + DTOs, then adjust `types.ts`, `ProductForm.tsx`, card display, details dialog).
- Refine dialog sizing/tokens (update tailwind config + component classes, verify in browser).
- Add skeleton loading to ProductCards (replace initial Loading text with skeleton components using pulse animation).
- Enhance basket functionality: add checkout process, persist basket to user session, add basket item validation.
- Improve basket UI: add animations for add/remove actions, show toast notifications, implement quantity input validation.

## Limitations / things to ask the human
- No migration tool (Alembic) present — ask whether to add one before schema changes that require data preservation.
- `uv` may not be installed; fallback to `pip install -r requirements.txt` (generate via `uv export` if needed) or run `python -m uvicorn main:app --reload`.
- No formal frontend test setup in 05_design yet; consider adding Vitest + React Testing Library for regression coverage.
- Current branch is `feature/1-basket-feature` (basket/cart functionality is fully implemented and working).

If anything here is unclear or you'd like the AI to prefer different conventions (migrations, testing strategy, package manager), tell me which parts to change.
