import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export async function getNews(query: string, locale: string = 'it'): Promise<NewsItem[]> {
    try {
        const hl = locale === 'en' ? 'en-US' : 'it';
        const gl = locale === 'en' ? 'US' : 'IT';
        const ceid = locale === 'en' ? 'US:en' : 'IT:it';

        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
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
