
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Tags,
  BarChart3,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const links = [
  ["/dashboard", "dashboard", LayoutDashboard],
  ["/transactions", "transactions", ReceiptText],
  ["/budgets", "budgets", PieChart],
  ["/categories", "categories", Tags],
  ["/analytics", "analytics", BarChart3],
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="lg:hidden">

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto border-t border-white/10 bg-slate-950 p-5 shadow-2xl"
        >
          <nav className="space-y-2">
            {links.map(([href, label, Icon]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-4 ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {t(label)}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-red-400"
            >
              <LogOut size={20} />
              {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}