import { FaSpotify } from "react-icons/fa";

interface SpotifyLinkProps {
    title: string;
}

export default function SpotifyLink({ title }: SpotifyLinkProps) {
    const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(title + " soundtrack")}`;

    return (
        <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-[#1DB954]/20"
        >
            <FaSpotify className="text-xl" />
            <span>Colonna Sonora</span>
        </a>
    );
}
