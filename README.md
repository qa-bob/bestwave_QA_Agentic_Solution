# Bestwave — QA Agentic Solution

> Automated QA framework for [Bestwave](https://www.bestwave.com/) built with Playwright + TypeScript.

---

## Purpose

This repository demonstrates an **AI-assisted QA automation workflow** in which Claude Code (Anthropic's CLI) analyzes a live website and generates a complete, maintainable test suite from scratch — with no manual selector work or boilerplate required.

The framework targets [bestwave.com](https://www.bestwave.com/) and covers smoke, navigation, forms, functional, visual regression, and responsive layout testing across desktop, mobile, and tablet viewports. It is built as a reusable template for the broader **Phoenix Startup QA Agentic Solutions** project, where the same workflow is applied to a portfolio of B2B SaaS sites.

---

## Maintainer

| | |
|---|---|
| **Name** | Bob Small |
| **Email** | [rlsmall@cox.net](mailto:rlsmall@cox.net) |
| **LinkedIn** | [linkedin.com/in/bob-small-194a077](https://www.linkedin.com/in/bob-small-194a077/) |

---

## Company Profile

| Field | Details |
|-------|---------|
| **Company** | Bestwave |
| **Description** | Digital signage software |
| **Website** | [https://www.bestwave.com/](https://www.bestwave.com/) |
| **LinkedIn** | [View Profile](https://www.linkedin.com/company/best-wave/) |
| **City** | Phoenix |
| **Founded** | 2000 |
| **Funding** | Self-funded |
| **Employees** | 1–10 |
| **Leaders** | John Glitsos (Founder) |

---

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation (Chromium, mobile, tablet)
- TypeScript (strict mode) — strongly typed test code
- Page Object Model — one class per page/section in `src/pages/`
- AI-assisted test generation via Claude Code

---

## Prerequisites

- **Node.js** v18 or later ([download](https://nodejs.org/))
- **npm** v9 or later (bundled with Node)
- Network access to `https://www.bestwave.com`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<org>/bestwave_QA_Agentic_Solution.git
cd bestwave_QA_Agentic_Solution
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

`--with-deps` also installs required OS-level libraries (needed on Linux/CI). On Windows/Mac you can omit it if you already have Chrome installed.

### 4. Verify the site config

Open `site.config.json` and confirm the `url` field points to the target site:

```json
{
  "url": "https://www.bestwave.com",
  ...
}
```

You can override the URL at runtime without editing the file:

```bash
SITE_URL=https://staging.bestwave.com npm test
```

### 5. Run the tests

```bash
# Full suite (all browsers & viewports)
npm test

# Quick smoke check
npm run test:smoke

# Specific tag
npm run test:navigation
npm run test:forms
npm run test:visual
npm run test:responsive
```

### 6. View the HTML report

```bash
npm run report
```

This opens the Playwright HTML report from the last run at `playwright-report/index.html`.

---

## Visual Regression Baselines

Visual tests compare screenshots against stored baselines in `__snapshots__/`. On a fresh clone the baselines do not exist yet — generate them before running visual tests:

```bash
npm run baseline
```

Re-run this command whenever intentional UI changes are made that should become the new baseline.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run the full test suite |
| `npm run test:smoke` | `@smoke` tests — availability and page load |
| `npm run test:navigation` | `@navigation` tests — nav links, routing, menus |
| `npm run test:forms` | `@forms` tests — field interactions and validation |
| `npm run test:visual` | `@visual` tests — screenshot regression |
| `npm run test:responsive` | `@responsive` tests — layout across viewports |
| `npm run test:headed` | Run with visible browser window |
| `npm run baseline` | Update visual regression snapshots |
| `npm run report` | Open the HTML test report |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript compile check (no emit) |

---

## Project Structure

```
site.config.json          # Target URL and feature flags
playwright.config.ts      # Playwright projects: desktop, mobile, tablet
global-setup.ts           # Reachability check before suite runs
src/
  pages/
    base.page.ts          # BasePage base class
    home.page.ts
    navigation.page.ts
    contact.page.ts
    <page>.page.ts        # One class per additional page/section
  fixtures/
    site.fixture.ts       # Custom fixtures exposing page objects
  utils/
    link-checker.ts
    visual-helper.ts
  types/
    site-config.types.ts
tests/
  smoke/                  # @smoke
  navigation/             # @navigation
  forms/                  # @forms
  functional/             # @functional
  visual/                 # @visual
  responsive/             # @responsive
__snapshots__/            # Visual regression baselines (generated)
playwright-report/        # HTML report (generated)
test-results/             # Artifacts: screenshots, videos, traces (generated)
```

---

## Claude Code Slash Commands

If you are using Claude Code (the CLI), these project commands are available:

| Command | Description |
|---------|-------------|
| `/analyze-site` | Inspect the live site and report pages, forms, and elements |
| `/generate-full-suite` | Generate a complete POM + test suite from the live site |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a test results summary |

---

*Part of the Phoenix Startup QA Agentic Solutions project.*
