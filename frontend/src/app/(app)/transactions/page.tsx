
"use client";

import { FormEvent, useEffect, useState } from "react";
import { Trash2, PlusCircle } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";

import type { Category, Transaction } from "@/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    transaction_date: new Date().toISOString().slice(0, 10),
    category_id: "",
  });

  async function load() {
    const [transactions, categoryItems] = await Promise.all([
      api<Transaction[]>("/transactions"),
      api<Category[]>("/categories"),
    ]);

    setItems(transactions);
    setCategories(categoryItems);

    setForm((current) => ({
      ...current,
      category_id:
        current.category_id || String(categoryItems[0]?.id ?? ""),
    }));
  }

  useEffect(() => {
    let active = true;

    Promise.all([
      api<Transaction[]>("/transactions"),
      api<Category[]>("/categories"),
    ])
      .then(([transactions, categoryItems]) => {
        if (!active) return;

        setItems(transactions);
        setCategories(categoryItems);

        setForm((current) => ({
          ...current,
          category_id:
            current.category_id || String(categoryItems[0]?.id ?? ""),
        }));
      })
      .catch(() => {
        if (active) {
          setError("Failed to load transactions.");
        }
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
      await api("/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          category_id: Number(form.category_id),
        }),
      });

      setForm((current) => ({
        ...current,
        title: "",
        amount: "",
      }));

      await load();
    } catch {
      setError("Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (deletingId !== null) return;

    setDeletingId(id);
    setError("");

    try {
      await api(`/transactions/${id}`, {
        method: "DELETE",
      });

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch {
      setError("Failed to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">

        {/* Add Transaction Form */}

        <form
          onSubmit={submit}
          className="glass order-1 h-fit min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6 xl:order-2"
        >

          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-violet-400" />

            <h3 className="text-lg font-semibold">
              Add transaction
            </h3>
          </div>

          <div className="mt-6 space-y-4">

            {/* Title */}

            <div>
              <label
                htmlFor="transaction-title"
                className="mb-2 block text-sm text-slate-400"
              >
                Title
              </label>

              <input
                id="transaction-title"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
                placeholder="Transaction title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Amount */}

            <div>
              <label
                htmlFor="transaction-amount"
                className="mb-2 block text-sm text-slate-400"
              >
                Amount
              </label>

              <input
                id="transaction-amount"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
                placeholder="0.00"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Transaction Type */}

            <div>
              <label
                htmlFor="transaction-type"
                className="mb-2 block text-sm text-slate-400"
              >
                Type
              </label>

              <select
                id="transaction-type"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3 text-base"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}

            <div>
              <label
                htmlFor="transaction-category"
                className="mb-2 block text-sm text-slate-400"
              >
                Category
              </label>

              <select
                id="transaction-category"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3 text-base"
                value={form.category_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category_id: e.target.value,
                  })
                }
                required
              >
                <option value="" disabled>
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}

            <div>
              <label
                htmlFor="transaction-date"
                className="mb-2 block text-sm text-slate-400"
              >
                Date
              </label>

              <input
                id="transaction-date"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
                type="date"
                value={form.transaction_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transaction_date: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Save Button */}

            <button
              type="submit"
              disabled={saving || loading || categories.length === 0}
              className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save transaction"}
            </button>

          </div>
        </form>

        {/* Transactions List */}

        <section className="glass order-2 min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6 xl:order-1">

          <h2 className="text-xl font-semibold sm:text-2xl">
            Transactions
          </h2>

          {/* Error Message */}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Loading */}

          {loading && (
            <p className="mt-6 text-sm text-slate-400">
              Loading transactions...
            </p>
          )}

          {/* Empty State */}

          {!loading && items.length === 0 && (
            <p className="mt-6 text-sm text-slate-400">
              No transactions yet.
            </p>
          )}

          {/* Transaction Items */}

          <div className="mt-4 divide-y divide-white/5">

            {items.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 items-center justify-between gap-3 py-4"
              >

                {/* Transaction Details */}

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

                {/* Amount and Delete */}

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">

                  <span
                    className={`text-right text-xs font-medium tabular-nums sm:text-base ${
                      item.type === "income"
                        ? "text-emerald-300"
                        : "text-slate-200"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {money.format(Number(item.amount))}
                  </span>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    disabled={deletingId !== null}
                    aria-label={`Delete ${item.title}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>

      </div>
    </AppShell>
  );
}