import { getMediaList } from "@/lib/mediaList";

export async function GET(req: Request) {
  return getMediaList("movie", new URL(req.url).searchParams);
}
