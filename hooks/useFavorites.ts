"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { auth } from "@/lib/firebase";
import { subscribeToFavorites, addToFavorites as firestoreAdd, removeFromFavorites as firestoreRemove, Movie } from "@/lib/firestore";

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFavorites(user.uid, (data) => {
            setFavorites(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addToFavorites = async (movie: Movie) => {
        if (!user) return;
        await firestoreAdd(user.uid, movie);
    };

    const removeFromFavorites = async (movie: Movie) => {
        if (!user) return;
        await firestoreRemove(user.uid, movie);
    };

    const isFavorite = (movieId: number) => {
        return favorites.some(f => f.id === movieId);
    };

    const isAvailable = !!auth;

    return { favorites, loading, addToFavorites, removeFromFavorites, isFavorite, isAvailable };
}
