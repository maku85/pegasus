import { getMediaList } from "@/lib/mediaList";

export async function GET(req: Request) {
  return getMediaList("tv", new URL(req.url).searchParams);
}
