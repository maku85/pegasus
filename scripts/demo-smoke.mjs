// Opens the pages of a demo build and checks that they work without TMDB.
// Run it with `pnpm test:demo`, which builds the demo first
import { spawn } from "node:child_process";

const PORT = 3987;
const BASE = `http://localhost:${PORT}`;
const PAGES = [
  "", "/movies", "/tv", "/search", "/search?query=orchard", "/news", "/watchlist",
  "/movies/random", "/movies/1001", "/movies/1006", "/movies/1007", "/movies/1008",
  "/movies/1011", "/movies/1012", "/tv/2001", "/tv/2008", "/tv/2001/season/1",
  "/person/3001", "/person/3005", "/person/3004", "/collection/4001", "/keyword/5001",
];
const APIS = [
  "/api/genres?lang=it", "/api/genres/tv?lang=en",
  "/api/movie-list?lang=it&type=trending&page=1",
  "/api/movie-list?lang=en&type=top_rated&genre=28&providers=1,2&page=1",
  "/api/tv-list?lang=it&type=popular&page=1",
  "/api/search?lang=en&query=orchard&page=1", "/api/random-movie?type=movie",
];

const failures = [];
const check = (ok, what) => {
  if (!ok) failures.push(what);
};

const server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
  // An unusable token: anything that still called TMDB would fail here
  env: { ...process.env, DEMO: "1", TMDB_TOKEN: "demo-must-not-call-tmdb" },
  stdio: "ignore",
  detached: true,
});

try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`${BASE}/robots.txt`).catch(() => null)) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const images = new Set();
  for (const locale of ["it", "en"]) {
    for (const path of PAGES) {
      const url = `/${locale}${path}`;
      const res = await fetch(BASE + url);
      const html = await res.text();
      check(res.status === 200, `${url}: status ${res.status}`);
      // A page that fails while streaming keeps status 200: look for its trace
      check(!/\$RX\(|data-dgst=/.test(html), `${url}: failed while rendering`);
      // The watchlist is drawn by the browser only
      check(/<h1[\s>]/.test(html) || path === "/watchlist", `${url}: no heading`);
      check(!html.includes("image.tmdb.org"), `${url}: uses a TMDB image`);
      check(/<title>[^<]*Row Seven/.test(html), `${url}: no title`);
      for (const [image] of html.matchAll(/\/demo-image\/[\w-]+\.svg/g)) images.add(image);
    }
  }
  for (const path of APIS) {
    const res = await fetch(BASE + path);
    const data = await res.json().catch(() => null);
    check(res.ok && (data?.results?.length || data?.genres?.length || data?.id), `${path}: no data`);
  }
  for (const image of images) {
    const res = await fetch(BASE + image);
    check(res.ok && res.headers.get("content-type") === "image/svg+xml", `${image}: status ${res.status}`);
  }
  const missing = await (await fetch(`${BASE}/it/movies/9`)).text();
  check(missing.includes("NEXT_HTTP_ERROR_FALLBACK;404"), "/it/movies/9: not a 404");

  console.log(`${PAGES.length * 2} pages, ${APIS.length} APIs, ${images.size} images`);
} finally {
  process.kill(-server.pid);
}

for (const failure of failures) console.error(`FAIL ${failure}`);
process.exit(failures.length > 0 ? 1 : 0);
