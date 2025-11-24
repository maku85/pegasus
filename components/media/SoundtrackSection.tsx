import { FaMusic, FaSpotify } from "react-icons/fa";

import { getMovieSoundtrack } from "@/lib/spotify";

interface SoundtrackSectionProps {
  query: string;
}

export default async function SoundtrackSection({
  query,
}: SoundtrackSectionProps) {
  const albums = await getMovieSoundtrack(query);
  if (albums.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#1DB954] rounded-full shadow-[0_0_15px_rgba(29,185,84,0.5)]"></span>
        Soundtrack (Spotify)
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
        {albums.map((album) => (
          <a
            key={album.id}
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-40 md:w-48 group"
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-800 relative flex items-center justify-center shadow-lg border border-white/5 group-hover:border-[#1DB954]/50 transition-all duration-300">
              {album.images[0] ? (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <FaMusic className="text-4xl text-gray-600 group-hover:text-[#1DB954] transition-colors" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <FaSpotify className="text-3xl text-[#1DB954] drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
              </div>
            </div>
            <h3 className="font-bold text-white truncate group-hover:text-[#1DB954] transition-colors text-sm md:text-base">
              {album.name}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {album.artists.map((a) => a.name).join(", ")}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {album.release_date.slice(0, 4)} • {album.total_tracks} tracks
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
