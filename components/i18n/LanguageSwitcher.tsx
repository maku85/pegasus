"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { RiGlobalLine, RiArrowDownSLine } from "react-icons/ri";

import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectChange = (nextLocale: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "it", label: "Italiano" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300"
        aria-label="Change language"
      >
        <RiGlobalLine className="text-lg" />
        <span className="uppercase">{locale}</span>
        <RiArrowDownSLine
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectChange(lang.code)}
                disabled={isPending}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10 ${
                  locale === lang.code ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
