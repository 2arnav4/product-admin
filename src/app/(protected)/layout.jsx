import AuthGuard from "@/components/auth/AuthGuard";
import LogoutButton from "@/components/auth/LogoutButton";

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Product Admin</span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </AuthGuard>
  );
}
