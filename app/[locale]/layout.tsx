import "../globals.css";
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Movies",
  description: "Your personal movie database",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "My Movies",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'it'].includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} relative min-h-screen flex flex-col text-gray-100 overflow-x-hidden bg-[#0a0a0a]`}>
        <NextIntlClientProvider messages={messages}>
          {/* GLOBAL FIXED BACKGROUND */}
          <div
            className="fixed inset-0 z-[-2] pointer-events-none"
            style={{
              backgroundImage: "url('/images/background.avif')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />

          {/* Glass Overlay */}
          <div className="fixed inset-0 z-[-1] bg-black/70 backdrop-blur-[8px] pointer-events-none" />

          <Navbar />

          {/* Main content with top padding to avoid navbar overlap */}
          <main className="flex-1 pt-24">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
