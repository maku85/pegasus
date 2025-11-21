import { tmdbFetch, tmdbImage } from "@/lib/tmdb";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebook, FaImdb, FaGlobe, FaChevronLeft } from "react-icons/fa";
import NewsSection from "@/components/widgets/NewsSection";

interface PersonPageProps {
  params: { id: string };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;

  // Fetch person details with all necessary appended data
  const person = await tmdbFetch(
    `/person/${id}?language=it-IT&append_to_response=combined_credits,images,external_ids`
  );

  const { combined_credits, images, external_ids } = person;

  // Sort credits by popularity for "Known For"
  const knownFor = combined_credits.cast
    .sort((a: any, b: any) => b.vote_count - a.vote_count)
    .slice(0, 10);

  // Sort credits by date for Filmography (newest first)
  const filmography = combined_credits.cast
    .filter((item: any) => item.release_date || item.first_air_date)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || a.first_air_date);
      const dateB = new Date(b.release_date || b.first_air_date);
      return dateB.getTime() - dateA.getTime();
    });

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate age
  const getAge = (birthDate: string, deathDate?: string) => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - start.getFullYear();
    const m = end.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      {/* FIXED BACKGROUND */}
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-20 blur-3xl scale-110"
        style={{
          backgroundImage: knownFor[0]?.backdrop_path
            ? `url(${tmdbImage(knownFor[0].backdrop_path, "original")})`
            : 'none',
          backgroundColor: !knownFor[0]?.backdrop_path ? '#141414' : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

      {/* Navigation */}
      <div className="absolute top-0 left-0 p-6 z-50">
        <Link
          href="/movies"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
        >
          <FaChevronLeft /> Torna indietro
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative w-full z-10">
        {/* Background Gradient/Pattern since people usually don't have backdrops */}
        <div className="absolute inset-0 h-[500px] bg-gradient-to-b from-gray-800/50 to-[#141414] opacity-50" />
        <div className="absolute inset-0 h-[500px] bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

        <div className="container mx-auto px-4 pt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                <img
                  src={person.profile_path ? tmdbImage(person.profile_path, "w500") : "/images/placeholders/person-placeholder.jpg"}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6 bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-4 shadow-lg">
                {external_ids.instagram_id && (
                  <a href={`https://instagram.com/${external_ids.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors text-2xl"><FaInstagram /></a>
                )}
                {external_ids.twitter_id && (
                  <a href={`https://twitter.com/${external_ids.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"><FaTwitter /></a>
                )}
                {external_ids.facebook_id && (
                  <a href={`https://facebook.com/${external_ids.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors text-2xl"><FaFacebook /></a>
                )}
                {external_ids.imdb_id && (
                  <a href={`https://www.imdb.com/name/${external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors text-2xl"><FaImdb /></a>
                )}
                {person.homepage && (
                  <a href={person.homepage} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-2xl"><FaGlobe /></a>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-8">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl">{person.name}</h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-300">
                {person.birthday && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                    <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Nascita</span>
                    <span className="font-medium text-white">
                      {formatDate(person.birthday)}
                      {person.place_of_birth && ` a ${person.place_of_birth}`}
                      {!person.deathday && ` (${getAge(person.birthday)} anni)`}
                    </span>
                  </div>
                )}
                {person.deathday && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                    <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Morte</span>
                    <span className="font-medium text-white">
                      {formatDate(person.deathday)}
                      {person.birthday && ` (${getAge(person.birthday, person.deathday)} anni)`}
                    </span>
                  </div>
                )}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg">
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Conosciuto per</span>
                  <span className="font-medium text-white">{person.known_for_department}</span>
                </div>
              </div>

              {/* Biography */}
              {person.biography && (
                <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl text-left">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                    Biografia
                  </h3>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line max-w-3xl">
                    {person.biography || "Nessuna biografia disponibile."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 mt-16 space-y-16 relative z-10">

        {/* Known For */}
        {knownFor.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              Conosciuto per
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {knownFor.map((item: any) => (
                <Link
                  href={item.media_type === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`}
                  key={item.id}
                  className="flex-shrink-0 w-40 group"
                >
                  <div className="w-40 h-60 rounded-2xl overflow-hidden mb-4 relative shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <img
                      src={item.poster_path ? tmdbImage(item.poster_path, "w342") : "/images/placeholders/poster-placeholder.jpg"}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-sm truncate group-hover:text-yellow-400 transition-colors">
                    {item.title || item.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.media_type === "movie" ? "Film" : "Serie TV"} • {item.character ? item.character : "Cast"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Photos */}
        {images.profiles && images.profiles.length > 1 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
              Galleria
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {images.profiles.slice(1, 15).map((img: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-48 h-72 rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-white/5 hover:border-purple-500/50 transition-all duration-300">
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

        {/* NEWS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <NewsSection query={person.name} />
        </div>

        {/* Full Filmography */}
        <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
            Filmografia Completa
          </h2>
          <div className="bg-black/20 rounded-2xl p-2 backdrop-blur-sm border border-white/5">
            <div className="space-y-1">
              {filmography.map((item: any, index: number) => (
                <Link
                  href={item.media_type === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`}
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/5"
                >
                  <div className="w-14 h-14 flex-shrink-0 text-gray-400 font-mono text-sm flex items-center justify-center bg-white/5 rounded-lg border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                    {item.release_date ? item.release_date.split("-")[0] : (item.first_air_date ? item.first_air_date.split("-")[0] : "-")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">
                      {item.title || item.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {item.character ? <span className="text-gray-300">{item.character}</span> : <span className="italic text-gray-500">Ruolo sconosciuto</span>}
                    </p>
                  </div>
                  <div className="text-xs font-bold uppercase px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 border border-white/5">
                    {item.media_type === "movie" ? "Film" : "TV"}
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
