"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ScrollRowProps {
  children: ReactNode;
  label: string;
}

export default function ScrollRow({ children, label }: ScrollRowProps) {
  const t = useTranslations("ScrollRow");
  const rowRef = useRef<HTMLElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      setCanGoBack(row.scrollLeft > 4);
      setCanGoForward(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
    };
    const observer = new ResizeObserver(update);
    observer.observe(row);
    row.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener("scroll", update);
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const row = rowRef.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row?.scrollBy({
      left: direction * row.clientWidth * 0.8,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-yellow-500 hover:text-black transition-colors";

  return (
    <div className="relative">
      <section
        ref={rowRef}
        aria-label={label}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: lets the keyboard scroll rows without links
        tabIndex={0}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-1 pt-1 hide-scrollbar"
      >
        {children}
      </section>
      {canGoBack && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={t("back")}
          className={`${arrowClass} -left-3`}
        >
          <FaChevronLeft />
        </button>
      )}
      {canGoForward && (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={t("forward")}
          className={`${arrowClass} -right-3`}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}
