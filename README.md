# Global Conflict Monitor

A Palantir-inspired single-page application that visualizes active world conflicts on an interactive dark-themed map. Built with React, TypeScript, and Leaflet.

**Live demo:** [kontel.github.io/global-conflicts-simple-map](https://kontel.github.io/global-conflicts-simple-map/)

## Features

- **Animated splash screen** with scanning line, rotating ring, hex-node pattern, and loading bar
- **Interactive dark map** (CARTO dark basemap) with pulsing, color-coded conflict markers
- **16 tracked conflicts** across 5 regions with detailed data compiled from open sources
- **Detail panel** slides in on click with situation overview, involved parties, casualty/displacement metrics, intensity rating, and full chronological timeline
- **Filter bar** to narrow by region (Europe, Middle East, Africa, Asia, Americas) and status (Active, Ceasefire, Frozen, Escalating)
- **List view** toggle showing conflicts as a responsive card grid
- **Smooth map animations** using Leaflet's `flyTo` when selecting a conflict
- **Responsive design** that adapts to mobile screens

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Map | Leaflet + react-leaflet |
| Animations | Framer Motion |
| Styling | Vanilla CSS with CSS custom properties |
| Fonts | JetBrains Mono (UI/data) + Inter (body) via Google Fonts |
| Deployment | GitHub Pages via GitHub Actions |

## Project Structure

```
src/
  App.tsx                    # Root component — splash screen -> map transition
  App.css                    # All application styles (splash, map, panel, list, layout)
  index.css                  # CSS reset and design tokens (colors, fonts, variables)
  main.tsx                   # React entry point

  components/
    SplashScreen.tsx          # Animated intro screen with phased reveal
    ConflictMap.tsx            # Main view — Leaflet map, top bar, filters, legend, bottom bar
    ConflictPanel.tsx          # Right-side detail panel with metrics and timeline
    ConflictList.tsx           # Card grid alternative view

  data/
    conflicts.ts              # All conflict data, types, color mappings

.github/
  workflows/
    deploy.yml                # GitHub Actions workflow — pnpm build + Pages deploy
```

## Architecture

The app follows a simple component architecture:

1. **`App`** manages a single `loaded` state. It renders `SplashScreen` until the intro animation completes (~3.4s), then unmounts it and renders `ConflictMap`.

2. **`SplashScreen`** uses a phased animation approach — a `phase` state (0-3) advances on timers, and Framer Motion components react to phase changes with staggered reveals.

3. **`ConflictMap`** is the main orchestrator. It holds the selected conflict, filter states, and view mode (map vs list). The Leaflet map renders `CircleMarker` components for each conflict, styled with CSS pulse animations for a live-monitoring aesthetic.

4. **`ConflictPanel`** receives a conflict object and renders it as a slide-in panel with spring animation. The timeline items animate in sequentially using staggered `delay` values.

5. **`conflicts.ts`** is a self-contained data module exporting typed conflict objects. Each conflict includes coordinates, status, parties, summary text, and a timeline of key events. Adding a new conflict is as simple as adding an entry to the array.

## Running Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building

```bash
pnpm build
```

Output goes to `dist/`.
