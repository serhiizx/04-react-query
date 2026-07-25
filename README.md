# Movie Search

A single-page app for searching movies by keyword through the
[TMDB API](https://www.themoviedb.org/). Results are rendered as a grid of cards
with pagination; clicking a card opens a modal with the overview, release date
and rating.

Course project for "Advanced Front-End Engineering with React" — practice with
TanStack Query: response caching, loading/error states, and pagination that
keeps the previous page visible while the next one loads.

## Features

- Movie search by query string (TMDB `/search/movie`)
- Caching keyed by `["movies", query, page]` — revisiting a page is served from
  cache instead of refetching
- Pagination via `react-paginate` with `placeholderData: keepPreviousData`, so
  the grid does not flash between pages
- Modal built on a React Portal: closes on `Escape`, on backdrop click and via
  the close button; locks body scroll while open
- `react-hot-toast` notifications for an empty query and for empty results
- Dedicated `Loader` and `ErrorMessage` states
- Lazy-loaded posters (`loading="lazy"`)
- React Compiler (`babel-plugin-react-compiler`) for automatic memoization

## Stack

| Layer     | Technologies                            |
| --------- | --------------------------------------- |
| UI        | React 19, CSS Modules, modern-normalize |
| Data      | TanStack Query 5, axios                 |
| Build     | Vite 7, TypeScript 6                    |
| Quality   | ESLint 10 (typescript-eslint), Prettier |
| Deploy    | Vercel + GitHub Actions                 |

## Requirements

- Node.js 20.19+ (required by Vite 7)
- pnpm 10 (the repo ships a `pnpm-lock.yaml`)
- A TMDB Read Access Token — [get one in the API settings](https://www.themoviedb.org/settings/api)

## Installation

```bash
git clone https://github.com/serhiizx/04-react-query.git
cd 04-react-query
pnpm install
cp .env.example .env.local
```

Put your token into `.env.local`, then start the dev server:

```bash
pnpm dev
```

The app will be available at http://localhost:5173.

## Environment variables

| Variable          | Required | Purpose                                                             |
| ----------------- | -------- | ------------------------------------------------------------------- |
| `VITE_TMDB_TOKEN` | yes      | TMDB Read Access Token (v4), sent as `Authorization: Bearer`         |
| `VITE_BASE_PATH`  | no       | Build base path (`base` in `vite.config.ts`). Defaults to `/`        |

`VITE_BASE_PATH` matters when the app is served from a subdirectory (GitHub
Pages, for example); on Vercel it can be left unset.

## Scripts

| Command        | What it does                                        |
| -------------- | --------------------------------------------------- |
| `pnpm dev`     | Dev server with HMR                                 |
| `pnpm build`   | Type-check (`tsc -b`) and production build to `dist/` |
| `pnpm preview` | Serve the built bundle locally                      |
| `pnpm lint`    | Run ESLint over the project                         |
| `pnpm format`  | Format the codebase with Prettier                   |

## Project structure

```
src/
├── components/
│   ├── App/           # Search state, useQuery, screen composition
│   ├── SearchBar/     # Search form (form action), empty-query validation
│   ├── MovieGrid/     # Card grid, movie selection
│   ├── MovieModal/    # Modal rendered through createPortal
│   ├── Loader/        # Loading indicator
│   └── ErrorMessage/  # Request error message
├── services/
│   └── movieService.ts  # fetchMovies(query, page) → axios call to TMDB
├── types/
│   └── movie.ts         # Movie, MoviesHttpResponse
└── main.tsx             # QueryClientProvider, app mount
```

## Usage

The TMDB request is encapsulated in a single function:

```ts
import fetchMovies from "./services/movieService";

const { results, total_pages } = await fetchMovies("blade runner", 1);
```

Wiring it into TanStack Query — the key includes both the query and the page
number, so every page is cached separately:

```tsx
const { data, isLoading, isError, isSuccess } = useQuery({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: query !== "",
  placeholderData: keepPreviousData,
});
```

`enabled: query !== ""` prevents any request before the first search.

## Deployment

Automatic deployment to Vercel is wired up in `.github/workflows/vercel.yml`:

- push to `main` → production (`vercel deploy --prod`)
- pull request → preview deployment
- one deployment per branch at a time; in-flight runs are cancelled

Required GitHub repository secrets:

| Secret              | Where it comes from                        |
| ------------------- | ------------------------------------------ |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens         |
| `VERCEL_ORG_ID`     | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |

`VITE_TMDB_TOKEN` is configured in the Vercel project settings — the workflow
pulls it in during the `vercel pull` step.

## License

[MIT](LICENSE) © 2026 Serhii Zhdaniuk

Movie data provided by TMDB. This project is not affiliated with or endorsed by TMDB.
