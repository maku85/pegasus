"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";

interface TrailerButtonProps {
  trailerKey: string;
}

export default function TrailerButton({ trailerKey }: TrailerButtonProps) {
  const t = useTranslations("TrailerButton");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
      >
        <FaPlay /> {t("watchTrailer")}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={t("watchTrailer")}
        onClose={() => setIsOpen(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => e.key === "Escape" && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop:bg-black/90"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
        >
          <FaTimes size={24} />
        </button>
        {isOpen && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title={t("watchTrailer")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          ></iframe>
        )}
      </dialog>
    </>
  );
}
