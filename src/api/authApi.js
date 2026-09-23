import api from "@/lib/axios"
import { saveToken, clearToken } from "@/lib/auth";

const SESSION_MINUTES = 60;

export async function login(username, password) {
    const { data } = await api.post("/auth/login", {
        username,
        password,
        expiresInMins: SESSION_MINUTES,
    });
    const { accessToken, refreshToken, ...user } = data;
    saveToken(accessToken, SESSION_MINUTES);
    return user;

}
export function logout() {
    clearToken();
}