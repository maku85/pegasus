import "../globals.css";

import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { openGraph } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brand" });

  return {
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
    title: `Row Seven – ${t("payoff")}`,
    description: t("description"),
    openGraph: openGraph(locale),
    twitter: { card: "summary_large_image" as const },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent" as const,
      title: "Row Seven",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!["en", "it"].includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const tDemo = await getTranslations({ locale, namespace: "Demo" });

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} relative min-h-screen flex flex-col text-gray-100 overflow-x-hidden bg-[#0a0a0a]`}
      >
        <NextIntlClientProvider messages={messages}>
          <div
            className="fixed inset-0 z-[-2] pointer-events-none"
            style={{
              backgroundImage: "url('/images/background.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="fixed inset-0 z-[-1] bg-black/70 backdrop-blur-[8px] pointer-events-none" />
          <Navbar />
          {/* Full height, so the footer never jumps while a page loads */}
          <main className="flex-1 min-h-screen pt-24">{children}</main>
          <Footer />
          {process.env.DEMO === "1" && (
            <aside
              aria-label={tDemo("badge")}
              className="fixed bottom-4 left-4 z-40 px-3 py-1.5 rounded-full bg-black/90 border border-yellow-500/60 text-xs font-bold text-yellow-300"
            >
              {tDemo("badge")}
            </aside>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
