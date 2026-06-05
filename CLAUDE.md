# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install     # Install dependencies (auto-runs nuxt prepare)
pnpm dev         # Start dev server at localhost:3000
pnpm build       # SSR production build
pnpm generate    # Static site generation
pnpm preview     # Preview production build locally
```

No test runner or linter is configured.

## Architecture

**Frontend Aliens** is a Nuxt 3 / Vue 3 educational game where players fix broken HTML, CSS, and JavaScript to "restore the Voyager 1 signal." Built with TypeScript, pnpm, and Vite (via Nuxt).

### Routing

Nuxt file-based routing. Three game levels are at `pages/level/1.vue`, `pages/level/2.vue`, `pages/level/3.vue`. The home page is `pages/index.vue` and victory screen is `pages/finale.vue`.

### Game State

All game state lives in `composables/useGame.ts`, persisted to `localStorage` under key `frontend-aliens-progress`. It is SSR-safe (guards on `typeof window`). Tracks which levels are complete and whether a level can be accessed. All pages consume this composable.

### Level Design Pattern

Each level page follows the same structure:
- A textarea where the player enters corrected code
- A `SignalBar` component showing live progress (0–100%)
- A computed `isCorrect` that normalizes whitespace and compares input to the expected answer
- Hints and test feedback shown reactively

Level 2 uses a regex CSS parser to apply player-entered styles as a live preview. Level 3 uses `new Function()` to sandbox-evaluate user JavaScript against test cases.

### Components

- `StarField.vue` — canvas-based animated starfield background, redraws on window resize
- `NavBar.vue` — sticky header with level progress dots and mission status badge
- `SignalBar.vue` — animated progress bar with four signal states (NO SIGNAL → WEAK → STRONG → LOCK ACQUIRED)

### Styling

Global design tokens are in `assets/css/main.css` as CSS custom properties (navy/orange/gold/green palette; Syne for headings, DM Sans for body, DM Mono for code). Components use scoped styles. Glassmorphism, radial glows, and CSS grid backgrounds are used throughout.
