'use client';

import { ReactNode, useRef } from "react";

import MovieCardSkeleton from "@/components/media/MovieCardSkeleton";

interface CarouselProps {
  children: ReactNode[];
  title?: string;
  loading?: boolean;
  skeletonCount?: number;
  accentColor?: "yellow" | "purple" | "blue" | "red" | "green";
}

export default function Carousel({ children, title, loading = false, skeletonCount = 6, accentColor = "yellow" }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColors = {
    yellow: "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
    purple: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    blue: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    red: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    green: "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]",
  };

  return (
    <div className="mb-8 text-white">
      {title && (
        <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
          <span className={`w-1.5 h-8 rounded-full ${accentColors[accentColor]}`}></span>
          {title}
        </h2>
      )}
      <div
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto cursor-grab px-1 pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => <MovieCardSkeleton key={i} />)
          : children
        }
      </div>
    </div>
  );
}
