import { getTranslations } from "next-intl/server";

import NewsSection from "@/components/widgets/NewsSection";

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NewsPage" });

  return (
    <div className="text-white pt-8 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-red-500">{chunks}</span>
              ),
            })}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </header>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">{t("cinema")}</h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <NewsSection query={t("cinemaQuery")} locale={locale} />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">{t("tvSeries")}</h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <NewsSection query={t("tvSeriesQuery")} locale={locale} />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">{t("celebrities")}</h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <NewsSection query={t("celebritiesQuery")} locale={locale} />
        </section>
      </div>
    </div>
  );
}
