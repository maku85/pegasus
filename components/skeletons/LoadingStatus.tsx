import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

// Announces the wait to screen readers; the shapes inside are only visual
export default function LoadingStatus({ children }: { children?: ReactNode }) {
  const t = useTranslations("Common");

  return (
    <div role="status">
      <span className="sr-only">{t("loading")}</span>
      <div
        aria-hidden="true"
        className="animate-pulse motion-reduce:animate-none"
      >
        {children}
      </div>
    </div>
  );
}
