"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";

import { useWatchlist } from "@/hooks/useWatchlist";

const MAX_FILE_SIZE = 1_000_000;

export default function WatchlistBackup() {
  const t = useTranslations("WatchlistBackup");
  const { watchlist, importWatchlist } = useWatchlist();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const handleExport = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(watchlist, null, 2)], {
        type: "application/json",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "row-seven-watchlist.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const added =
        file.size > MAX_FILE_SIZE ? null : importWatchlist(await file.text());
      setMessage(
        added === null ? t("invalid") : t("imported", { count: added })
      );
    } catch (error) {
      console.error("Error importing watchlist:", error);
      setMessage(t("invalid"));
    }
    // Lets the same file be chosen again
    input.value = "";
  };

  const buttonClass =
    "flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {watchlist.length > 0 && (
        <button type="button" onClick={handleExport} className={buttonClass}>
          <FaDownload /> {t("export")}
        </button>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={buttonClass}
      >
        <FaUpload /> {t("import")}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        aria-label={t("import")}
        className="hidden"
      />
      <p role="status" className="text-sm text-gray-300">
        {message}
      </p>
    </div>
  );
}
