# Row Seven

*The best seat for movies and TV.*

A website, in English and Italian, to discover movies, TV series and people,
see where to watch them and keep a watchlist. Data comes from
[TMDB](https://www.themoviedb.org). No account is needed: the watchlist stays
in the visitor's browser.

## Features

- Popular, trending and top-rated lists, filtered by genre and by streaming
  service (Italy for Italian, United States for English)
- Search by title or person, with type, year and rating filters
- Details with cast, trailers, reviews and streaming providers
- Random pick by genre and year
- Watchlist with file export and import
- News from Google News
- Installable on phone and desktop (it needs a connection to work)

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl,
Framer Motion. Biome for linting.

## Run it locally

You need Node.js 22, pnpm 11 and a free [TMDB API key or read access
token](https://www.themoviedb.org/settings/api).

```bash
pnpm install
echo "TMDB_TOKEN=your_token" > .env
pnpm dev
```

Open <http://localhost:3000>.

| Variable     | Required | Value                                         |
| ------------ | -------- | --------------------------------------------- |
| `TMDB_TOKEN` | yes      | v4 read access token or v3 key, used server-side only |

| Command      | What it does          |
| ------------ | --------------------- |
| `pnpm dev`   | Development server    |
| `pnpm build` | Production build      |
| `pnpm start` | Serve the build       |
| `pnpm lint`  | Biome linter          |
| `pnpm test`  | Unit tests (`lib/`)   |

## Project layout

| Path                     | Content                                            |
| ------------------------ | -------------------------------------------------- |
| `app/[locale]/`          | Pages                                              |
| `app/api/`               | Endpoints the browser calls; they query TMDB       |
| `components/`, `hooks/`  | UI and client state                                |
| `lib/tmdb.ts`            | The only place that calls TMDB                     |
| `lib/params.ts`          | Validation of user input before it reaches TMDB    |
| `messages/`              | Translations; keep both files in sync              |
| `netlify/edge-functions/`| Per-IP rate limits                                 |

## Deploy on Netlify

Import the repository and set `TMDB_TOKEN`; no other setting is required.

- `/api/*` allows 60 requests per minute per IP, detail pages 120.
- TMDB responses are cached for 24 hours, and for 7 days on movie, series,
  person and collection pages.
- Links to detail pages are not prefetched on purpose: a list would otherwise
  send dozens of requests and hit the limit.
- `public/robots.txt` keeps crawlers out of detail pages to save TMDB calls.
- `public/sw.js` removes the service worker of an earlier version. Keep it.
- The watchlist is tied to the site address: changing it empties every
  visitor's list.

## Credits

This website uses TMDB and the TMDB APIs but is not endorsed, certified, or
otherwise approved by TMDB. Streaming data is provided by JustWatch.
