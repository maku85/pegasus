// The part of TMDB's combined_credits that is used here
export interface TmdbCredit {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  character?: string;
  department?: string;
  job?: string;
}

export interface Credit {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  roles: string[];
}

export interface CreditSection {
  // A TMDB department, or "Self" for appearances as themselves
  key: string;
  credits: Credit[];
}

const ACTING = "Acting";
const SELF = "Self";
const MAIN_DEPARTMENTS = [ACTING, "Directing", "Writing", "Production"];

const isSelf = (character = "") =>
  /^(self|himself|herself|themsel(f|ves))\b/i.test(character);

function sectionRank(key: string, mainDepartment: string) {
  if (key === mainDepartment) return -1;
  if (key === SELF) return Number.POSITIVE_INFINITY;
  const index = MAIN_DEPARTMENTS.indexOf(key);
  return index === -1 ? MAIN_DEPARTMENTS.length : index;
}

// One section per kind of work, the person's own first; each title appears once
// per section, with all its roles, newest first and undated last
export function buildFilmography(
  credits: { cast?: TmdbCredit[]; crew?: TmdbCredit[] } | undefined,
  mainDepartment: string
): CreditSection[] {
  const sections = new Map<string, Map<string, Credit>>();

  const add = (key: string, raw: TmdbCredit, role?: string) => {
    const section = sections.get(key) ?? new Map<string, Credit>();
    sections.set(key, section);
    const id = `${raw.media_type}-${raw.id}`;
    const credit = section.get(id) ?? {
      id: raw.id,
      media_type: raw.media_type,
      title: raw.title || raw.name || "",
      date: raw.release_date || raw.first_air_date || "",
      poster_path: raw.poster_path ?? null,
      vote_average: raw.vote_average ?? 0,
      vote_count: raw.vote_count ?? 0,
      roles: [],
    };
    if (role && !credit.roles.includes(role)) credit.roles.push(role);
    section.set(id, credit);
  };

  for (const raw of credits?.cast ?? []) {
    add(isSelf(raw.character) ? SELF : ACTING, raw, raw.character);
  }
  for (const raw of credits?.crew ?? []) {
    // A mention in the end titles is not work on the film
    if (raw.job !== "Thanks") add(raw.department || "Crew", raw, raw.job);
  }

  return [...sections]
    .map(([key, section]) => ({
      key,
      credits: [...section.values()].sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    }))
    .sort((a, b) => {
      const rankA = sectionRank(a.key, mainDepartment);
      const rankB = sectionRank(b.key, mainDepartment);
      return rankA === rankB
        ? b.credits.length - a.credits.length
        : rankA - rankB;
    });
}

// The best known titles of the person's main work
export const mostVoted = (sections: CreditSection[], count: number) =>
  [...(sections[0]?.credits ?? [])]
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, count);

// "upcoming", a decade such as "1990", or "undated"
export function creditPeriod(date: string, today: string) {
  if (!date) return "undated";
  return date > today ? "upcoming" : `${date.slice(0, 3)}0`;
}
