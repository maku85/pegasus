import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Set by Netlify during the build; social previews need absolute image URLs
const siteUrl =
  process.env.CONTEXT === "production"
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL;

const nextConfig: NextConfig = {
  env: { SITE_URL: siteUrl ?? "" },
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
