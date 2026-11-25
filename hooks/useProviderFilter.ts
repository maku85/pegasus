"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";

import { parseProviders, regionOf } from "@/lib/providers";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// The address wins, so shared links work; otherwise the visitor's own choice.
// `selected` is null until the browser's storage can be read.
export function useProviderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const region = regionOf(useLocale());
  const storageKey = `providers-${region}`;

  const saved = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey) ?? "",
    () => null
  );
  const value = searchParams.get("providers") ?? saved;
  const selected = value === null ? null : parseProviders(value, region);

  const select = (ids: number[]) => {
    const next = parseProviders(ids.join(","), region).join(",");
    localStorage.setItem(storageKey, next);
    for (const listener of listeners) listener();

    const params = new URLSearchParams(window.location.search);
    if (next) params.set("providers", next);
    else params.delete("providers");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggle = (id: number) => {
    const current = selected ?? [];
    select(
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id]
    );
  };

  return { region, selected, toggle, clear: () => select([]) };
}
