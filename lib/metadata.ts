import { tmdbImage } from "./image";

export const pageTitle = (title: string) => `${title} – Row Seven`;

export const yearSuffix = (date?: string) =>
  date ? ` (${date.slice(0, 4)})` : "";

// Title and description are left out on purpose: Next copies the page's own
export function openGraph(locale: string, tmdbPath?: string | null) {
  return {
    siteName: "Row Seven",
    type: "website" as const,
    locale: locale === "en" ? "en_US" : "it_IT",
    images: [
      tmdbPath
        ? { url: tmdbImage(tmdbPath, "w1280") }
        : {
            url: `/images/og-${locale === "en" ? "en" : "it"}.png`,
            width: 1200,
            height: 630,
            alt: "Row Seven",
          },
    ],
  };
}
