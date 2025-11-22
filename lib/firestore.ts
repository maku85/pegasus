import { db } from "./firebase";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from "firebase/firestore";

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

export const addToFavorites = async (userId: string, movie: Movie) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    // Use setDoc with merge: true to create if not exists
    await setDoc(userRef, {
        favorites: arrayUnion(movie)
    }, { merge: true });
};

export const removeFromFavorites = async (userId: string, movie: Movie) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        favorites: arrayRemove(movie)
    });
};

export const subscribeToFavorites = (userId: string, callback: (favorites: Movie[]) => void) => {
    if (!db) {
        callback([]);
        return () => { };
    }
    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().favorites || []);
        } else {
            callback([]);
        }
    });
};
