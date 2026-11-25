"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop({ gridId }: { gridId: string }) {
  const t = useTranslations("ListPage");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const top = document.getElementById(gridId)?.getBoundingClientRect().top;
      setIsVisible(top !== undefined && top < -window.innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [gridId]);

  const handleClick = () => {
    const grid = document.getElementById(gridId);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    grid?.querySelector("a")?.focus({ preventScroll: true });
    grid?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      className="fixed bottom-6 right-4 md:right-8 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-black/50 transition-colors"
    >
      <FaArrowUp />
    </button>
  );
}
