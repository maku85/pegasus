// Posters, photos and logos of the demo mode
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  if (process.env.DEMO !== "1") return new Response(null, { status: 404 });

  const { demoImage } = await import("@/lib/demoImages");
  const svg = demoImage((await params).file);
  if (!svg) return new Response(null, { status: 404 });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
