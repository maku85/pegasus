import { getTranslations } from "next-intl/server";

import Carousel from "@/components/media/Carousel";
import HeroSlider from "@/components/media/HeroSlider";
import MovieCard from "@/components/media/MovieCard";
import HomeNewsWidget from "@/components/widgets/HomeNewsWidget";
import { tmdbFetch } from "@/lib/tmdb";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  const [popular, trending, popularTV, upcoming] = await Promise.all([
    tmdbFetch("/movie/popular?page=1", locale),
    tmdbFetch("/trending/all/week", locale),
    tmdbFetch("/tv/popular?page=1", locale),
    tmdbFetch("/movie/upcoming?page=1", locale),
  ]);

  return (
    <div>
      <HeroSlider items={trending.results.filter((i: any) => i.media_type !== "person").slice(0, 10)} />

      <div className="container mx-auto px-4 py-12 space-y-20">
        <Carousel title={t("popularMovies")} accentColor="yellow">
          {popular.results.map((m: any) => (
            <MovieCard
              key={m.id}
              movie={m}
              media_type="movie"
              className="min-w-[160px] md:min-w-[200px]"
            />
          ))}
        </Carousel>

        <Carousel title={t("popularTV")} accentColor="purple">
          {popularTV.results.map((tv: any) => (
            <MovieCard
              key={tv.id}
              movie={tv}
              media_type="tv"
              className="min-w-[160px] md:min-w-[200px]"
            />
          ))}
        </Carousel>

        <HomeNewsWidget locale={locale} />

        <Carousel title={t("upcoming")} accentColor="blue">
          {upcoming.results.map((m: any) => (
            <MovieCard
              key={m.id}
              movie={m}
              media_type="movie"
              className="min-w-[160px] md:min-w-[200px]"
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
