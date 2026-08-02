"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthUser, clearSession, getUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

const items = [
  { href: "/console", label: "Overview" },
  { href: "/console/api-keys", label: "API Keys" },
  { href: "/console/collections", label: "Collections" },
  { href: "/console/search", label: "Vector Search" },
  { href: "/console/recommend", label: "Recommend" },
  { href: "/console/images", label: "Image Search" },
  { href: "/console/upload", label: "Upload" },
  { href: "/docs", label: "API Docs" },
];

export function ConsoleNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <aside className="fs-panel flex w-full flex-col gap-1 p-4 md:min-h-[70vh] md:w-56">
      <div className="mb-4 flex items-start justify-between gap-2">
        <Link href="/" className="font-display text-lg font-bold text-mist">
          FitandSleek <span className="text-mint">Vector</span>
        </Link>
        <ThemeToggle className="shrink-0" />
      </div>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-sm px-3 py-2 text-sm transition ${
              active ? "bg-mint/15 text-mint" : "text-mist/65 hover:bg-mist/5 hover:text-mist"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto border-t border-line pt-4">
        {user ? (
          <>
            <p className="truncate text-xs text-mist/45">{user.email}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-mint/70">{user.role}</p>
            <button
              className="mt-2 text-left text-sm text-ember hover:underline"
              onClick={() => {
                clearSession();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm text-mint hover:underline">
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
