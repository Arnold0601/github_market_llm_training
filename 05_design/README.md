# 05_design

Product management frontend (design-focused) using React + Vite + Tailwind CSS targeting the FastAPI backend in `03_python_fastapi_project`.

## Development

1. Install dependencies:
```bash
npm install
```
2. Start dev server (5174):
```bash
npm run dev
```
3. Backend FastAPI server must be running on http://localhost:8000

## Tailwind
Tailwind is configured via `tailwind.config.js` and `postcss.config.js`. Utility classes plus a few component-style classes defined in `src/styles.css` using `@apply`.
