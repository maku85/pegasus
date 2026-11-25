import { getTranslations } from "next-intl/server";
import { FaStar } from "react-icons/fa";

import MovieCard from "@/components/media/MovieCard";
import { pageTitle } from "@/lib/metadata";
import { DAY, requireIds, tmdbFetch, tmdbImage } from "@/lib/tmdb";

interface CollectionPageProps {
  params: Promise<{ id: string; locale: string }>;
}

function getCollection(id: string, locale: string) {
  requireIds(id);
  return tmdbFetch(`/collection/${id}`, locale, 7 * DAY);
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { id, locale } = await params;
  const collection = await getCollection(id, locale);
  return {
    title: pageTitle(collection.name),
    description: collection.overview || undefined,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "CollectionPage" });

  const collection = await getCollection(id, locale);

  const parts =
    collection.parts?.sort((a: any, b: any) => {
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return (
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      );
    }) || [];

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${tmdbImage(
            collection.backdrop_path,
            "w300"
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

      <div className="relative w-full z-10 pt-8 md:pt-16 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          <div className="flex-shrink-0 w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group mx-auto md:mx-0">
            <img
              src={tmdbImage(collection.poster_path, "w500")}
              alt={collection.name}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <p className="text-xl text-yellow-500 font-medium uppercase tracking-widest">
              {t("label")}
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl leading-tight">
              {collection.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base font-medium text-gray-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                <FaStar className="text-yellow-400" />
                <span>{t("count", { count: parts.length })}</span>
              </div>
            </div>

            {collection.overview && (
              <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl max-w-3xl">
                <p className="text-lg text-gray-200 leading-relaxed">
                  {collection.overview}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
          {t("parts")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {parts.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} media_type="movie" />
          ))}
        </div>
      </div>
    </div>
  );
}
