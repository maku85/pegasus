import type { ReactNode } from "react";

import ScrollRow from "@/components/media/ScrollRow";

interface CarouselProps {
  children: ReactNode;
  title: string;
}

export default function Carousel({ children, title }: CarouselProps) {
  return (
    <div className="mb-8 text-white">
      <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
        {title}
      </h2>
      <ScrollRow label={title}>{children}</ScrollRow>
    </div>
  );
}
