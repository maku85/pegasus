const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
  release_date: string;
  total_tracks: number;
}

async function getSpotifyToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn("Spotify credentials not found");
    return null;
  }

  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  try {
    const basic = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      next: { revalidate: 0 },
    });
    if (!response.ok) {
      throw new Error(`Spotify Auth Error: ${response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return cachedToken;
  } catch (error) {
    console.error("Failed to get Spotify token:", error);
    return null;
  }
}

export async function getMovieSoundtrack(
  query: string
): Promise<SpotifyAlbum[]> {
  const token = await getSpotifyToken();
  if (!token) return [];

  try {
    const response = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=album&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 }, // Cache results for 1 hour
      }
    );
    if (!response.ok) {
      console.error(`Spotify Search Error: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.albums?.items || [];
  } catch (error) {
    console.error("Error fetching Spotify albums:", error);
    return [];
  }
}
