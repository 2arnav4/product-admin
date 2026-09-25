"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", isActive: (path) => path === "/dashboard" },
  {
    href: "/products",
    label: "Products",
    isActive: (path) => path.startsWith("/products") && path !== "/products/new",
  },
  { href: "/products/new", label: "Add product", isActive: (path) => path === "/products/new" },
];

export default function Sidebar({ isOpen, onNavigate }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-gradient-to-b from-blue-800 to-blue-600 p-5 text-white transition-transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link href="/dashboard" onClick={onNavigate} className="mb-8 block border-b border-white/20 pb-6">
        <span className="block text-xl font-bold tracking-wide">Merchdesk</span>
        <span className="text-sm text-white/70">Admin panel</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={item.isActive(pathname) ? "page" : undefined}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
              item.isActive(pathname) ? "bg-white text-blue-800" : "text-white/85 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <LogoutButton className="rounded-lg border border-white/30 px-4 py-2.5 text-left text-sm font-medium hover:bg-white/10" />
    </aside>
  );
}
