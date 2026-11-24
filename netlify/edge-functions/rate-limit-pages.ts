// Returning nothing lets the request continue: only the rate limit matters
export default () => {};

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
