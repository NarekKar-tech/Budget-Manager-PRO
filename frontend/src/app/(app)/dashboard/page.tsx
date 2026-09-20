
"use client";

import { useEffect, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { CategoryChart, TrendChart } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { api } from "@/lib/api";

import type {
  DashboardSummary,
  Transaction,
} from "@/types";

import { useLanguage } from "@/context/LanguageContext";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    let active = true;

    Promise.all([
      api<DashboardSummary>("/analytics/dashboard"),
      api<Transaction[]>("/transactions"),
    ])
      .then(([dashboard, items]) => {
        if (!active) return;

        setSummary(dashboard);
        setTransactions(items.slice(0, 5));
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const trend = (summary?.monthly_trend ?? []).map(
    (item) => ({
      ...item,
      income: Number(item.income),
      expense: Number(item.expense),
    })
  );

  const categories = (
    summary?.category_expenses ?? []
  ).map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));

  return (
    <AppShell>

      <div className="w-full min-w-0 max-w-full">

        {/* Dashboard Header */}

        <div className="mb-6 sm:mb-8">

          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t("dashboard")}
          </h2>

        </div>

        {/* Loading */}

        {loading && (
          <div className="py-10 text-center text-slate-400">
            Loading dashboard...
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            Failed to load dashboard data.
          </div>
        )}

        {/* Dashboard Content */}

        {!loading && !error && (
          <>

            {/* Financial Cards */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="min-w-0">
                <StatCard
                  label={t("totalBalance")}
                  value={money.format(
                    Number(summary?.balance ?? 0)
                  )}
                  detail={t("incomeMinusExpenses")}
                  icon={Wallet}
                />
              </div>

              <div className="min-w-0">
                <StatCard
                  label={t("monthlyIncome")}
                  value={money.format(
                    Number(summary?.income ?? 0)
                  )}
                  detail={t("currentMonth")}
                  icon={ArrowUpRight}
                />
              </div>

              <div className="min-w-0">
                <StatCard
                  label={t("monthlyExpenses")}
                  value={money.format(
                    Number(summary?.expense ?? 0)
                  )}
                  detail={t("currentMonth")}
                  icon={ArrowDownRight}
                />
              </div>

              <div className="min-w-0">
                <StatCard
                  label={t("savingsRate")}
                  value={`${summary?.savings_rate ?? 0}%`}
                  detail={t("currentMonth")}
                  icon={PiggyBank}
                />
              </div>

            </div>

            {/* Charts */}

            <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">

              {/* Cash Flow Chart */}

              <div className="glass min-w-0 overflow-hidden rounded-2xl p-3 sm:rounded-3xl sm:p-6">

                <h3 className="mb-4 text-base font-semibold sm:text-lg">
                  {t("cashFlowTrend")}
                </h3>

                <div className="min-w-0 w-full overflow-hidden">
                  <TrendChart data={trend} />
                </div>

              </div>

              {/* Category Chart */}

              <div className="glass min-w-0 overflow-hidden rounded-2xl p-3 sm:rounded-3xl sm:p-6">

                <h3 className="mb-4 text-base font-semibold sm:text-lg">
                  {t("expenseBreakdown")}
                </h3>

                <div className="min-w-0 w-full overflow-hidden">
                  <CategoryChart data={categories} />
                </div>

              </div>

            </div>

            {/* Recent Transactions */}

            <div className="glass mt-6 min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6">

              <h3 className="text-base font-semibold sm:text-lg">
                {t("recentTransactions")}
              </h3>

              <div className="mt-4 divide-y divide-white/5">

                {transactions.length === 0 && (
                  <p className="py-6 text-sm text-slate-400">
                    No transactions yet.
                  </p>
                )}

                {transactions.map((item) => (

                  <div
                    key={item.id}
                    className="flex min-w-0 items-center justify-between gap-3 py-4"
                  >

                    {/* Transaction Info */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium sm:text-base">
                        {item.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.category.name}
                        {" · "}
                        {item.transaction_date}
                      </p>

                    </div>

                    {/* Transaction Amount */}

                    <p
                      className={`shrink-0 text-right text-xs font-medium tabular-nums sm:text-base ${
                        item.type === "income"
                          ? "text-emerald-300"
                          : "text-slate-200"
                      }`}
                    >

                      {item.type === "income" ? "+" : "-"}

                      {money.format(Number(item.amount))}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          </>
        )}

      </div>

    </AppShell>
  );
}