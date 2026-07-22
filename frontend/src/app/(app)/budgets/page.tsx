"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";
import type { Budget, Category } from "@/types";

export default function BudgetsPage() {
  const now = new Date();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    amount: "",
    category_id: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  async function load() {
    const [items, categoryItems] = await Promise.all([
      api<Budget[]>("/budgets"),
      api<Category[]>("/categories"),
    ]);
    setBudgets(items);
    setCategories(categoryItems);

    if (!form.category_id && categoryItems[0]) {
      setForm((current) => ({
        ...current,
        category_id: String(categoryItems[0].id),
      }));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api("/budgets", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        category_id: Number(form.category_id),
      }),
    });
    setForm({ ...form, amount: "" });
    await load();
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold">Budgets</h2>
        <form onSubmit={submit} className="flex flex-wrap gap-3">
          <select className="rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="w-36 rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Limit" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <button className="rounded-2xl bg-violet-600 px-5 py-3">
            Add budget
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => (
          <div key={budget.id} className="glass rounded-3xl p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold">{budget.category.name}</h3>
              <span className="text-sm text-slate-500">
                {budget.month}/{budget.year}
              </span>
            </div>
            <div className="mt-6 flex justify-between">
              <p className="text-2xl font-semibold">
                ${Number(budget.spent).toFixed(0)}
              </p>
              <p className="text-sm text-slate-400">
                of ${Number(budget.amount).toFixed(0)}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{ width: `${Math.min(budget.progress, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {budget.progress}% used
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
