"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  PieChart,
  ReceiptText,
  Tags,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/transactions", "Transactions", ReceiptText],
  ["/budgets", "Budgets", PieChart],
  ["/categories", "Categories", Tags],
  ["/analytics", "Analytics", BarChart3],
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="glass fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-y-0 border-l-0 p-6 lg:flex">
      <Logo />
      <nav className="mt-12 space-y-2">
        {links.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
              pathname === href
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </button>
    </aside>
  );
}
