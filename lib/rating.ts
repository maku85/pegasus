const MIN_VOTES = 10;

// TMDB uses 0 for "no votes", and a handful of votes says little.
// Saved watchlist items have no count: their rating was already checked
export const formatRating = (average?: number, count?: number) =>
  average && (count === undefined || count >= MIN_VOTES)
    ? average.toFixed(1)
    : null;
