# Playwright Test Runner + BDD Framework

This repository demonstrates a practical automation framework that runs both API and UI tests against a RealWorld sample app. It includes classic Playwright specs and Playwright-BDD (Gherkin) scenarios, plus reporting and trace artifacts for debugging.

## Quick Navigation

- [What This Repo Is Trying To Do](#what-this-repo-is-trying-to-do)
- [Project Structure](#project-structure)
- [Stack and Tooling](#stack-and-tooling)
- [How The Framework Was Created](#how-the-framework-was-created)
- [Setup and Run](#setup-and-run)
- [Test Execution Matrix](#test-execution-matrix)
- [Running Tests in Docker](#running-tests-in-docker)
- [Debugging: UI Mode and Trace Viewer](#debugging-ui-mode-and-trace-viewer)
- [Reports and Debug Artifacts](#reports-and-debug-artifacts)

## What This Repo Is Trying To Do

The goal is to provide a clean, interview-ready example of how to build and run a modern Playwright-based automation framework:

- Validate backend health quickly through API smoke checks.
- Validate critical frontend rendering through cross-browser UI smoke checks.
- Show maintainable framework design using fixtures, Page Object Model (POM), and service abstractions.
- Support both spec-style and BDD-style test authoring.
- Produce reports and trace artifacts that make failures easy to investigate.

## Project Structure

Key folders:

- `specs/api` - Playwright API smoke specs.
- `specs/e2e` - Playwright UI smoke specs.
- `specs/fixtures.ts` - Shared test fixtures (`homePage`, `tagsApi`).
- `pom` - UI Page Object Model classes (for example, `home.page.ts`).
- `som` - API service-style abstractions (for example, `tags.api.ts`).
- `bdd/features` - Gherkin feature files.
- `bdd/steps` - Step definitions/hooks for BDD.
- `playwright-report` - Playwright HTML report output.
- `cucumber-report` - Cucumber-style report output and trace artifacts.

## Stack and Tooling

- Playwright Test (API + UI)
- Playwright-BDD / Cucumber-style workflows
- TypeScript
- Docker Compose for local app stack
- RealWorld backend/frontend as submodules

Framework creation workflow and tools used:

- VS Code for project structure, scripts, and execution workflow.
- GitHub Copilot for accelerating scaffolding, refactors, and iteration.
- Playwright MCP server for browser-flow exploration that can be translated into automated tests.

## How The Framework Was Created

High-level process:

1. Scaffolded Playwright projects and command matrix for API/UI/BDD runs.
2. Added reusable fixtures in `specs/fixtures.ts` for dependency injection.
3. Implemented POM for UI assertions in `pom/home.page.ts`.
4. Implemented API abstraction in `som/tags.api.ts` with readiness polling and response validation helpers.
5. Added BDD feature files and step bindings for equivalent smoke coverage.
6. Enabled report/trace workflows to improve failure diagnosis.
7. Kept test scope intentionally small (smoke-focused) to maximize signal and maintainability.

## Prerequisites

- Docker and Docker Compose
- Node.js 20+

## Setup and Run

### 1) Initialize backend/frontend submodules

From the `playwright-tests/` repository root:

```bash
git submodule update --init --recursive
```

If cloning fresh:

```bash
git clone --recurse-submodules <playwright-tests-repo-url>
```

Optional: if you want to use your own backend/frontend forks, update submodule URLs before running the init command:

```bash
git submodule set-url backend <your-backend-fork-url>
git submodule set-url frontend <your-frontend-fork-url>
git submodule update --init --recursive
```

### 2) Start the app stack

```bash
docker compose up -d --build
```

`docker-compose.yml` expects:

- `./backend`
- `./frontend`

### 3) Install test dependencies

```bash
npm install
npm run install:browsers
```

### 4) Base URLs and environment variables

Default URLs:

- API: `http://localhost:3000`
- UI: `http://localhost:8080`

Overrides:

- `API_URL=http://localhost:3000`
- `UI_URL=http://localhost:8080`
- `CI=true` (enables CI-oriented Playwright behavior)
- `OPENAI_API_KEY=<your-key>` (required only for local MCP code-generation server usage)

> Security note: `OPENAI_API_KEY` is a secret credential. Do **not** commit this value or any `.env` file containing it to version control. Prefer setting it via your shell environment locally (for example, `export OPENAI_API_KEY=...`) and via your CI/CD platform's secret manager in automation (for example, GitHub Actions secrets, GitLab CI variables, etc.).
## Test Execution Matrix

### Run all specs

```bash
npm test
```

Runs API + UI projects.

### Run API specs only

```bash
npm run test:api
```

### Run UI specs only

```bash
npm run test:ui
```

Browser-specific UI:

```bash
npm run test:ui:chromium
npm run test:ui:firefox
npm run test:ui:webkit
```

### Run BDD specs

Generate + run smoke BDD scenarios:

```bash
npm run test:bdd
```

BDD subsets:

```bash
npm run test:bdd:api
npm run test:bdd:ui
npm run test:bdd:ui:chromium
npm run test:bdd:ui:firefox
npm run test:bdd:ui:webkit
```

Run intentional BDD failure scenario for trace/screenshot artifact validation:

```bash
npm run test:bdd:tracefail
```

## Running Tests in Docker

### Local Docker Testing

Tests can run inside Docker containers, which ensures a consistent, reproducible environment. This is useful for verifying tests work the same way they will run in CI.

Start the full Docker stack including tests:

```bash
docker compose --profile tests up --build
```

The `--profile tests` flag activates the Playwright test service (not enabled by default locally). This command:

- Starts the backend, frontend, and database services as normal.
- Starts a Playwright container that runs `npm test` (traditional specs + API tests).
- Mounts volumes for reports and test results so you can inspect them on your host after completion.

### Docker vs. Local Test Execution

| Aspect | Local (Host) | Docker |
|--------|------|--------|
| **Speed** | Faster (no container overhead) | ~10-20s slower (container startup) |
| **Environment** | Host-specific (OS, Node version) | Reproducible (Playwright official image) |
| **Use Case** | Development iteration | CI verification, debugging environment differences |
| **Requires** | Node.js 20+, npm | Docker Desktop/Engine only |
| **Browser Install** | Manual via `npm run install:browsers` | Pre-installed in Docker image |

### Docker Test Service Environment

Inside the Docker container, tests communicate with the app stack using Docker network names:

- Backend: `http://backend:3000`
- Frontend: `http://frontend`
- Database: `postgres://realworld:realworld@db:5432/realworld` (via backend)

These are set automatically via environment variables in the Dockerfile and docker-compose.yml, so the same test code works in both local and Docker environments.

### Recommended Docker Commands

Run full tests in Docker (traditional + BDD):

```bash
docker compose --profile tests up --build
```

Run only API tests in Docker:

```bash
docker compose run --profile tests playwright npm run test:api
```

Run only BDD specs in Docker:

```bash
docker compose run --profile tests playwright npm run test:bdd
```

View test results after Docker run:

```bash
# HTML report (tests in browser, full interactivity)
open playwright-report/index.html

# Cucumber BDD report
open cucumber-report/index.html

# View individual traces
open cucumber-report/trace*/index.html
```

### CI/CD Docker Testing

The project includes a GitHub Actions workflow (`test-docker` job) that automatically runs tests in Docker on every push and pull request. Both traditional (ubuntu-latest + host Node) and Docker test jobs run in parallel to catch environment-specific issues early.

To see the Docker test job configuration, inspect `.github/workflows/playwright.yml`.

## Debugging: UI Mode and Trace Viewer

This project supports Playwright-recommended debugging flows for both traditional specs and Playwright-BDD specs.

Reference docs:

- https://playwright.dev/docs/running-tests
- https://playwright.dev/docs/trace-viewer-intro
- https://vitalets.github.io/playwright-bdd/#/guides/debugging
- https://vitalets.github.io/playwright-bdd/#/guides/ui-mode

### UI Mode (Traditional Playwright Specs)

Open all configured projects in UI mode:

```bash
npm run debug:ui
```

Open a focused project in UI mode:

```bash
npm run debug:ui:api
npm run debug:ui:chromium
```

### UI Mode (BDD Specs)

BDD requires generated tests first; these scripts run generation and then start UI mode.

```bash
npm run debug:bdd:ui
npm run debug:bdd:ui:api
npm run debug:bdd:ui:chromium
```

### Trace Recording and Viewing

Current configs already keep trace artifacts on failure (`trace: retain-on-failure`) for both spec styles.

Force traces for every test run:

```bash
npm run debug:trace:on
npm run debug:bdd:trace:on
```

Open a trace zip directly in Trace Viewer:

```bash
npm run debug:trace:open -- path/to/trace.zip
npm run debug:bdd:trace:open -- path/to/trace.zip
```

Tip: you can also open traces from HTML report test details via:

```bash
npm run report
```

## Reports and Debug Artifacts

Playwright HTML report:

```bash
npm run report
```

Cucumber HTML report:

```bash
npm run report:bdd:html
```

Report/output locations:

- `playwright-report/index.html`
- `cucumber-report/index.html`
- `cucumber-report/data/`
- `cucumber-report/trace*/` (trace artifacts from fail/debug scenarios; exact folder name depends on reporter configuration)

## Playwright MCP

This repository supports MCP workflows in two forms:

- VS Code MCP configuration via `.vscode/mcp.json` using `@playwright/mcp` for agent-driven browser interaction.
- Local MCP server at `mcp/playwright-mcp-server.mjs` for test generation experiments (requires `OPENAI_API_KEY`).

