"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32 px-6 text-center text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="text-yellow-400 hover:underline"
      >
        {t("retry")}
      </button>
    </div>
  );
}
