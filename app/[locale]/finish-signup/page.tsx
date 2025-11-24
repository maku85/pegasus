"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function FinishSignupPage() {
  const { finishMagicLinkSignIn } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("Verifica in corso...");

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const user = await finishMagicLinkSignIn();
        if (user) {
          setStatus("Accesso completato! Reindirizzamento...");
          setTimeout(() => {
            router.push("/favorites");
          }, 2000);
        } else {
          setStatus("Link non valido o scaduto.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Si è verificato un errore durante l'accesso.");
      }
    };

    completeSignIn();
  }, [finishMagicLinkSignIn, router]);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
      </div>
    </div>
  );
}
