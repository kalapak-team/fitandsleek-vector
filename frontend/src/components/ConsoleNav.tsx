"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthUser, clearSession, getUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/console", label: "Overview", icon: IconHome },
      { href: "/console/api-keys", label: "API Keys", icon: IconKey },
      { href: "/console/collections", label: "Collections", icon: IconStack },
    ],
  },
  {
    label: "Search",
    items: [
      { href: "/console/search", label: "Vector Search", icon: IconSearch },
      { href: "/console/images", label: "Image Search", icon: IconImage },
      { href: "/console/recommend", label: "Recommend", icon: IconSpark },
      { href: "/console/upload", label: "Upload", icon: IconUpload },
    ],
  },
  {
    label: "Resources",
    items: [{ href: "/docs", label: "API Docs", icon: IconDocs }],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/console") return pathname === "/console";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type ConsoleNavProps = {
  open: boolean;
  onClose: () => void;
};

export function ConsoleNav({ open, onClose }: ConsoleNavProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-line bg-graphite transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-4">
          <Link href="/" className="min-w-0" onClick={onClose}>
            <p className="truncate text-[13px] font-extrabold tracking-tight text-mist">
              FITANDSLEEK <span className="text-mint">VECTOR</span>
            </p>
            <p className="text-[11px] text-mist/40">Operations console</p>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle className="shrink-0" />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist lg:hidden"
              onClick={onClose}
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-mist/35">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition",
                        active
                          ? "bg-mint/12 text-mint"
                          : "text-mist/65 hover:bg-mist/[0.05] hover:text-mist"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-mint" : "text-mist/45")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          {user ? (
            <div className="rounded-xl border border-line bg-panel p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint/15 text-xs font-bold text-mint">
                  {(user.email?.[0] || "U").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-mist">{user.email}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mint/80">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                className="mt-3 w-full rounded-lg border border-line px-3 py-1.5 text-left text-xs font-medium text-ember transition hover:bg-ember/10"
                onClick={() => {
                  clearSession();
                  window.location.href = "/login";
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm text-mint hover:underline">
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export function ConsoleTopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mist"
        aria-label="Open menu"
      >
        <IconMenu />
      </button>
      <Link href="/console" className="text-[13px] font-extrabold tracking-tight text-mist">
        FITANDSLEEK <span className="text-mint">VECTOR</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
function IconKey({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10.5 12.5 20 3.5M16 4.5l2.5 2.5M14.5 7 17 9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconStack({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m4 8 8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9" cy="10" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5.5 17.5 4.2-4.2a1.5 1.5 0 0 1 2.1 0l6.7 6.7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconSpark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 13.8 9l5.7 1.2-4.5 3.7 1.4 5.6L12 16.8 7.6 19.5l1.4-5.6-4.5-3.7L10.2 9 12 3.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 16V5M8.5 8.5 12 5l3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconDocs({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14 3.5V8h4.5M8.5 12h7M8.5 15.5h7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
