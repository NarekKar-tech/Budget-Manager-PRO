
"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CategoryChart, TrendChart } from "@/components/charts";
import { api } from "@/lib/api";

import type { DashboardSummary } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    api<DashboardSummary>("/analytics/dashboard")
      .then((result) => {
        if (active) setData(result);
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

  const trend = (data?.monthly_trend ?? []).map((item) => ({
    ...item,
    income: Number(item.income),
    expense: Number(item.expense),
  }));

  const categories = (data?.category_expenses ?? []).map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));

  return (
    <AppShell>
      <div className="w-full min-w-0 max-w-full">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Analytics
        </h2>

        {loading && (
          <p className="mt-6 text-sm text-slate-400">
            Loading analytics...
          </p>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            Failed to load analytics data.
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:gap-6 xl:grid-cols-2">
            {/* Monthly cash flow */}
            <section className="glass min-w-0 overflow-hidden rounded-2xl p-3 sm:rounded-3xl sm:p-6">
              <h3 className="mb-4 text-base font-semibold sm:text-lg">
                Monthly cash flow
              </h3>

              <div className="w-full min-w-0">
                <TrendChart data={trend} />
              </div>
            </section>

            {/* Spending distribution */}
            <section className="glass min-w-0 overflow-hidden rounded-2xl p-3 sm:rounded-3xl sm:p-6">
              <h3 className="mb-4 text-base font-semibold sm:text-lg">
                Spending distribution
              </h3>

              <div className="w-full min-w-0">
                <CategoryChart data={categories} />
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}