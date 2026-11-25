import { getTranslations } from "next-intl/server";
import { FaArrowRight } from "react-icons/fa";

import { getNews } from "@/lib/news";
import { Link } from "@/i18n/routing";

export default async function HomeNewsWidget({
  locale = "it",
}: {
  locale?: string;
}) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tWidget = await getTranslations({
    locale,
    namespace: "HomeNewsWidget",
  });
  const news = await getNews(t("newsQuery"), locale);
  if (news.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
          <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
          {tWidget("title")}
        </h2>
        <Link
          href="/news"
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
        >
          {tWidget("viewAll")} <FaArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.slice(0, 4).map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#1a1a1a] rounded-2xl overflow-hidden transition-all duration-300 shadow hover:scale-[1.02] h-full flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-500 transition-colors text-lg">
                {item.title}
              </h3>
              {item.contentSnippet && (
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                  {item.contentSnippet}
                </p>
              )}
              <div className="text-xs text-gray-300 mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                <span>
                  {new Date(item.pubDate).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-yellow-400 font-medium text-[10px] uppercase tracking-wider">
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
