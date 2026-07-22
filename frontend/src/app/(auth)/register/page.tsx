"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="glass w-full max-w-md rounded-[2rem] p-8 shadow-glow">
        <Logo />
        <h1 className="mt-10 text-3xl font-semibold">Create account</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 font-medium">
            Create account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
