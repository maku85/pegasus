import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { pageTitle } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WatchlistPage" });
  return { title: pageTitle(t("title")) };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
