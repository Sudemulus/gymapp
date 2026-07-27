"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Flame, LayoutDashboard, Ruler, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/exercises", label: "Egzersizler", icon: Dumbbell },
  { href: "/workout", label: "Antrenman", icon: Flame },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
  { href: "/body-stats", label: "Ölçülerim", icon: Ruler, protected: true },
];

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    // Full reload instead of router.push: guarantees a clean state and avoids
    // racing with useRequireAuth's own redirect-to-login effect on protected pages.
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/80 shadow-lg shadow-black/20 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <Logo className="h-9 w-9" />
          <span className="text-slate-50">
            Track<span className="text-emerald-400">Gym</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.filter((link) => !link.protected || user).map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.25} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}

          {!loading && user && (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-800 pl-3">
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-xs font-bold text-slate-950">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" strokeWidth={2.25} />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            </div>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              className="ml-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 px-3.5 py-2 font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.03]"
            >
              <LogIn className="h-4 w-4" strokeWidth={2.25} />
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
