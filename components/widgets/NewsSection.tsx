import { getNews } from "@/lib/news";
import { FaNewspaper, FaExternalLinkAlt } from "react-icons/fa";

interface NewsSectionProps {
    query: string;
}

export default async function NewsSection({ query }: NewsSectionProps) {
    const news = await getNews(query);

    if (news.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-red-500 rounded-full"></span>
                Ultime Notizie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/5 hover:bg-white/10 p-6 rounded-xl transition-all group border border-white/5 hover:border-white/20"
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <FaNewspaper className="text-2xl text-red-500 flex-shrink-0" />
                            <FaExternalLinkAlt className="text-gray-500 group-hover:text-white transition-colors text-sm" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                            {item.title}
                        </h3>
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
                            <span>{new Date(item.pubDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            {/* <span>{item.source}</span> */}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
