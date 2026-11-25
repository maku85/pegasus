import { tmdbImage } from "@/lib/image";

// Faint colours of the title behind the whole page
export default function AmbientBackground({ path }: { path?: string | null }) {
  return (
    <>
      {path && (
        <div
          className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110 bg-cover bg-center"
          style={{ backgroundImage: `url(${tmdbImage(path, "w300")})` }}
        />
      )}
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />
    </>
  );
}
