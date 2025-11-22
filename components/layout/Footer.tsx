import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">CineSphere</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              La tua destinazione principale per scoprire film, serie TV e celebrità.
              Powered by TMDB.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Link Rapidi</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/movies" className="hover:text-yellow-400 transition-colors">Film</Link></li>
              <li><Link href="/tv" className="hover:text-yellow-400 transition-colors">Serie TV</Link></li>
              <li><Link href="/news" className="hover:text-yellow-400 transition-colors">News</Link></li>
              <li><Link href="/watchlist" className="hover:text-yellow-400 transition-colors">Watchlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Note Legali</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Questo prodotto utilizza l'API di TMDB ma non è approvato o certificato da TMDB.
            </p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CineSphere. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
