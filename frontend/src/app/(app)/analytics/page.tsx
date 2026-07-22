"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CategoryChart, TrendChart } from "@/components/charts";
import { api } from "@/lib/api";
import type { DashboardSummary } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api<DashboardSummary>("/analytics/dashboard").then(setData);
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
      <h2 className="text-3xl font-semibold">Analytics</h2>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="font-semibold">Monthly cash flow</h3>
          <TrendChart data={trend} />
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-semibold">Spending distribution</h3>
          <CategoryChart data={categories} />
        </div>
      </div>
    </AppShell>
  );
}
