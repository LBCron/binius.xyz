# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two things:

- A documentation website for Binius, built with [Vocs](https://vocs.dev) (a React-based documentation framework). The site is deployed to GitHub Pages and serves as the main documentation hub at binius.xyz.
- The **Binius64 whitepaper**, a LaTeX document in `whitepaper/` (entry point `whitepaper/main.tex`) that is the canonical protocol specification. Eventually the `docs/pages/blueprint/` website pages will be an HTML render of the whitepaper, but that integration does not exist yet.

**The whitepaper is currently more up-to-date and authoritative than the `docs/pages/blueprint/` markdown pages.** When the two disagree on protocol details (notation, constraint system, reductions, ZK construction), treat the whitepaper as the source of truth.

## Development Commands

```bash
# --- Website ---
# Start development server
npm run dev

# Build the documentation site
npm run build

# Preview production build
npm run preview

# Run the Playwright smoke test (needs a prior build, see below).
# Browsers come from the nix dev shell (flake.nix); run via `nix develop`.
# Without nix, run `npx playwright install chromium` once instead.
nix develop -c npm test

# --- Whitepaper ---
# Build the PDF (runs pdflatex + biber via the Makefile)
cd whitepaper && make
```

## Architecture & Structure

### Core Technologies
- **Framework**: Vocs (React-based documentation framework)
- **Math Rendering**: KaTeX for mathematical formulas via remark-math and rehype-katex
- **Styling**: Tailwind CSS v4
- **Build System**: Vite with custom plugins
- **Whitepaper**: LaTeX, built with `pdflatex` and `biber` (a development dependency for the whitepaper only; e.g. from a TeX Live distribution)

### Documentation Organization
The documentation is organized into four main sections:
- **Basics** (`/basics`): Overview, concepts, roadmap, licensing, and resources
- **Building** (`/building`): Tutorials and guides for building with Binius64, including theory, constraints, control flow patterns
- **Blueprint** (`/blueprint`): Deep technical documentation on math background, constraint systems, and backend implementation
- **Benchmarks** (`/benchmarks`): Performance benchmarks and AWS deployment guides

### Key Files
- `vocs.config.tsx`: Main configuration defining navigation, sidebar structure, and markdown processing
- `docs/pages/`: MDX documentation files organized by section
- `docs/components/`: Custom React components (LandingPage, BenchmarkTable, Collapsible, ArrowIcon)
- `docs/styles.css`: Global styles and Tailwind configuration
- `whitepaper/main.tex`: The Binius64 whitepaper / canonical protocol specification
- `whitepaper/bibliography.bib`: Whitepaper references
- `whitepaper/Makefile`: Builds `main.pdf` via `pdflatex` and `biber`

## Important Configuration

### Git Hooks
The project uses [pre-commit](https://pre-commit.com) for managing git hooks:
- **pre-push**: Runs `npm run build`, then `npm test` (the Playwright smoke test, which serves the built `docs/dist` via `vocs preview` and checks every page, so it must run after the build). Run the push inside `nix develop` so Playwright finds its browsers.

These ensure the site builds and renders cleanly before code is pushed. The smoke test's `@playwright/test` version is pinned exactly to the nixpkgs `playwright-driver` version; bump them together.

To set up the hooks, install pre-commit and run:
```bash
pre-commit install --hook-type pre-commit --hook-type pre-push
```

### Vocs Configuration Notes
- Custom Vite plugin disables the `llms` plugin to avoid build errors
- Math support enabled through remark-math and rehype-katex plugins
- Google Analytics tracking configured (G-TV9S6QP84Y)
- Content width set to 70ch for optimal reading

## Deployment
- Pushes to the `main` branch trigger automatic deployment to GitHub Pages via the `.github/workflows/deploy.yml` workflow
- The workflow builds the site (`npm run build`, uploading `docs/dist`) and separately builds the whitepaper PDF as a dated downloadable artifact
- The `build` job installs TeX Live because `npm run build` compiles the whitepaper (`make -C whitepaper`) and copies it to `docs/public/spec.pdf`, served at `/spec.pdf`