"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { isLoggedIn } from "@/lib/auth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    if (loggedIn === false) {
      const current = window.location.pathname + window.location.search;
      router.replace(`/login?next=${encodeURIComponent(current)}`);
    }
  }, [loggedIn, router]);

  // Back/Forward can restore a frozen copy of this page from the browser's
  // back-forward cache, where effects don't re-run. Reload so the guard runs fresh.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted && !isLoggedIn()) window.location.reload();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (!loggedIn) {
    return <p className="p-8 text-center text-sm text-gray-500">Checking session…</p>;
  }

  return children;
}
