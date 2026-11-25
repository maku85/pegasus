import { refuseBots } from "../lib/bots.ts";

// These are the addresses that can spend TMDB calls
export default refuseBots;

export const config = {
  path: "/api/*",
  rateLimit: {
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
