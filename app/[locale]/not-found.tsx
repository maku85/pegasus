import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[70vh] px-6 text-center text-white">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Link href="/" className="text-yellow-400 hover:underline">
        {t("backHome")}
      </Link>
    </div>
  );
}
