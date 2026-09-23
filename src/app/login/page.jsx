"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/authApi";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

const DEFAULT_REDIRECT = "/products";

function getSafeRedirect() {
  const next = new URLSearchParams(window.location.search).get("next");
  const isInternalPath =
    next !== null &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\");
  return isInternalPath ? next : DEFAULT_REDIRECT;
}

export default function LoginPage() {
  const router = useRouter();
  const loggedIn = useIsLoggedIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (loggedIn) router.replace(getSafeRedirect());
  }, [loggedIn, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;

    if (!username.trim() || !password) {
      setError("Enter both username and password.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      await login(username.trim(), password);
      router.replace(getSafeRedirect());
    } catch (err) {
      setError(err.message);
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>

        <label className="block text-sm text-gray-700">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          />
        </label>

        <label className="block text-sm text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-gray-500">Demo login: emilys / emilyspass</p>
      </form>
    </main>
  );
}
