import {
  at,
  collection,
  type DemoTitle,
  genres,
  keywords,
  lang,
  movies,
  people,
  series,
  titles,
} from "./demoData.ts";
import { DEMO_PROVIDERS } from "./providers.ts";

const PAGE_SIZE = 20;
// Big Buck Bunny, by the Blender Foundation (CC BY 3.0)
const FREE_TRAILER = "aqz-KE-bpKQ";

const image = (kind: string, id: number, part?: number) =>
  `/demo-${kind}-${id}${part === undefined ? "" : `-${part}`}.svg`;

const genreList = (locale: string) =>
  genres.map(([id, ...name]) => ({ id, name: name[lang(locale)] }));

function summary(t: DemoTitle, locale: string) {
  const name = t.title[lang(locale)];
  return {
    id: t.id,
    media_type: t.kind,
    ...(t.kind === "movie"
      ? { title: name, release_date: t.date }
      : { name, first_air_date: t.date }),
    overview: t.overview[lang(locale)],
    genre_ids: t.genres,
    poster_path: t.hasPoster ? image("poster", t.id) : null,
    backdrop_path: t.hasBackdrop ? image("backdrop", t.id) : null,
    vote_average: t.average,
    vote_count: t.votes,
    popularity: t.popularity,
  };
}

function page<T>(items: T[], params: URLSearchParams) {
  const current = Math.max(Number(params.get("page")) || 1, 1);
  return {
    page: current,
    results: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    total_pages: Math.max(Math.ceil(items.length / PAGE_SIZE), 1),
    total_results: items.length,
  };
}

const byPopularity = (a: DemoTitle, b: DemoTitle) => b.popularity - a.popularity;
const byRating = (a: DemoTitle, b: DemoTitle) => b.average - a.average;
const byDate = (a: DemoTitle, b: DemoTitle) => b.date.localeCompare(a.date);

// Date ranges are ignored, except whole decades: the catalogue does not move
// with the calendar
function discover(list: DemoTitle[], params: URLSearchParams) {
  const genre = Number(params.get("with_genres"));
  const providers = params.get("with_watch_providers")?.split("|").map(Number);
  const keyword = Number(params.get("with_keywords"));
  const minVotes = Number(params.get("vote_count.gte"));
  const until =
    params.get("primary_release_date.lte") ?? params.get("first_air_date.lte");
  const decade = until?.match(/^(\d{3})9-12-31$/)?.[1];
  const maxRuntime = Number(params.get("with_runtime.lte"));

  return list
    .filter((t) => !genre || t.genres.includes(genre))
    .filter((t) => !providers || t.providers.some((p) => providers.includes(p)))
    .filter((t) => !keyword || t.index % keywords.length === keyword - 5001)
    .filter((t) => t.votes >= minVotes)
    .filter((t) => !decade || t.date.startsWith(decade))
    .filter((t) => !maxRuntime || t.runtime <= maxRuntime)
    .sort(
      params.get("sort_by") === "vote_average.desc" ? byRating : byPopularity
    );
}

function person(index: number) {
  const p = people[index];
  return {
    id: p.id,
    name: p.name,
    profile_path: p.hasPhoto ? image("person", p.id) : null,
    known_for_department: p.department,
  };
}

const CHARACTERS = ["Ada", "The Captain", "Mr. Pell", "Nico", "The Archivist", "Dr. Sorrel", "Wren", "The Neighbour"];

function credits(t: DemoTitle) {
  const [director, writer, ...cast] = t.people;
  return {
    cast: cast.map((index, k) => ({
      ...person(index),
      credit_id: `${t.id}-c${index}`,
      character: at(CHARACTERS, t.index + k),
    })),
    crew: [
      [director, "Director", "Directing"],
      [writer, "Screenplay", "Writing"],
    ].flatMap(([index, job, department]) =>
      index === undefined
        ? []
        : [{ ...person(index as number), credit_id: `${t.id}-${job}`, job, department }]
    ),
  };
}

function seasonSummary(t: DemoTitle, number: number, locale: string) {
  return {
    id: t.id * 100 + number,
    season_number: number,
    name: locale === "it" ? `Stagione ${number}` : `Season ${number}`,
    episode_count: 4 + ((t.index + number) % 5),
    poster_path: t.hasPoster ? image("poster", t.id) : null,
    air_date: t.date,
    overview: t.overview[lang(locale)],
  };
}

function detail(t: DemoTitle, locale: string) {
  const similar = titles
    .filter((x) => x.kind === t.kind && x.id !== t.id)
    .filter((x) => x.genres.some((g) => t.genres.includes(g)));
  const offers = DEMO_PROVIDERS.filter((p) => t.providers.includes(p.id)).map(
    (p) => ({ provider_id: p.id, provider_name: p.name, logo_path: p.logo })
  );
  const region = { flatrate: offers, ...(t.index % 3 === 0 && { rent: offers.slice(0, 1) }) };
  const { cast, crew } = credits(t);
  const saga = collection.parts.includes(t)
    ? {
        id: collection.id,
        name: collection.name[lang(locale)],
        poster_path: image("poster", collection.parts[0].id),
      }
    : null;

  return {
    ...summary(t, locale),
    genres: genreList(locale).filter((g) => t.genres.includes(g.id)),
    homepage: "",
    external_ids: {},
    credits: { cast, crew },
    videos: {
      results: t.hasTrailer
        ? [{ key: FREE_TRAILER, site: "YouTube", type: "Trailer", iso_639_1: "en" }]
        : [],
    },
    recommendations: {
      results: similar.slice(0, 10).map((x) => summary(x, locale)),
    },
    reviews: {
      results:
        t.index % 2 === 0
          ? ["demo_viewer", "row_seven_fan"].map((author, i) => ({
              id: `${t.id}-${i}`,
              author,
              content: `An invented review for an invented title. ${t.overview[0]}`,
              created_at: "2026-03-1" + i + "T10:00:00.000Z",
              author_details: { rating: 7 + i, avatar_path: null },
            }))
          : [],
    },
    "watch/providers": { results: { IT: region, US: region } },
    ...(t.kind === "movie"
      ? {
          runtime: t.runtime,
          belongs_to_collection: saga,
          release_dates: {
            results: ["IT", "US"].map((iso_3166_1) => ({
              iso_3166_1,
              release_dates: [{ certification: iso_3166_1 === "IT" ? "T" : "PG-13" }],
            })),
          },
          keywords: { keywords },
        }
      : {
          number_of_seasons: t.seasons,
          seasons: [...Array(t.seasons).keys()].map((i) =>
            seasonSummary(t, i + 1, locale)
          ),
          created_by: crew.slice(0, 1),
          content_ratings: {
            results: ["IT", "US"].map((iso_3166_1) => ({
              iso_3166_1,
              rating: iso_3166_1 === "IT" ? "T" : "TV-14",
            })),
          },
          keywords: { results: keywords },
        }),
  };
}

function seasonDetail(t: DemoTitle, number: number, locale: string) {
  const season = seasonSummary(t, number, locale);
  return {
    ...season,
    episodes: [...Array(season.episode_count).keys()].map((i) => ({
      id: season.id * 100 + i,
      episode_number: i + 1,
      name: `${locale === "it" ? "Episodio" : "Episode"} ${i + 1}`,
      overview: i % 4 === 3 ? "" : at(titles, t.index + i).overview[lang(locale)],
      still_path: i % 5 === 4 ? null : image("still", t.id, number * 10 + i),
      air_date: t.date,
      vote_average: 6 + ((i * 7) % 30) / 10,
      runtime: i % 6 === 5 ? null : 38 + i,
    })),
  };
}

function personDetail(index: number, locale: string) {
  const p = people[index];
  const cast = titles.flatMap((t) =>
    credits(t)
      .cast.filter((c) => c.id === p.id)
      .map((c) => ({ ...summary(t, locale), character: c.character }))
  );
  const crew = titles.flatMap((t) =>
    credits(t)
      .crew.filter((c) => c.id === p.id)
      .map((c) => ({ ...summary(t, locale), job: c.job, department: c.department }))
  );
  return {
    ...person(index),
    biography: p.biography[lang(locale)],
    birthday: p.birthday,
    deathday: null,
    place_of_birth: at(["Verano", "Port Marlow", "Ombra"], index),
    homepage: "",
    external_ids: {},
    images: { profiles: p.hasPhoto ? [{ file_path: image("person", p.id) }] : [] },
    translations: {
      translations: [{ iso_639_1: "en", data: { biography: p.biography[0] } }],
    },
    combined_credits: { cast, crew },
  };
}

function search(type: string, params: URLSearchParams, locale: string) {
  const query = (params.get("query") ?? "").toLowerCase();
  const year =
    params.get("primary_release_year") ?? params.get("first_air_date_year");
  const found = titles
    .filter((t) => type === "multi" || t.kind === type)
    .filter((t) => t.title.some((x) => x.toLowerCase().includes(query)))
    .filter((t) => !year || t.date.startsWith(year))
    .sort(byPopularity)
    .map((t) => summary(t, locale));
  const persons =
    type === "multi"
      ? people
          .filter((p) => p.name.toLowerCase().includes(query))
          .map((p) => ({ ...person(p.index), media_type: "person" }))
      : [];
  return [...found, ...persons];
}

// Answers like TMDB, from invented data. Returns null for what does not exist
export function demoResponse(path: string, locale: string): unknown {
  const { pathname, searchParams } = new URL(path, "http://demo");
  const [first, second, third, fourth] = pathname.split("/").filter(Boolean);
  const list = (items: DemoTitle[]) =>
    page(items.map((t) => summary(t, locale)), searchParams);
  const pool = second === "tv" || first === "tv" ? series : movies;

  if (first === "genre") return { genres: genreList(locale) };
  if (first === "discover") return list(discover(pool, searchParams));
  if (first === "search") return page(search(second, searchParams, locale), searchParams);
  if (first === "trending") {
    const items = second === "all" ? titles : pool;
    return list([...items].sort((a, b) => ((a.index * 5) % 7) - ((b.index * 5) % 7)));
  }

  if (first === "movie" || first === "tv") {
    if (second === "popular") return list([...pool].sort(byPopularity));
    if (second === "top_rated") return list(pool.filter((t) => t.votes > 300).sort(byRating));
    if (second === "upcoming") return list([...pool].sort(byDate));

    const title = pool.find((t) => t.id === Number(second));
    if (!title) return null;
    if (third !== "season") return detail(title, locale);
    const number = Number(fourth);
    return number >= 1 && number <= title.seasons
      ? seasonDetail(title, number, locale)
      : null;
  }

  if (first === "person") {
    const found = people.find((p) => p.id === Number(second));
    return found ? personDetail(found.index, locale) : null;
  }
  if (first === "keyword") return keywords.find((k) => k.id === Number(second)) ?? null;
  if (first === "collection" && Number(second) === collection.id) {
    const parts = collection.parts.map((t) => summary(t, locale));
    return {
      id: collection.id,
      name: collection.name[lang(locale)],
      overview: collection.parts[0].overview[lang(locale)],
      poster_path: parts[0].poster_path,
      backdrop_path: parts[0].backdrop_path,
      parts,
    };
  }
  return null;
}

export function demoNews(locale: string) {
  return [...Array(6).keys()].map((i) => {
    const name = at(titles, i * 4).title[lang(locale)];
    return {
      title:
        locale === "it"
          ? `"${name}": una notizia inventata per la demo`
          : `"${name}": an invented story for the demo`,
      link: `#news-${i}`,
      pubDate: `2026-04-1${i}T09:00:00Z`,
      source: at(["Demo Times", "Invented Post", "Row Daily"], i),
    };
  });
}
