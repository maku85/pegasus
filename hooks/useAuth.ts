import { useState, useEffect } from "react";
import {
    User,
    onAuthStateChanged,
    signInAnonymously as firebaseSignInAnonymously,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    linkWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInAnonymously = async () => {
        if (!auth) return;
        try {
            await firebaseSignInAnonymously(auth);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
        }
    };

    const sendMagicLink = async (email: string) => {
        if (!auth) return false;
        const actionCodeSettings = {
            url: window.location.origin + '/finish-signup',
            handleCodeInApp: true,
        };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            return true;
        } catch (error) {
            console.error("Error sending magic link:", error);
            return false;
        }
    };

    const finishMagicLinkSignIn = async () => {
        if (!auth) return null;
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if (email) {
                try {
                    const result = await signInWithEmailLink(auth, email, window.location.href);
                    window.localStorage.removeItem('emailForSignIn');
                    return result.user;
                } catch (error) {
                    console.error("Error signing in with magic link:", error);
                    throw error;
                }
            }
        }
        return null;
    };

    return { user, loading, signInAnonymously, sendMagicLink, finishMagicLinkSignIn };
}
