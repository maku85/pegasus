import { getTranslations } from "next-intl/server";

import { getNews } from "@/lib/news";

interface NewsSectionProps {
  query: string;
  locale?: string;
}

export default async function NewsSection({
  query,
  locale = "it",
}: NewsSectionProps) {
  const t = await getTranslations({ locale, namespace: "NewsSection" });
  const news = await getNews(query, locale);
  if (news.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-red-500 rounded-full"></span>
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#1a1a1a] rounded-2xl overflow-hidden transition-all duration-300 shadow hover:scale-[1.02] h-full flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-red-500 transition-colors text-lg">
                {item.title}
              </h3>
              {item.contentSnippet && (
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                  {item.contentSnippet}
                </p>
              )}
              <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                <span>
                  {new Date(item.pubDate).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-red-500 font-medium text-[10px] uppercase tracking-wider">
                  {item.source}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
