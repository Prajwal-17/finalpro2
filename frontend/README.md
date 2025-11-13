# Shield 360 Frontend

Lightweight Vite + React workspace implementing the Shield 360 experience
blueprinted in the design prompts.

## Available Routes

- `/home` – hero, feature overview, recent articles, and community CTA  
- `/about` – mission/vision summary plus condensed feature highlights  
- `/discover` – 2×2 feature grid detailing platform pillars  
- `/awareness` – SOS references, legal notes, and placeholder awareness content  
- `/news` – newsroom feed backed by temporary mock data  
- `/login` – role selection cards for parents, teachers, and children  
- `/register` – parent-focused registration card with simple form state

The root path (`/`) redirects to `/home`. Shared navigation (navbar/footer) is
wired across every page.

## Development

```bash
npm install
npm run dev
```

Tailwind CSS powers the styling. Colours and tokens are extended under
`tailwind.config.js`.

## Backend Integration

- `src/lib/fetchJson.js` wraps `window.fetch` for JSON APIs. It powers the dummy
  data loading in the News and Register pages.
- The Django backend now lives in `../backend` and exposes `/api/health/`,
  `/api/news`, `/api/login`, and `/api/register`.
- Vite proxies `/api/*` requests to `http://localhost:8000` during `npm run dev`
  (see `vite.config.js`), so run both servers for end-to-end behaviour.
- Contact navigation links still point to placeholders (`#contact`) until the
  dedicated route/content is supplied.
