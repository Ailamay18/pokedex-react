# Pokédex — Field Scanner (Vite + React)

A proper React project this time: components, a build tool, hot reload —
everything you'd want if you're going to keep developing this or deploy it.

Pulls **live data** from the real [PokéAPI](https://pokeapi.co/api/v2/pokemon/)
— real sprites, real stats, real Pokédex descriptions.

## Setup

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This outputs a static, optimized site into `dist/`, which you can deploy
anywhere that serves static files — Vercel, Netlify, GitHub Pages, S3, etc.
To preview the production build locally:

```bash
npm run preview
```

## Project structure

```
pokedex-vite/
├── index.html            Vite entry HTML
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           Mounts the React app
    ├── App.jsx            Top-level state: fetching, search, filters
    ├── api.js             PokeAPI fetch helpers
    ├── constants.js       Type colors, stat labels, API config
    ├── styles.css         All styling
    └── components/
        ├── TopBar.jsx      Search bar + type filter chips
        ├── Card.jsx        Grid card
        ├── Detail.jsx      Click-through detail modal
        └── Boot.jsx        Loading / error screen
```

## Features

- Fetches the first 151 Pokémon (Gen I) from PokeAPI on load, in small
  concurrent batches, with a live loading progress bar
- White cards with official artwork, drop shadows, and a staggered
  fade-in entrance animation
- Search by name and filter chips by type
- Click any card for a flip-in detail panel with artwork, a live
  description (fetched on demand from the species endpoint), height/weight,
  and animated stat bars

## Customizing

- To load more Pokémon (e.g. Gen I + II), change `GEN1_LIMIT` in
  `src/constants.js`.
- Colors, fonts, and animations all live in `src/styles.css`.
