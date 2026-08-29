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
import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/LanguageContext";

const links = [
  ["/dashboard", "dashboard", LayoutDashboard],
  ["/transactions", "transactions", ReceiptText],
  ["/budgets", "budgets", PieChart],
  ["/categories", "categories", Tags],
  ["/analytics", "analytics", BarChart3],
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useLanguage();

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
            {t(label)}
          </Link>
        ))}
      </nav>

      {/* Sidebar-ի ներքևի հատված */}
      <div className="mt-auto space-y-2">
        {/* Language selector */}
        <LanguageSelector />

        {/* Sign out */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}