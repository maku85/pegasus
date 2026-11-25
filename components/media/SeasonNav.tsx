import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Link } from "@/i18n/routing";
import type { Season } from "@/lib/seasons";

interface SeasonNavProps {
  showId: string;
  previous?: Season;
  next?: Season;
  label: string;
}

const linkClass =
  "min-w-0 flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 border border-white/10 font-bold hover:bg-yellow-500 hover:text-black transition-colors";

export default function SeasonNav({
  showId,
  previous,
  next,
  label,
}: SeasonNavProps) {
  if (!previous && !next) return null;

  // `replace`: the browser's back button returns to the show, not through seasons
  return (
    <nav aria-label={label} className="flex justify-between gap-4">
      {previous && (
        <Link
          href={`/tv/${showId}/season/${previous.season_number}`}
          replace
          prefetch={false}
          rel="prev"
          className={linkClass}
        >
          <FaChevronLeft className="shrink-0" />
          <span className="truncate">{previous.name}</span>
        </Link>
      )}
      {next && (
        <Link
          href={`/tv/${showId}/season/${next.season_number}`}
          replace
          prefetch={false}
          rel="next"
          className={`${linkClass} ml-auto`}
        >
          <span className="truncate">{next.name}</span>
          <FaChevronRight className="shrink-0" />
        </Link>
      )}
    </nav>
  );
}
