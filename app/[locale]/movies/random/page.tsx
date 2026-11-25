"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";
import { FaDice } from "react-icons/fa";

import ProviderFilter from "@/components/media/ProviderFilter";
import RandomResult, { type RandomItem } from "@/components/media/RandomResult";
import { useProviderFilter } from "@/hooks/useProviderFilter";
import { getNavigation } from "@/lib/navigation";
import { decades } from "@/lib/params";

interface Genre {
  id: number;
  name: string;
}

interface Draw {
  item: RandomItem;
  total: number;
}

type Status = "ready" | "searching" | "found" | "noResults" | "error";

// The last draw, to bring it back with the browser's back button
let lastDraw: { entry: string; draw: Draw } | null = null;

const historyEntry = () => getNavigation()?.currentEntry?.key;

const SELECT_CLASS =
  "w-full h-11 bg-[#1c1c1c] border border-white/10 rounded-lg px-4 text-sm";
const LABEL_CLASS = "block text-xs text-gray-300 mb-1 uppercase font-bold";

function RandomContent() {
  const locale = useLocale();
  const t = useTranslations("RandomPage");
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const genre = searchParams.get("genre") ?? "";
  const decade = searchParams.get("decade") ?? "";
  const isShort = searchParams.get("short") === "1";
  const { region, selected, toggle, clear } = useProviderFilter();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [draw, setDraw] = useState<Draw | null>(() =>
    typeof window !== "undefined" && lastDraw?.entry === historyEntry()
      ? (lastDraw?.draw ?? null)
      : null
  );
  const [status, setStatus] = useState<Status>("ready");
  const [shuffled, setShuffled] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/genres${type === "tv" ? "/tv" : ""}?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setGenres(data.genres || []);
      })
      .catch((error) => console.error("Error fetching genres:", error));
    return () => {
      ignore = true;
    };
  }, [type, locale]);

  // Changing a filter makes a new history entry: the draw follows it
  // biome-ignore lint/correctness/useExhaustiveDependencies: searchParams is the trigger
  useEffect(() => {
    const entry = historyEntry();
    if (draw && entry) lastDraw = { entry, draw };
  }, [draw, searchParams]);

  // Messages are about the filters of the draw
  // biome-ignore lint/correctness/useExhaustiveDependencies: searchParams is the trigger
  useEffect(() => {
    setStatus((current) => (current === "searching" ? current : "ready"));
  }, [searchParams]);

  useEffect(() => {
    if (status !== "searching") return;
    const interval = setInterval(() => {
      setShuffled(genres[Math.floor(Math.random() * genres.length)]?.name ?? "");
    }, 100);
    return () => clearInterval(interval);
  }, [status, genres]);

  const setFilters = (changes: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    for (const [name, value] of Object.entries(changes)) {
      if (value) params.set(name, value);
      else params.delete(name);
    }
    // Only this page reads them: no need to ask the server
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const spin = async () => {
    if (status === "searching") return;
    setStatus("searching");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams({
      lang: locale,
      type,
      genre,
      decade,
      short: isShort ? "1" : "",
      providers: (selected ?? []).join(","),
    });

    try {
      const [res] = await Promise.all([
        fetch(`/api/random-movie?${params.toString()}`, { cache: "no-store" }),
        new Promise((resolve) => setTimeout(resolve, reduce ? 0 : 800)),
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { item: RandomItem | null; total: number } = await res.json();
      setDraw(data.item ? { item: data.item, total: data.total } : null);
      setStatus(data.item ? "found" : "noResults");
      if (data.item) {
        buttonRef.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
        });
      }
    } catch (error) {
      console.error("Error fetching random title:", error);
      setStatus("error");
    }
  };

  const isSearching = status === "searching";
  let message = "";
  if (status === "found" && draw) {
    message = t("found", { title: draw.item.title ?? "" });
  } else if (status === "noResults" || status === "error") {
    message = t(status);
  } else if (status === "ready" && !draw) {
    message = t("ready");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20 text-white">
      <div className="text-center mb-6 pt-4 md:mb-8 md:pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-lg">
          {t("title")}
        </h1>
      </div>

      <section
        aria-label={t("filters")}
        className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end bg-white/5 p-4 rounded-2xl border border-white/10"
      >
        <fieldset className="col-span-2 md:col-span-1 min-w-0">
          <legend className={LABEL_CLASS}>{t("type")}</legend>
          <div className="flex h-11 bg-[#1c1c1c] border border-white/10 rounded-lg p-1">
            {(["movie", "tv"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={type === value}
                // Movies and TV series have different genres
                onClick={() =>
                  type !== value &&
                  setFilters({
                    type: value === "tv" ? "tv" : "",
                    genre: "",
                    short: "",
                  })
                }
                className={`flex-1 rounded-md text-sm font-bold transition-colors ${
                  type === value
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {t(value)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="min-w-0">
          <label htmlFor="random-genre" className={LABEL_CLASS}>
            {t("genre")}
          </label>
          <select
            id="random-genre"
            value={genre}
            onChange={(e) => setFilters({ genre: e.target.value })}
            className={SELECT_CLASS}
          >
            <option value="">{t("any")}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="random-decade" className={LABEL_CLASS}>
            {t("decade")}
          </label>
          <select
            id="random-decade"
            value={decade}
            onChange={(e) => setFilters({ decade: e.target.value })}
            className={SELECT_CLASS}
          >
            <option value="">{t("any")}</option>
            {decades().map((value) => (
              <option key={value} value={value}>
                {t("decadeOption", { decade: String(value) })}
              </option>
            ))}
          </select>
        </div>

        {/* Kept in place for TV series too, so the page does not move */}
        <label
          className={`col-span-2 md:col-span-1 min-h-11 flex items-center gap-3 text-sm text-gray-200 ${
            type === "tv" ? "invisible" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={isShort}
            onChange={(e) => setFilters({ short: e.target.checked ? "1" : "" })}
            className="w-5 h-5 shrink-0 accent-yellow-500"
          />
          {t("short")}
        </label>
      </section>

      <ProviderFilter
        region={region}
        selected={selected ?? []}
        onToggle={toggle}
        onClear={clear}
      />

      <button
        ref={buttonRef}
        type="button"
        aria-disabled={isSearching}
        onClick={spin}
        className="scroll-mt-28 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl text-lg shadow-lg aria-disabled:opacity-60 aria-disabled:cursor-default"
      >
        <FaDice
          className={`text-2xl ${
            isSearching ? "animate-spin motion-reduce:animate-none" : ""
          }`}
        />
        {draw ? t("another") : t("spin")}
      </button>

      <div className="min-h-6 my-2 text-center text-gray-300">
        <p role="status" className={status === "found" ? "sr-only" : ""}>
          {message}
        </p>
        {isSearching && (
          <p aria-hidden="true">{t("searching", { genre: shuffled })}</p>
        )}
        {status === "found" && draw?.total === 1 && <p>{t("only")}</p>}
      </div>

      {draw && (
        <div
          className={`transition-opacity motion-reduce:transition-none ${
            isSearching ? "opacity-40" : ""
          }`}
        >
          <RandomResult item={draw.item} />
        </div>
      )}
    </div>
  );
}

export default function RandomMoviePage() {
  return (
    <Suspense>
      <RandomContent />
    </Suspense>
  );
}
