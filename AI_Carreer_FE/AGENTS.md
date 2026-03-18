# Repository Guidelines

## Project Structure
- `index.html` is the Vite entry HTML.
- `src/main.tsx` boots the app and loads global styles from `src/styles`.
- `src/app/App.tsx` and `src/app/routes.tsx` define the React Router layout and routes.
- `src/app/pages` contains page-level screens.
- `src/app/components` contains shared components; `src/app/components/ui` holds UI primitives; `src/app/components/figma` holds Figma-specific helpers.
- `src/styles` contains Tailwind v4 setup, theme tokens, and fonts.
- `docs/` holds PDF project notes.

## Build, Test, and Development Commands
- `npm i` installs dependencies.
- `npm run dev` starts the Vite dev server for local development.
- `npm run build` creates a production build in `dist/`.

## Coding Style and Naming Conventions
- TypeScript + React with React Router.
- Use 2-space indentation, double quotes, and semicolons (match existing files).
- Page and component files use `PascalCase.tsx` (for example `Landing.tsx`).
- UI primitives in `src/app/components/ui` use kebab-case filenames (for example `alert-dialog.tsx`).
- Prefer the `@/` alias for imports from `src` (configured in `vite.config.ts`).
- Keep the React and Tailwind plugins in `vite.config.ts` as they are required for this setup.

## Testing Guidelines
- No test framework or `npm test` script is configured yet, and no coverage targets are enforced.
- If you add tests, use `*.test.ts` or `*.test.tsx`, co-locate with the module or add a `tests/` directory, and update `package.json` scripts.

## Commit and Pull Request Guidelines
- No Git history is available in this workspace, so no commit convention is enforced.
- Suggested default: Conventional Commits (`feat:`, `fix:`, `chore:`) with concise summaries.
- PRs should include a short description of changes and screenshots for UI updates.

## Configuration and Assets
- Raw imports for `.svg` and `.csv` are enabled in `vite.config.ts`.
- PDFs in `docs/` are reference material and are not part of the build output.
