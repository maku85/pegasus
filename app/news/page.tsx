import NewsSection from "@/components/widgets/NewsSection";

export default function NewsPage() {
    return (
        <div className="text-white pt-8 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        Notizie dal Mondo <span className="text-red-500">Cinema</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Rimani aggiornato con le ultime novità su film, serie TV e le tue star preferite.
                    </p>
                </header>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold">Cinema</h2>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <NewsSection query="Cinema Film Nuove Uscite" />
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold">Serie TV</h2>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <NewsSection query="Serie TV Netflix Prime Disney+" />
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold">Celebrità</h2>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <NewsSection query="Attori Hollywood Gossip" />
                </section>
            </div>
        </div>
    );
}
