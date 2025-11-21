import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export async function getNews(query: string): Promise<NewsItem[]> {
    try {
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=it&gl=IT&ceid=IT:it`;
        const feed = await parser.parseURL(feedUrl);

        return feed.items.slice(0, 6).map((item) => ({
            title: item.title || 'Senza titolo',
            link: item.link || '#',
            pubDate: item.pubDate || '',
            source: item.source || 'Google News',
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
