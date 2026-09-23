import { useSyncExternalStore } from "react";
import { isLoggedIn } from "@/lib/auth";

function subscribe(onStoreChange) {
    window.addEventListener("storage", onStoreChange);
    return () => window.removeEventListener("storage", onStoreChange);
}

function getServerSnapshot() {
    return null;
}

export function useIsLoggedIn() {
    return useSyncExternalStore(subscribe, isLoggedIn, getServerSnapshot);
}