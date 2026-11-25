export interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

// Specials (season 0) come after the regular seasons
const position = (season: Season) =>
  season.season_number || Number.POSITIVE_INFINITY;

// Skips announced seasons that have no episodes yet
export function adjacentSeasons(seasons: Season[], current: number) {
  const ordered = seasons
    .filter((s) => s.episode_count > 0 || s.season_number === current)
    .sort((a, b) => position(a) - position(b));
  const index = ordered.findIndex((s) => s.season_number === current);
  if (index === -1) return {};
  return { previous: ordered[index - 1], next: ordered[index + 1] };
}
