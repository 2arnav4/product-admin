const TOKEN_KEY = "pa_token";
const EXPIRES_KEY = "pa_token_expires_at";

function isBrowser() {
    return typeof window !== "undefined";
}

export function saveToken(token, expiresInMinutes) {
    if (!isBrowser()) return;
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function getToken() {
    if (!isBrowser()) return null;
    const token = localStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY));
    const isExpired = !(expiresAt > Date.now());
    if (!token || isExpired) {
        clearToken();
        return null;
    }
    return token;
}

export function clearToken() {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
}

export function isLoggedIn() {
    return getToken() !== null;
}