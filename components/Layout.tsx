"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/upload", label: "Upload TCs", icon: "📤" },
  { href: "/explore", label: "Explore", icon: "🔍" },
  { href: "/generate", label: "Generate", icon: "⚙️" },
  { href: "/reports", label: "Reports", icon: "📈" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <nav className="sidebar flex flex-col relative">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">TC-to-Playwright</h1>
          <p className="text-xs text-gray-400 mt-1">Test Case Automation Tool</p>
        </div>

        <div className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="text-xs text-gray-500">
            <p>v1.0.0</p>
            <p>Powered by Stagehand + Playwright</p>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
