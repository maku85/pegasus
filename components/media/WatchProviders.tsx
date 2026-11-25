import { useTranslations } from "next-intl";

import { tmdbImage } from "@/lib/tmdb";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProvidersProps {
  providers: {
    link?: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
  const t = useTranslations("WatchProviders");

  if (!providers) return null;

  const { flatrate, rent, buy, link } = providers;
  if (!flatrate && !rent && !buy) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
        {t("title")}
      </h2>

      <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/5 space-y-8">
        {flatrate && flatrate.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Streaming
            </h3>
            <div className="flex flex-wrap gap-4">
              {flatrate.map((provider) => (
                <div key={provider.provider_id} className="group relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={tmdbImage(provider.logo_path, "w92")}
                      alt={provider.provider_name}
                      className="w-full h-full object-cover"
                      title={provider.provider_name}
                    />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rent && rent.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              {t("rent")}
            </h3>
            <div className="flex flex-wrap gap-4">
              {rent.map((provider) => (
                <div key={provider.provider_id} className="group relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={tmdbImage(provider.logo_path, "w92")}
                      alt={provider.provider_name}
                      className="w-full h-full object-cover"
                      title={provider.provider_name}
                    />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {buy && buy.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              {t("buy")}
            </h3>
            <div className="flex flex-wrap gap-4">
              {buy.map((provider) => (
                <div key={provider.provider_id} className="group relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={tmdbImage(provider.logo_path, "w92")}
                      alt={provider.provider_name}
                      className="w-full h-full object-cover"
                      title={provider.provider_name}
                    />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {link && (
          <div className="pt-4 border-t border-white/10 text-right">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-300 hover:text-white transition-colors"
            >
              {t("justWatch")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
