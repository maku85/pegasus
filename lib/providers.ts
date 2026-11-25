export type Region = "IT" | "US";

// The catalogue follows the language, as in the "where to watch" section
export const regionOf = (locale: string): Region =>
  locale === "en" ? "US" : "IT";

export interface Provider {
  id: number;
  name: string;
  logo: string;
}

const NETFLIX = { id: 8, name: "Netflix", logo: "/rK1KljqmbvO9HQa1PBFLILWah72.png" };
const DISNEY = { id: 337, name: "Disney+", logo: "/5eZ872CghnHFLB1j8grszbrx0dx.png" };
const APPLE = { id: 350, name: "Apple TV", logo: "/v9SnyvYt0U3KGgBH3Sbh3z4yODe.png" };
const HBO = { id: 1899, name: "HBO Max", logo: "/skypuy7SXuugIQeYg0IglmzoKaS.png" };
const PRIME_LOGO = "/gMZdpavHmxFNnLpMHwVxfqeux2g.png";

// shortcut: main subscriptions picked by hand, review when services change
// (the full list is TMDB's /watch/providers/movie?watch_region=...)
export const PROVIDERS: Record<Region, Provider[]> = {
  IT: [
    NETFLIX,
    { id: 119, name: "Prime Video", logo: PRIME_LOGO },
    DISNEY,
    HBO,
    { id: 39, name: "NOW", logo: "/oFAnvlaEW2KT6J7XM0DXjlWqKu9.png" },
    APPLE,
    { id: 531, name: "Paramount+", logo: "/pkx3klJlwW5JdtaulvDx6hDNtch.png" },
    { id: 222, name: "RaiPlay", logo: "/7ozv1wBDkjN2LYUQ0sAHElAJ1qg.png" },
  ],
  US: [
    NETFLIX,
    { id: 9, name: "Prime Video", logo: PRIME_LOGO },
    DISNEY,
    HBO,
    { id: 15, name: "Hulu", logo: "/44uAnmSqvA4yBOdbPWN8YgQHjWm.png" },
    APPLE,
    { id: 2303, name: "Paramount+", logo: "/4N4BMd0Mm0kHAmF7RZgL5lW3cwc.png" },
    { id: 386, name: "Peacock", logo: "/a1UIdq5BrkcAxnxcUhFsNbXnxeu.png" },
  ],
};

// One spelling per selection (known ids, in list order): it is a cache key
export function parseProviders(value: string | null, region: Region) {
  const wanted = new Set((value ?? "").split(",").map(Number));
  return PROVIDERS[region].map(({ id }) => id).filter((id) => wanted.has(id));
}
