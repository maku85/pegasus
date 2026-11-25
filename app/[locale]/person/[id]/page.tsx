import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { FaChevronLeft } from "react-icons/fa";

import BackLink from "@/components/layout/BackLink";
import Filmography from "@/components/media/Filmography";
import ScrollRow from "@/components/media/ScrollRow";
import Biography from "@/components/widgets/Biography";
import NewsSection from "@/components/widgets/NewsSection";
import SocialLinks from "@/components/widgets/SocialLinks";
import { buildFilmography, mostVoted } from "@/lib/credits";
import { openGraph, pageTitle } from "@/lib/metadata";
import { DAY, requireIds, tmdbFetch, tmdbImage } from "@/lib/tmdb";

interface PersonPageProps {
  params: Promise<{ id: string; locale: string }>;
}

function getPerson(id: string, locale: string) {
  requireIds(id);
  return tmdbFetch(
    `/person/${id}?append_to_response=combined_credits,images,external_ids,translations`,
    locale,
    7 * DAY
  );
}

const englishBiography = (person: any): string | undefined =>
  person.translations?.translations?.find((x: any) => x.iso_639_1 === "en")
    ?.data?.biography;

export async function generateMetadata({ params }: PersonPageProps) {
  const { id, locale } = await params;
  const person = await getPerson(id, locale);
  return {
    title: pageTitle(person.name),
    openGraph: openGraph(locale, person.profile_path),
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "PersonPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const person = await getPerson(id, locale);

  const filmography = buildFilmography(
    person.combined_credits,
    person.known_for_department
  );
  const knownFor = mostVoted(filmography, 10);

  const biography =
    person.biography || (locale === "it" && englishBiography(person));

  const images = person.images || {};

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
              ? tmdbImage(person.profile_path, "w185")
              : ""
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/90 pointer-events-none" />

      <div className="relative w-full z-10 pt-6 md:pt-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <BackLink
            fallback="/movies"
            className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white transition-colors bg-black/30 px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
          >
            <FaChevronLeft /> {t("back")}
          </BackLink>

          <div className="grid grid-cols-[7rem_minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[24rem_minmax(0,1fr)] md:grid-rows-[auto_1fr] gap-x-5 md:gap-x-12 lg:gap-x-16 gap-y-6 md:gap-y-8 items-start">
            <div className="md:row-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 md:border-4 border-white/10 aspect-[2/3]">
              <img
                src={tmdbImage(person.profile_path, "h632")}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="self-center text-3xl sm:text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl break-words">
              {person.name}
            </h1>

            <div className="col-span-2 md:col-span-1 space-y-6 md:space-y-8">
              <div className="flex flex-wrap gap-4 text-gray-300">
                {person.birthday && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                    <span className="block text-xs text-gray-300 uppercase font-bold mb-1">
                      {t("birth")}
                    </span>
                    <span className="font-medium text-white">
                      {formatDate(person.birthday)}
                      {person.place_of_birth && ` ${t("bornIn")} ${person.place_of_birth}`}
                      {!person.deathday &&
                        ` (${getAge(person.birthday)} ${t("years")})`}
                    </span>
                  </div>
                )}
                {person.deathday && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                    <span className="block text-xs text-gray-300 uppercase font-bold mb-1">
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
                  <span className="block text-xs text-gray-300 uppercase font-bold mb-1">
                    {t("profession")}
                  </span>
                  <span className="font-medium text-white">
                    {t.has(`departments.${person.known_for_department}`)
                      ? t(`departments.${person.known_for_department}`)
                      : person.known_for_department}
                  </span>
                </div>
              </div>

              <SocialLinks
                external_ids={person.external_ids}
                homepage={person.homepage}
                kind="name"
              />

              {biography && (
                <Biography
                  text={biography}
                  isEnglish={!person.biography}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[86rem] mx-auto px-6 md:px-12 mt-16 space-y-16 relative z-10">
        {knownFor.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("knownFor")}
            </h2>
            <ScrollRow label={t("knownFor")}>
              {knownFor.map((item) => (
                <Link
                  prefetch={false}
                  href={
                    item.media_type === "tv"
                      ? `/tv/${item.id}`
                      : `/movies/${item.id}`
                  }
                  key={`${item.media_type}-${item.id}`}
                  className="flex-shrink-0 w-40 group"
                >
                  <div className="w-40 h-60 rounded-2xl overflow-hidden mb-4 relative shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <img
                      src={tmdbImage(item.poster_path, "w342")}
                      alt=""
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-sm truncate group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.media_type === "movie"
                      ? tCommon("movie")
                      : tCommon("tvSeries")}{" "}
                    {item.roles.length > 0 &&
                      `• ${[
                        ...new Set(
                          item.roles.map((role) =>
                            t.has(`jobs.${role}`) ? t(`jobs.${role}`) : role
                          )
                        ),
                      ].join(", ")}`}
                  </p>
                </Link>
              ))}
            </ScrollRow>
          </section>
        )}

        {filmography.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("fullFilmography")}
            </h2>
            <Filmography
              sections={filmography}
              today={new Date().toISOString().slice(0, 10)}
            />
          </section>
        )}

        {images.profiles && images.profiles.length > 1 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("gallery")}
            </h2>
            <ScrollRow label={t("gallery")}>
              {images.profiles.slice(1, 15).map((img: any, index: number) => (
                <div
                  key={img.file_path}
                  className="flex-shrink-0 w-48 h-72 rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-white/5 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <img
                    src={tmdbImage(img.file_path, "w500")}
                    alt={`${person.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </ScrollRow>
          </section>
        )}

        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl empty:hidden">
          <NewsSection query={person.name} locale={locale} />
        </div>

      </div>
    </div>
  );
}
