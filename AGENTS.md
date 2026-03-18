# Repository Guidelines

## Project Structure & Module Organization
- `AI_Carreer_FE/` contains the Vite + React frontend. Key paths: `AI_Carreer_FE/src/app/pages` (screens like Assessment/Results), `AI_Carreer_FE/src/app/components` (reusable UI), `AI_Carreer_FE/src/app/routes.tsx` (route map), and `AI_Carreer_FE/apps/api/src` (DDD-style API contracts and domain interfaces).
- `AI_Carreer/` contains the Python backend. Core paths: `AI_Carreer/src/domain`, `AI_Carreer/src/application`, `AI_Carreer/src/infrastructure`, `AI_Carreer/src/interfaces/http`, plus `AI_Carreer/run_api.py` (FastAPI entrypoint) and `AI_Carreer/embed.py` with `AI_Carreer/data.json`, `AI_Carreer/data_2.json`, and `AI_Carreer/chroma_db/` for the local Chroma store.

## Build, Test, and Development Commands
- Frontend install: `cd AI_Carreer_FE` then `npm install`.
- Frontend dev server: `npm run dev` (Vite hot reload).
- Frontend build: `npm run build` (production bundle).
- Backend deps: `cd AI_Carreer` then `python -m pip install -r requirements.txt`.
- Build embeddings: `python embed.py` (creates/updates `AI_Carreer/chroma_db/`).
- Run API: `python run_api.py` (FastAPI server).

## Coding Style & Naming Conventions
- TypeScript/React uses 2-space indentation, `PascalCase` for components, `camelCase` for variables/functions, and `.tsx` for React components.
- Python uses 4-space indentation and `snake_case`; keep DDD boundaries clean across `domain`, `application`, `infrastructure`, and `interfaces`.
- No formatter or linter is configured; follow existing file style to avoid noisy diffs.

## Testing Guidelines
- No automated test framework or coverage targets are configured yet (no `test` scripts in `package.json` and no `pytest` config).
- If adding tests, introduce a clear runner and document the command in this file and `package.json` or a backend README.

## Commit & Pull Request Guidelines
- This workspace does not include `.git`, so there is no commit convention to mirror. Use concise, imperative messages; prefer Conventional Commits (`feat:`, `fix:`, `chore:`) when starting new history.
- PRs should include a short summary, scope (FE/BE), testing notes, and UI screenshots for frontend changes. Link any related issue or spec.

## Security & Configuration Tips
- Store API keys and runtime config in `AI_Carreer/.env`; do not commit real keys.
- Treat `AI_Carreer/chroma_db/` as generated content; re-run `python embed.py` after data changes.
