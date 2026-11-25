"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";

import { Link } from "@/i18n/routing";
import { type Credit, type CreditSection, creditPeriod } from "@/lib/credits";
import { tmdbImage } from "@/lib/tmdb";

interface FilmographyProps {
  sections: CreditSection[];
  today: string;
}

const PREVIEW = 20;

export default function Filmography({ sections, today }: FilmographyProps) {
  const t = useTranslations("PersonPage");
  const [activeKey, setActiveKey] = useState(sections[0].key);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // TMDB names departments and jobs in English only
  const translate = (group: "departments" | "jobs", name: string) =>
    t.has(`${group}.${name}`) ? t(`${group}.${name}`) : name;

  // Characters keep their name; "Self - Host" only says "Host" in its section
  const roleNames = (roles: string[]) =>
    activeKey === "Acting"
      ? roles
      : activeKey === "Self"
        ? roles.map((r) => r.replace(/^\w+\s*-?\s*/, "")).filter(Boolean)
        : [...new Set(roles.map((r) => translate("jobs", r)))];

  const { credits } =
    sections.find(({ key }) => key === activeKey) ?? sections[0];
  const visible = isExpanded ? credits : credits.slice(0, PREVIEW);

  const periods: { period: string; credits: Credit[] }[] = [];
  for (const credit of visible) {
    const period = creditPeriod(credit.date, today);
    const last = periods[periods.length - 1];
    if (last?.period === period) last.credits.push(credit);
    else periods.push({ period, credits: [credit] });
  }

  const handleShowAll = () => {
    setIsExpanded(true);
    // The button goes away: the keyboard continues from the first new title
    requestAnimationFrame(() =>
      listRef.current
        ?.querySelectorAll("a")
        [PREVIEW]?.focus({ preventScroll: true })
    );
  };

  return (
    <>
      {sections.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-1 -m-1 mb-7 md:flex-wrap">
          {sections.map(({ key, credits }) => (
            <button
              key={key}
              type="button"
              aria-pressed={key === activeKey}
              onClick={() => {
                setActiveKey(key);
                setIsExpanded(false);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                key === activeKey
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {translate("departments", key)}{" "}
              <span className="font-normal">{credits.length}</span>
            </button>
          ))}
        </div>
      )}

      <div ref={listRef} className="space-y-8">
        {periods.map(({ period, credits }) => (
          <div key={period}>
            <h3 className="text-lg font-bold text-gray-300 mb-3">
              {period === "upcoming" || period === "undated"
                ? t(period)
                : t("decade", { year: period })}
            </h3>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {credits.map((credit) => (
                <li key={`${credit.media_type}-${credit.id}`}>
                  <Link
                    href={`/${credit.media_type === "tv" ? "tv" : "movies"}/${credit.id}`}
                    prefetch={false}
                    className="h-full flex items-center gap-4 p-2 rounded-xl bg-black/20 border border-white/5 hover:bg-white/10 hover:border-yellow-500/40 transition-colors group"
                  >
                    <img
                      src={tmdbImage(credit.poster_path, "w92")}
                      alt=""
                      width={48}
                      height={72}
                      loading="lazy"
                      className="w-12 h-18 shrink-0 rounded-lg object-cover bg-gray-800"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold truncate group-hover:text-yellow-400 transition-colors">
                        {credit.title}
                      </span>
                      <span className="block text-sm text-gray-300 truncate">
                        {roleNames(credit.roles).join(", ") ||
                          (activeKey === "Acting" && t("unknownRole"))}
                      </span>
                    </span>
                    <span className="shrink-0 pr-2 text-right text-sm text-gray-300">
                      <span className="block">
                        {credit.media_type === "tv" && (
                          <span className="mr-2 px-1.5 py-0.5 rounded bg-white/10 text-xs font-bold">
                            TV
                          </span>
                        )}
                        {credit.date.slice(0, 4)}
                      </span>
                      {credit.vote_average > 0 && (
                        <span className="mt-1 flex items-center justify-end gap-1">
                          <FaStar className="text-orange-200" />
                          {credit.vote_average.toFixed(1)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {visible.length < credits.length && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={handleShowAll}
            className="px-8 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
          >
            {t("showAll", { count: credits.length - visible.length })}
          </button>
        </div>
      )}
    </>
  );
}
