import { unstable_cache } from "next/cache";
import Parser from "rss-parser";

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  contentSnippet?: string;
}

// An error is thrown, not returned, so it is never cached
const fetchFeed = unstable_cache(
  async (feedUrl: string) => {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, 6).map((item) => ({
      title: item.title,
      source: item.source as string | undefined,
      contentSnippet: item.contentSnippet,
      link: item.link,
      pubDate: item.pubDate,
    }));
  },
  ["google-news"],
  { revalidate: 3600 }
);

export async function getNews(
  query: string,
  locale: string = "it"
): Promise<NewsItem[]> {
  if (process.env.DEMO === "1") {
    const { demoNews } = await import("./demo");
    return demoNews(locale);
  }

  try {
    const hl = locale === "en" ? "en-US" : "it";
    const gl = locale === "en" ? "US" : "IT";
    const ceid = locale === "en" ? "US:en" : "IT:it";

    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
    const items = await fetchFeed(feedUrl);

    return items.map((item) => {
      let title = item.title || "Senza titolo";
      let source = item.source || "Google News";
      let contentSnippet = item.contentSnippet;
      const lastDashIndex = title.lastIndexOf(" - ");
      if (lastDashIndex !== -1) {
        source = title.substring(lastDashIndex + 3);
        title = title.substring(0, lastDashIndex);
      }

      if (contentSnippet) {
        const cleanSnippet = contentSnippet.replace(/\n/g, " ").trim();
        const cleanTitle = title.trim();
        if (
          cleanSnippet.includes(cleanTitle) ||
          cleanSnippet.length < cleanTitle.length + 20
        ) {
          contentSnippet = undefined;
        }
      }

      return {
        title,
        link: item.link || "#",
        pubDate: item.pubDate || "",
        source,
        contentSnippet,
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
