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
import type { DashboardSummary, Transaction } from "@/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    Promise.all([
      api<DashboardSummary>("/analytics/dashboard"),
      api<Transaction[]>("/transactions"),
    ]).then(([dashboard, items]) => {
      setSummary(dashboard);
      setTransactions(items.slice(0, 5));
    });
  }, []);

  const trend = (summary?.monthly_trend ?? []).map((item) => ({
    ...item,
    income: Number(item.income),
    expense: Number(item.expense),
  }));

  const categories = (summary?.category_expenses ?? []).map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));

  return (
    <AppShell>
      <h2 className="text-3xl font-semibold">Dashboard</h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total balance" value={money.format(Number(summary?.balance ?? 0))} detail="Income minus expenses" icon={Wallet} />
        <StatCard label="Monthly income" value={money.format(Number(summary?.income ?? 0))} detail="Current month" icon={ArrowUpRight} />
        <StatCard label="Monthly expenses" value={money.format(Number(summary?.expense ?? 0))} detail="Current month" icon={ArrowDownRight} />
        <StatCard label="Savings rate" value={`${summary?.savings_rate ?? 0}%`} detail="Current month" icon={PiggyBank} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Cash flow trend</h3>
          <TrendChart data={trend} />
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Expense breakdown</h3>
          <CategoryChart data={categories} />
        </div>
      </div>

      <div className="glass mt-6 rounded-3xl p-6">
        <h3 className="text-lg font-semibold">Recent transactions</h3>
        <div className="mt-5 divide-y divide-white/5">
          {transactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.category.name} · {item.transaction_date}
                </p>
              </div>
              <p className={item.type === "income" ? "text-emerald-300" : ""}>
                {item.type === "income" ? "+" : "-"}
                {money.format(Number(item.amount))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
