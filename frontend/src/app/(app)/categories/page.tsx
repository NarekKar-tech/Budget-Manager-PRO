"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");

  async function load() {
    setItems(await api<Category[]>("/categories"));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api("/categories", {
      method: "POST",
      body: JSON.stringify({
        name,
        color: "#7C3AED",
        icon: "Wallet",
      }),
    });
    setName("");
    await load();
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold">Categories</h2>
        <form onSubmit={submit} className="flex gap-3">
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="rounded-2xl bg-violet-600 px-5 py-3">
            Create
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-3xl p-5">
            <div className="h-10 w-10 rounded-2xl" style={{ background: item.color }} />
            <h3 className="mt-5 font-semibold">{item.name}</h3>
            <p className="text-xs text-slate-500">{item.icon}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
