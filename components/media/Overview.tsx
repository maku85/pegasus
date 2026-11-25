import { useTranslations } from "next-intl";

interface OverviewProps {
  text: string;
  // The text is the English one because the page's language has none
  isEnglish: boolean;
  className?: string;
}

export default function Overview({
  text,
  isEnglish,
  className = "",
}: OverviewProps) {
  const t = useTranslations("MediaPage");

  return (
    <div
      className={`bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl ${className}`}
    >
      {text ? (
        <>
          {isEnglish && (
            <p className="mb-2 text-sm text-gray-300 italic">
              {t("englishOverview")}
            </p>
          )}
          <p
            lang={isEnglish ? "en" : undefined}
            className="md:text-lg text-gray-200 leading-relaxed line-clamp-4 md:line-clamp-none"
          >
            {text}
          </p>
        </>
      ) : (
        <p className="text-gray-300 italic">{t("noOverview")}</p>
      )}
    </div>
  );
}
