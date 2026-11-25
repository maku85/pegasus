"use client";

import { useTranslations } from "next-intl";
import { FaCheck } from "react-icons/fa";

import { PROVIDERS, type Region } from "@/lib/providers";
import { tmdbImage } from "@/lib/tmdb";

interface ProviderFilterProps {
  region: Region;
  selected: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
}

export default function ProviderFilter({
  region,
  selected,
  onToggle,
  onClear,
}: ProviderFilterProps) {
  const t = useTranslations("ProviderFilter");

  return (
    <fieldset className="mb-8 min-w-0 bg-white/5 p-4 rounded-2xl border border-white/10">
      <legend className="sr-only">{t("title")}</legend>
      <div className="flex flex-wrap items-center justify-between gap-x-4 min-h-8 mb-3 text-sm">
        <p className="flex flex-wrap items-center gap-x-3 text-gray-300">
          <span aria-hidden="true" className="font-medium">
            {t("title")}
          </span>
          <a
            href="https://www.justwatch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 text-xs underline underline-offset-2 hover:text-white"
          >
            {t("justWatch")}
          </a>
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1 rounded-lg font-medium text-yellow-400 hover:bg-white/10 transition-colors"
          >
            {t("clear")}
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar p-1 -m-1 md:flex-wrap">
        {PROVIDERS[region].map(({ id, name, logo }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(id)}
              title={name}
              className={`relative shrink-0 w-12 h-12 rounded-xl text-[10px] transition-opacity ${
                isSelected
                  ? "ring-2 ring-yellow-400"
                  : selected.length > 0
                    ? "opacity-60 hover:opacity-100"
                    : "hover:opacity-80"
              }`}
            >
              <img
                src={tmdbImage(logo, "w92")}
                alt={name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover bg-gray-800"
              />
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-yellow-400 text-black">
                  <FaCheck className="text-[10px]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
