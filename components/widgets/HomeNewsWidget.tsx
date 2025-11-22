import { getNews } from "@/lib/news";
import Link from "next/link";
import { FaNewspaper, FaArrowRight } from "react-icons/fa";

export default async function HomeNewsWidget() {
    const news = await getNews("Cinema e Serie TV");

    if (news.length === 0) return null;

    return (
        <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
                    <span className="w-1 h-8 bg-red-500 rounded-full"></span>
                    Ultime Notizie
                </h2>
                <Link
                    href="/news"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                >
                    Vedi tutte <FaArrowRight />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {news.slice(0, 4).map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-[#1a1a1a] hover:bg-[#252525] rounded-xl overflow-hidden transition-all duration-300 border border-white/5 hover:border-white/20 h-full flex flex-col"
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-red-500 mb-3">
                                <FaNewspaper />
                                <span className="text-xs font-bold uppercase tracking-wider">News</span>
                            </div>
                            <h3 className="font-bold text-white mb-3 line-clamp-3 group-hover:text-red-400 transition-colors flex-1">
                                {item.title}
                            </h3>
                            <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-white/5">
                                {new Date(item.pubDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
