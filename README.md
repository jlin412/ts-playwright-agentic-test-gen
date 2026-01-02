# Playwright tests (API + UI)

This folder contains a minimal Playwright test runner setup with two smoke suites:

- `specs/api`: API smoke tests using Playwright `request`
- `specs/e2e`: UI smoke tests using a real browser

## Prereqs

Start the stack from the repo root:

```bash
docker compose up -d --build
```

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

## Run

```bash
npm test
npm run test:api
npm run test:ui
```

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
