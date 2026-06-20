"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const candidateNav = [
  { href: "/dashboard", label: "Главная" },
  { href: "/assessment/global", label: "Практикум" },
  { href: "/topics", label: "Темы" },
  { href: "/results", label: "Результаты" },
  { href: "/leaderboard", label: "Рейтинг" },
  { href: "/profile", label: "Профиль" },
];

const recruiterNav = [
  { href: "/recruiter", label: "Обзор" },
  { href: "/recruiter/candidates", label: "Кандидаты" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  const isRecruiter = user?.role === "recruiter";
  const nav = isRecruiter ? recruiterNav : candidateNav;

  if (pathname === "/login" || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 lg:px-6">
          <Logo href={isRecruiter ? "/recruiter" : "/dashboard"} />

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "font-medium text-[var(--primary)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user && (
              <>
                <Avatar name={user.name} size="sm" />
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Выйти">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-[var(--border)] bg-white px-4 py-3 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">{children}</main>
    </div>
  );
}
