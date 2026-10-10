# klr.dev (kylegrantlucas.github.io)

Personal site. Astro static build deployed to GitHub Pages (Fastly CDN in front), plus `currently-into/`, a Fastly Compute (JS) service aggregating Last.fm, Letterboxd and Hardcover data.

## Layout
- `src/pages/*.astro`: index, work, projects. `src/utils/resume.js` fetches `resume.json` from `kylegrantlucas/resume` **main** at build time (no local copy).
- `currently-into/`: Fastly Compute app (`src/index.js`, `fastly.toml` holds the service_id, `justfile`).
- `.github/workflows/build-and-deploy.yml`: builds on push to main, on `repository_dispatch: resume-generated` (sent by the resume repo), or manually.

## Commands (verified in `nix develop`)
- Site: `npm ci && npm run build` → `dist/`. `npm run dev` for local.
- currently-into: `cd currently-into && just build` (→ `bin/main.wasm`), `just dev` (local server), `just deploy`, `just push-secrets STORE_ID`.

## Invariants
- Node major is 22 in both `flake.nix` (`nodejs_22`) and CI (`setup-node`). Bump both together.
- npm is the package manager (`package-lock.json`); `pnpm-lock.yaml` is stale.
- Git remote is `git@github.com:kylegrantlucas/kylegrantlucas.github.io.git` (repo was renamed from `kylelucas.io`).

## Secrets
- `LASTFM_API_KEY`, `HARDCOVER_TOKEN` live in 1Password (vault Private, items `kylelucas.io - LASTFM_API_KEY` / `kylelucas.io - HARDCOVER_TOKEN`).
- Compute reads them from the config store named `secrets`. Locally, `just dev` renders `secrets.json` from `secrets.tpl.json` via `op inject` and deletes it on exit; `secrets.json` is gitignored. Never commit it.
- Production: `just push-secrets <store-id>` pipes `op read` into `fastly config-store-entry update --stdin`.
