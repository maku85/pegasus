interface Video {
  key: string;
  site: string;
  type: string;
  iso_639_1: string | null;
}

// The page's language first, then whatever there is; trailers before teasers
export function pickTrailer(videos: Video[] | undefined, locale: string) {
  const score = (video: Video) =>
    (video.iso_639_1 === locale ? 2 : 0) + (video.type === "Trailer" ? 1 : 0);

  return (videos ?? [])
    .filter(
      ({ site, type }) =>
        site === "YouTube" && (type === "Trailer" || type === "Teaser")
    )
    .sort((a, b) => score(b) - score(a))[0];
}
