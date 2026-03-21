# Playwright tests (API + UI)

This folder contains a minimal Playwright test runner setup with two smoke suites:

- `specs/api`: API smoke tests using Playwright `request`
- `specs/e2e`: UI smoke tests using a real browser

## Prereqs

- Docker and Docker Compose
- Node.js 20+

## Backend + Frontend Without Copying Code

This repository is designed to treat backend/frontend as Git submodules so you can run everything from `playwright-tests` without duplicating source files.

From the `playwright-tests/` repository root:

```bash
git submodule add <backend-repo-url> backend
git submodule add <frontend-repo-url> frontend
git submodule update --init --recursive
```

If cloning fresh:

```bash
git clone --recurse-submodules <playwright-tests-repo-url>
```

## Start App Stack (from playwright-tests)

Use the local compose file:

```bash
docker compose up -d --build
```

The compose file expects:

- `./backend` (submodule)
- `./frontend` (submodule)

Database and JWT env values are already set in `docker-compose.yml` defaults.

Default URLs:

- API: `http://localhost:3000`
- UI: `http://localhost:8080`

Override if needed:

- `API_URL=http://localhost:3000`
- `UI_URL=http://localhost:8080`

## Install

From `playwright-tests/`:

```bash
npm install
npm run install:browsers
```

## Run Specs

### Execute All Specs

```bash
npm test
```

Runs all test suites across all projects (API, UI-Chromium, UI-Firefox, UI-webkit).

### Execute API Specs Only

```bash
npm run test:api
```

Runs `specs/api/smoke.spec.ts` — tests backend endpoints using Playwright `request` against `http://localhost:3000`.

### Execute UI Specs Only

```bash
npm run test:ui
```

Runs `specs/e2e/smoke.spec.ts` across all three browsers (Chromium, Firefox, WebKit) against `http://localhost:8080`.

Browser-specific:
```bash
npm run test:ui:chromium
npm run test:ui:firefox
npm run test:ui:webkit
```

### Note on Trace Specs

The file `specs/e2e/trace-fail.spec.ts` contains intentionally failing tests (marked `test.skip`). These are skipped by default but used to validate Playwright trace/screenshot capture. To enable them, modify the spec file.

## Playwright-BDD

BDD feature files live under `bdd/features/` with step definitions in `bdd/steps/`.

Generate + run smoke scenarios:

```bash
npm run test:bdd
```

Run the intentional failing BDD scenario (for trace/screenshot artifacts):

```bash
npm run test:bdd:tracefail
```

## Playwright MCP

This repo is already configured for VS Code MCP at `.vscode/mcp.json` using `@playwright/mcp`.
That MCP server is for agent-driven browser interaction (useful for exploring flows and then turning them into tests).

There is also a local MCP server at `playwright-tests/mcp/playwright-mcp-server.mjs` that can generate test code, but it requires `OPENAI_API_KEY`.
