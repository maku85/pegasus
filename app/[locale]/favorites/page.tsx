"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import MovieCard from "@/components/media/MovieCard";
import MovieCardSkeleton from "@/components/media/MovieCardSkeleton";
import { FaHeart, FaUser, FaEnvelope, FaMagic } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FavoritesPage() {
    const t = useTranslations('FavoritesPage');
    const { favorites, loading: favoritesLoading, isAvailable } = useFavorites();
    const { user, sendMagicLink } = useAuth();
    const [email, setEmail] = useState("");
    const [linkSent, setLinkSent] = useState(false);

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const success = await sendMagicLink(email);
        if (success) {
            setLinkSent(true);
        }
    };

    if (favoritesLoading) {
        return (
            <div className="text-white pt-8 pb-20 px-6 md:px-12 min-h-screen bg-[#141414]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10 animate-pulse h-48"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAvailable) {
        return (
            <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <FaHeart className="text-4xl text-gray-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{t('unavailableTitle')}</h2>
                <p className="text-gray-400 text-lg max-w-md">
                    {t('unavailableDescription')}
                </p>
            </div>
        );
    }

    return (
        <div className="text-white pt-8 pb-20 px-6 md:px-12 min-h-screen bg-[#141414]">
            <div className="max-w-7xl mx-auto">

                {/* Profile Section */}
                <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">
                            <FaUser />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2">{t('profileTitle')}</h2>
                            <p className="text-gray-400 mb-4">
                                {user?.isAnonymous ? t('anonymousUser') : t('loggedInAs', { email: user?.email || '' })}
                            </p>

                            {user?.isAnonymous && !linkSent && (
                                <div className="max-w-md">
                                    <p className="text-sm text-gray-300 mb-3">
                                        {t('saveFavoritesPrompt')}
                                    </p>
                                    <form onSubmit={handleSendLink} className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="tua@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FaMagic /> {t('sendLink')}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {linkSent && (
                                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center gap-3">
                                    <FaEnvelope />
                                    <span>{t('linkSent')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Favorites Section */}
                <div className="flex items-center gap-3 mb-8">
                    <FaHeart className="text-red-500 text-3xl" />
                    <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-gray-300">
                        {favorites.length}
                    </span>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">{t('noFavorites')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {favorites.map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <MovieCard movie={movie} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
