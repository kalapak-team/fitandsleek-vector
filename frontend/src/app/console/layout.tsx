"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConsoleNav } from "@/components/ConsoleNav";
import { getApiKey, getToken } from "@/lib/auth";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    // encourage API key presence for vector calls
    if (!getApiKey() && !window.location.pathname.includes("/api-keys")) {
      router.replace("/console/api-keys");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-ink">
      <div className="fs-container grid gap-6 py-6 md:grid-cols-[14rem_1fr]">
        <ConsoleNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
