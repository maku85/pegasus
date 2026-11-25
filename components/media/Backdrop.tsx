import type { ReactNode } from "react";

import { tmdbImage } from "@/lib/image";

interface BackdropProps {
  backdrop: string | null;
  poster: string | null;
  // Shades that keep the text above readable
  children: ReactNode;
}

// Wide image behind a title. Without one the poster is blurred to fill the
// space, and without either the page's own gradient shows
export default function Backdrop({
  backdrop,
  poster,
  children,
}: BackdropProps) {
  const path = backdrop ?? poster;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#3a2a08] via-[#1b1710] to-[#141414]">
      {path && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
            backdrop ? "" : "blur-2xl scale-125"
          }`}
          style={{
            backgroundImage: `url(${tmdbImage(path, backdrop ? "w1280" : "w342")})`,
          }}
        />
      )}
      {children}
    </div>
  );
}
