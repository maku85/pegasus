// JSON kept by the browser only. Netlify's CDN builds its cache key without the
// query, so it would serve one list or search in place of all the others
export function apiResponse(data: unknown, maxAge: number) {
  return Response.json(data, {
    headers: {
      "Cache-Control": `private, max-age=${maxAge}`,
      "Netlify-CDN-Cache-Control": "no-store",
    },
  });
}
