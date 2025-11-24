import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    contentSnippet?: string;
}

export async function getNews(query: string, locale: string = 'it'): Promise<NewsItem[]> {
    try {
        const hl = locale === 'en' ? 'en-US' : 'it';
        const gl = locale === 'en' ? 'US' : 'IT';
        const ceid = locale === 'en' ? 'US:en' : 'IT:it';

        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
        const feed = await parser.parseURL(feedUrl);

        return feed.items.slice(0, 6).map((item) => {
            let title = item.title || 'Senza titolo';
            let source = item.source || 'Google News';
            let contentSnippet = item.contentSnippet;

            // Google News titles are often "Title - Source"
            const lastDashIndex = title.lastIndexOf(' - ');
            if (lastDashIndex !== -1) {
                source = title.substring(lastDashIndex + 3);
                title = title.substring(0, lastDashIndex);
            }

            // Check if snippet is redundant (contains title or is very short)
            if (contentSnippet) {
                const cleanSnippet = contentSnippet.replace(/\n/g, ' ').trim();
                const cleanTitle = title.trim();

                // If snippet is just the title + source or very similar, remove it
                if (cleanSnippet.includes(cleanTitle) || cleanSnippet.length < cleanTitle.length + 20) {
                    contentSnippet = undefined;
                }
            }

            return {
                title,
                link: item.link || '#',
                pubDate: item.pubDate || '',
                source,
                contentSnippet,
            };
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
