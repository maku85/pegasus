export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  permalink: string;
  thumbnail: string;
  url: string;
  ups: number;
  num_comments: number;
  created_utc: number;
  is_video: boolean;
}

export async function getRedditPosts(query: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(
        query
      )}&sort=relevance&limit=12`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MyMoviesApp/1.0)",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error("Reddit API error:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    if (!data.data || !data.data.children) {
      return [];
    }

    return data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      subreddit: child.data.subreddit,
      permalink: `https://www.reddit.com${child.data.permalink}`,
      thumbnail: child.data.thumbnail,
      url: child.data.url,
      ups: child.data.ups,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      is_video: child.data.is_video,
    }));
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return [];
  }
}
