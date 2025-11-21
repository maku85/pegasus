'use client';

import { motion } from 'framer-motion';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

interface Genre {
    id: number;
    name: string;
}

interface MovieFiltersProps {
    activeCategory: 'popular' | 'trending' | 'top_rated';
    activeGenre: string;
    genres: Genre[];
    onCategoryChange: (category: 'popular' | 'trending' | 'top_rated') => void;
    onGenreChange: (genreId: string) => void;
}

export default function MovieFilters({
    activeCategory,
    activeGenre,
    genres,
    onCategoryChange,
    onGenreChange,
}: MovieFiltersProps) {
    return (
        <div className="mb-8 space-y-6">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4">
                {[
                    { id: 'popular', label: 'Popolari' },
                    { id: 'trending', label: 'Di Tendenza' },
                    { id: 'top_rated', label: 'I Più Votati' },
                ].map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id as any)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-yellow-500 text-black shadow-lg scale-105'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Genres & Search/Sort placeholder */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:w-auto">
                    <div className="flex items-center gap-2 text-gray-400 px-2">
                        <FaFilter />
                        <span className="font-medium">Generi:</span>
                    </div>

                    <button
                        onClick={() => onGenreChange('')}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!activeGenre
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Tutti
                    </button>

                    {genres.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => onGenreChange(String(g.id))}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeGenre === String(g.id)
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
