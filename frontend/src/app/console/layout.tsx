"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsoleNav, ConsoleTopBar } from "@/components/ConsoleNav";
import { getApiKey, getToken } from "@/lib/auth";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    if (!getApiKey() && !window.location.pathname.includes("/api-keys")) {
      router.replace("/console/api-keys");
    }
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-ink text-mist">
      <ConsoleTopBar onMenu={() => setMenuOpen(true)} />
      <ConsoleNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[17.5rem]">
        <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
