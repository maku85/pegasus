import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FaChevronLeft } from "react-icons/fa";

import NewsSection from "@/components/widgets/NewsSection";
import { tmdbFetch, tmdbImage } from "@/lib/tmdb";

interface PersonPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "PersonPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const person = await tmdbFetch(
    `/person/${id}?append_to_response=combined_credits,images,external_ids`,
    locale
  );

  const knownFor =
    person.combined_credits?.cast
      ?.sort((a: any, b: any) => b.vote_count - a.vote_count)
      ?.slice(0, 10) || [];

  const images = person.images || {};

  const filmography =
    person.combined_credits?.cast?.sort((a: any, b: any) => {
      const dateA = a.release_date || a.first_air_date || "0000-00-00";
      const dateB = b.release_date || b.first_air_date || "0000-00-00";
      return dateB.localeCompare(dateA);
    }) || [];

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "it-IT",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getAge = (birthDate: string, deathDate?: string) => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - start.getFullYear();
    const m = end.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-20 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${
            person.profile_path
              ? tmdbImage(person.profile_path, "original")
              : ""
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/90 pointer-events-none" />

      <div className="relative w-full z-10 pt-24 md:pt-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-500" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[2/3]">
              <img
                src={
                  person.profile_path
                    ? tmdbImage(person.profile_path, "h632")
                    : "/images/placeholders/person-placeholder.jpg"
                }
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-0 left-0 p-6 z-50">
              <Link
                href="/movies"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
              >
                <FaChevronLeft /> {t("back")}
              </Link>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl">
              {person.name}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-300">
              {person.birthday && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-1">
                    {t("birth")}
                  </span>
                  <span className="font-medium text-white">
                    {formatDate(person.birthday)}
                    {person.place_of_birth && ` a ${person.place_of_birth}`}
                    {!person.deathday &&
                      ` (${getAge(person.birthday)} ${t("years")})`}
                  </span>
                </div>
              )}
              {person.deathday && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-1">
                    {t("death")}
                  </span>
                  <span className="font-medium text-white">
                    {formatDate(person.deathday)}
                    {person.birthday &&
                      ` (${getAge(person.birthday, person.deathday)} ${t(
                        "years"
                      )})`}
                  </span>
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                <span className="block text-xs text-gray-500 uppercase font-bold mb-1">
                  {t("knownFor")}
                </span>
                <span className="font-medium text-white">
                  {person.known_for_department}
                </span>
              </div>
            </div>

            {person.biography && (
              <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl text-left">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                  {t("biography")}
                </h3>
                <p className="text-gray-200 leading-relaxed whitespace-pre-line max-w-3xl">
                  {person.biography || t("noBiography")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 space-y-16 relative z-10">
        {knownFor.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("knownFor")}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {knownFor.map((item: any) => (
                <Link
                  href={
                    item.media_type === "tv"
                      ? `/tv/${item.id}`
                      : `/movies/${item.id}`
                  }
                  key={item.id}
                  className="flex-shrink-0 w-40 group"
                >
                  <div className="w-40 h-60 rounded-2xl overflow-hidden mb-4 relative shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <img
                      src={
                        item.poster_path
                          ? tmdbImage(item.poster_path, "w342")
                          : "/images/placeholders/poster-placeholder.jpg"
                      }
                      alt={item.title || item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-sm truncate group-hover:text-yellow-400 transition-colors">
                    {item.title || item.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.media_type === "movie"
                      ? tCommon("movie")
                      : tCommon("tvSeries")}{" "}
                    • {item.character ? item.character : "Cast"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {images.profiles && images.profiles.length > 1 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
              {t("gallery")}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {images.profiles.slice(1, 15).map((img: any, index: number) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-72 rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-white/5 hover:border-purple-500/50 transition-all duration-300"
                >
                  <img
                    src={tmdbImage(img.file_path, "w500")}
                    alt={`${person.name} photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <NewsSection query={person.name} locale={locale} />
        </div>

        <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
            {t("fullFilmography")}
          </h2>
          <div className="bg-black/20 rounded-2xl p-2 backdrop-blur-sm border border-white/5">
            <div className="space-y-1">
              {filmography.map((item: any, index: number) => (
                <Link
                  href={
                    item.media_type === "tv"
                      ? `/tv/${item.id}`
                      : `/movies/${item.id}`
                  }
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/5"
                >
                  <div className="w-14 h-14 flex-shrink-0 text-gray-400 font-mono text-sm flex items-center justify-center bg-white/5 rounded-lg border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                    {item.release_date
                      ? item.release_date.split("-")[0]
                      : item.first_air_date
                      ? item.first_air_date.split("-")[0]
                      : "-"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">
                      {item.title || item.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {item.character ? (
                        <span className="text-gray-300">{item.character}</span>
                      ) : (
                        <span className="italic text-gray-500">
                          {t("unknownRole")}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-xs font-bold uppercase px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 border border-white/5">
                    {item.media_type === "movie"
                      ? tCommon("movie")
                      : tCommon("tv")}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
