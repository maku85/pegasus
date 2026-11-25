"use client";

import type { MouseEvent, ReactNode } from "react";

import { Link, useRouter } from "@/i18n/routing";
import { getNavigation } from "@/lib/navigation";

interface BackLinkProps {
  // Where to go when the visit started on this page
  fallback: string;
  className?: string;
  children: ReactNode;
}

export default function BackLink({
  fallback,
  className,
  children,
}: BackLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    // Leave "open in a new tab" to the browser
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    // canGoBack only counts pages of this site
    if (getNavigation()?.canGoBack ?? window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={fallback}
      prefetch={false}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
