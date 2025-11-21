import Link from "next/link";

import { tmdbFetch, tmdbImage } from "@/lib/tmdb";
import Carousel from "@/components/media/Carousel";
import MovieCard from "@/components/media/MovieCard";
import HeroSlider from "@/components/media/HeroSlider";
import HomeNewsWidget from "@/components/widgets/HomeNewsWidget";

export default async function Home() {

  const [popular, trending, popularTV, upcoming] = await Promise.all([
    tmdbFetch("/movie/popular?language=it-IT&page=1"),
    tmdbFetch("/trending/all/week?language=it-IT"),
    tmdbFetch("/tv/popular?language=it-IT&page=1"),
    tmdbFetch("/movie/upcoming?language=it-IT&page=1"),
  ]);

  return (
    <div>
      <HeroSlider items={trending.results.slice(0, 10)} />

      <div className="container mx-auto px-4 py-12 space-y-20">
        <Carousel title="Film Popolari" accentColor="yellow">
          {popular.results.map((m: any) => (
            <MovieCard key={m.id} movie={m} media_type="movie" className="min-w-[160px] md:min-w-[200px]" />
          ))}
        </Carousel>

        <Carousel title="Serie TV Popolari" accentColor="purple">
          {popularTV.results.map((tv: any) => (
            <MovieCard key={tv.id} movie={tv} media_type="tv" className="min-w-[160px] md:min-w-[200px]" />
          ))}
        </Carousel>

        <HomeNewsWidget />

        <Carousel title="In Arrivo" accentColor="blue">
          {upcoming.results.map((m: any) => (
            <MovieCard key={m.id} movie={m} media_type="movie" className="min-w-[160px] md:min-w-[200px]" />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
