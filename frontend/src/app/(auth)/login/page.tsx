"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo@budgetpro.dev");
  const [password, setPassword] = useState("Demo123!");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="glass w-full max-w-md rounded-[2rem] p-8 shadow-glow">
        <Logo />
        <h1 className="mt-10 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm text-slate-400">
          Track money, plan budgets, and understand spending.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 font-medium">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{" "}
          <Link href="/register" className="text-violet-300">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
