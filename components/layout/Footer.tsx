"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navbar");
  const tBrand = useTranslations("Brand");

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Row Seven</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {tBrand("description")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/movies"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {tNav("movies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {tNav("tvSeries")}
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-yellow-400 transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/watchlist"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {tNav("watchlist")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">{t("legal")}</h4>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4"
            >
              <img src="/images/tmdb.svg" alt="TMDB" className="h-4 w-auto" />
            </a>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t("disclaimer")}
            </p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-400">
          {t("rights", { year: String(new Date().getFullYear()) })}
        </div>
      </div>
    </footer>
  );
}
