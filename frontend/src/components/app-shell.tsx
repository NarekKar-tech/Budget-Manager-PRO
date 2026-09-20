
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { useAuth } from "@/context/auth-context";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-400">
        Loading Budget Manager Pro...
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 lg:pl-72">

        {/* Header */}
        <header className="relative z-50 flex h-20 items-center justify-between gap-3 border-b border-white/5 px-4 sm:px-8 lg:h-24">

          {/* Left Side */}
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Welcome Message */}
            <div className="min-w-0">

              <p className="hidden text-sm text-slate-500 sm:block">
                Personal finance workspace
              </p>

              <h1 className="truncate text-sm font-semibold sm:text-lg">
                Welcome back, {user.name}
              </h1>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 sm:h-11 sm:w-11 sm:rounded-2xl"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* User Avatar */}
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-semibold sm:h-11 sm:w-11 sm:rounded-2xl">

              {user.name.charAt(0).toUpperCase()}

            </div>

          </div>

        </header>

        {/* Page Content */}
        <div className="grid-bg min-h-[calc(100vh-5rem)] min-w-0 p-4 sm:p-8 lg:min-h-[calc(100vh-6rem)]">

          {children}

        </div>

      </main>

    </div>
  );
}