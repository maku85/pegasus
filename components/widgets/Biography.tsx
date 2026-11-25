"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface BiographyProps {
  text: string;
  // The text is the English one because the page's language has none
  isEnglish: boolean;
}

export default function Biography({ text, isEnglish }: BiographyProps) {
  const t = useTranslations("PersonPage");
  const [isOpen, setIsOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(text.length > 250);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Only the browser knows whether the text really overflows
  useEffect(() => {
    const element = textRef.current;
    if (!element || isOpen) return;
    const observer = new ResizeObserver(() =>
      setCanExpand(element.scrollHeight > element.clientHeight + 1)
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
        {t("biography")}
      </h2>
      {isEnglish && (
        <p className="mb-3 text-sm text-gray-300 italic">
          {t("englishBiography")}
        </p>
      )}
      <p
        ref={textRef}
        id="biography"
        lang={isEnglish ? "en" : undefined}
        className={`text-gray-200 leading-relaxed whitespace-pre-line max-w-3xl ${
          isOpen ? "" : "line-clamp-6 md:line-clamp-10"
        }`}
      >
        {text}
      </p>
      {canExpand && (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="biography"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-3 py-1 font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {isOpen ? t("readLess") : t("readMore")}
        </button>
      )}
    </div>
  );
}
