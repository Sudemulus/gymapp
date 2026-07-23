"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import Logo from "@/components/Logo";

export default function NavBar() {
  const { user, loading, logout } = useAuth();

  function handleLogout() {
    logout();
    // Full reload instead of router.push: guarantees a clean state and avoids
    // racing with useRequireAuth's own redirect-to-login effect on protected pages.
    window.location.href = "/";
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight"
        >
          <Logo className="h-9 w-9" />
          <span className="text-slate-50">
            Track<span className="text-emerald-400">Gym</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
          <Link href="/exercises" className="hover:text-emerald-400 transition-colors">
            Egzersizler
          </Link>
          <Link href="/workout" className="hover:text-emerald-400 transition-colors">
            Antrenman
          </Link>

          {!loading && user && (
            <>
              <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/body-stats" className="hover:text-emerald-400 transition-colors">
                Ölçülerim
              </Link>
              <span className="text-slate-500">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-200 transition-colors hover:bg-slate-700"
              >
                Çıkış Yap
              </button>
            </>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
