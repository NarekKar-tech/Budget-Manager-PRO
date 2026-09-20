
"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";
import type { Budget, Category } from "@/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState(() => {
    const now = new Date();

    return {
      amount: "",
      category_id: "",
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [items, categoryItems] = await Promise.all([
      api<Budget[]>("/budgets"),
      api<Category[]>("/categories"),
    ]);

    setBudgets(items);
    setCategories(categoryItems);

    setForm((current) => ({
      ...current,
      category_id:
        categoryItems.some(
          (category) => String(category.id) === current.category_id
        )
          ? current.category_id
          : String(categoryItems[0]?.id ?? ""),
    }));
  }

  useEffect(() => {
    let active = true;

    Promise.all([
      api<Budget[]>("/budgets"),
      api<Category[]>("/categories"),
    ])
      .then(([items, categoryItems]) => {
        if (!active) return;

        setBudgets(items);
        setCategories(categoryItems);

        setForm((current) => ({
          ...current,
          category_id:
            categoryItems.some(
              (category) => String(category.id) === current.category_id
            )
              ? current.category_id
              : String(categoryItems[0]?.id ?? ""),
        }));
      })
      .catch(() => {
        if (active) setError("Failed to load budgets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || !form.category_id) return;

    setSaving(true);
    setError("");

    try {
      await api("/budgets", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          category_id: Number(form.category_id),
        }),
      });

      setForm((current) => ({
        ...current,
        amount: "",
      }));

      await load();
    } catch {
      setError("Failed to save budget.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="w-full min-w-0 max-w-full">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Budgets
        </h2>

        {/* Add budget form */}
        <form
          onSubmit={submit}
          className="glass mt-6 grid min-w-0 grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-2 sm:rounded-3xl sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <div className="min-w-0">
            <label
              htmlFor="budget-category"
              className="mb-2 block text-sm text-slate-400"
            >
              Category
            </label>

            <select
              id="budget-category"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3 text-base"
              value={form.category_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category_id: event.target.value,
                }))
              }
              required
            >
              <option value="" disabled>
                Select category
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="budget-amount"
              className="mb-2 block text-sm text-slate-400"
            >
              Monthly limit
            </label>

            <input
              id="budget-amount"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              placeholder="0.00"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={form.amount}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  amount: event.target.value,
                }))
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || loading || categories.length === 0}
            className="w-full rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 xl:col-span-1 xl:self-end"
          >
            {saving ? "Saving..." : "Add budget"}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {loading && (
          <p className="mt-8 text-sm text-slate-400">
            Loading budgets...
          </p>
        )}

        {!loading && budgets.length === 0 && (
          <p className="mt-8 text-sm text-slate-400">
            No budgets yet.
          </p>
        )}

        {/* Budget cards */}
        <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => {
            const progress = Number(budget.progress);
            const safeProgress = Number.isFinite(progress)
              ? Math.max(0, Math.min(progress, 100))
              : 0;

            return (
              <div
                key={budget.id}
                className="glass min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <h3 className="min-w-0 break-words font-semibold">
                    {budget.category.name}
                  </h3>

                  <span className="shrink-0 text-xs text-slate-500 sm:text-sm">
                    {budget.month}/{budget.year}
                  </span>
                </div>

                <div className="mt-6 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                  <p className="min-w-0 break-words text-2xl font-semibold tabular-nums">
                    {money.format(Number(budget.spent))}
                  </p>

                  <p className="min-w-0 break-words text-sm text-slate-400">
                    of {money.format(Number(budget.amount))}
                  </p>
                </div>

                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"
                  role="progressbar"
                  aria-label={`${budget.category.name} budget used`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeProgress}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {budget.progress}% used
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}