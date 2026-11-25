import { refuseBots } from "../lib/bots.ts";

// These are the addresses that can spend TMDB calls
export default refuseBots;

export const config = {
  path: [
    "/:locale/movies/*",
    "/:locale/tv/*",
    "/:locale/person/*",
    "/:locale/collection/*",
    "/:locale/keyword/*",
  ],
  rateLimit: {
    windowLimit: 120,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
