"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface LoadMoreProps {
  gridId: string;
  count: number;
  loading: boolean;
  failed: boolean;
  onLoadMore: () => void;
}

export default function LoadMore({
  gridId,
  count,
  loading,
  failed,
  onLoadMore,
}: LoadMoreProps) {
  const t = useTranslations("ListPage");
  const countBefore = useRef<number | null>(null);

  // The button moves down: the keyboard continues from the first new card
  useEffect(() => {
    if (countBefore.current === null || count === countBefore.current) return;
    if (count > countBefore.current) {
      document
        .getElementById(gridId)
        ?.children[countBefore.current]?.querySelector("a")
        ?.focus({ preventScroll: true });
    }
    countBefore.current = null;
  }, [count, gridId]);

  return (
    <div className="flex justify-center pt-10 pb-16">
      <button
        type="button"
        aria-disabled={loading}
        onClick={() => {
          if (loading) return;
          countBefore.current = count;
          onLoadMore();
        }}
        className="px-8 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-400 text-black transition-colors aria-disabled:opacity-60 aria-disabled:cursor-default"
      >
        {loading
          ? t("loadingMore")
          : failed
            ? t("retry")
            : t("loadMore")}
      </button>
    </div>
  );
}
