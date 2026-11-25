import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Set by Netlify during the build; social previews need absolute image URLs
const siteUrl =
  process.env.CONTEXT === "production"
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL;

// Invented contents instead of TMDB. Fixed while building, so the normal site
// carries no demo code
const isDemo = process.env.DEMO === "1";
if (
  isDemo &&
  process.env.CONTEXT === "production" &&
  process.env.DEMO_IN_PRODUCTION !== "1"
) {
  throw new Error(
    "DEMO=1 in a production deploy: remove it, or set DEMO_IN_PRODUCTION=1"
  );
}

const nextConfig: NextConfig = {
  env: { SITE_URL: siteUrl ?? "", DEMO: isDemo ? "1" : "" },
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/:locale(en|it)/favorites",
      destination: "/:locale/watchlist",
      permanent: true,
    },
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
