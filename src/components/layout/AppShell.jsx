"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-60">
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            Menu
          </button>
          <Link href="/dashboard" className="font-semibold text-gray-900">
            Merchdesk
          </Link>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
