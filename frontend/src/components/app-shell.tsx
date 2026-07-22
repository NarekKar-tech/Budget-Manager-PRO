"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/context/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
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
      <Sidebar />
      <main className="lg:pl-72">
        <header className="flex h-24 items-center justify-between border-b border-white/5 px-5 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Personal finance workspace</p>
            <h1 className="text-lg font-semibold">Welcome back, {user.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Bell className="h-5 w-5" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="grid-bg min-h-[calc(100vh-6rem)] p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
