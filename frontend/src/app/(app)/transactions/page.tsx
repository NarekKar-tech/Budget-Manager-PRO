"use client";

import { FormEvent, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";
import type { Category, Transaction } from "@/types";

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    await api("/transactions", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        category_id: Number(form.category_id),
      }),
    });
    setForm({ ...form, title: "", amount: "" });
    await load();
  }

  async function remove(id: number) {
    await api(`/transactions/${id}`, { method: "DELETE" });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <section className="glass rounded-3xl p-6">
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <div className="mt-6 divide-y divide-white/5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.category.name} · {item.transaction_date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span>${Number(item.amount).toFixed(2)}</span>
                  <button onClick={() => remove(item.id)}>
                    <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="glass h-fit rounded-3xl p-6">
          <h3 className="font-semibold">Add transaction</h3>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <select className="w-full rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select className="w-full rounded-2xl border border-white/10 bg-[#11131d] px-4 py-3" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
            <button className="w-full rounded-2xl bg-violet-600 px-4 py-3">
              Save transaction
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
