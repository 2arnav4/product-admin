"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/api/authApi";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
    >
      Log out
    </button>
  );
}
