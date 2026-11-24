// Returning nothing lets the request continue: only the rate limit matters
export default () => {};

export const config = {
  path: "/api/*",
  rateLimit: {
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
