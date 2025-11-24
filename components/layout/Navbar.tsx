"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  RiMovie2Line,
  RiSearchLine,
  RiMenu4Line,
  RiCloseLine,
} from "react-icons/ri";

import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    }),
  };

  const links = [
    { href: "/movies", label: t("movies") },
    { href: "/tv", label: t("tvSeries") },
    { href: "/news", label: "News" },
    { href: "/favorites", label: t("favorites") },
    { href: "/movies/random", label: "Random" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group z-50 relative"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <RiMovie2Line className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              Cine<span className="text-yellow-400">Sphere</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1.5 shadow-2xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-6 py-2 rounded-full text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 z-50 relative">
            <Link
              href="/search"
              className="p-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              aria-label={t("search")}
            >
              <RiSearchLine className="text-xl" />
            </Link>

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              aria-label="Menu"
            >
              {isOpen ? (
                <RiCloseLine className="text-2xl" />
              ) : (
                <RiMenu4Line className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.div key={link.href} custom={i} variants={linkVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
