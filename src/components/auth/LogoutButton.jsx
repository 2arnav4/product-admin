"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/api/authApi";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Log out
    </button>
  );
}
