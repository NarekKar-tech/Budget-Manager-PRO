
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen min-w-0 place-items-center px-4 py-8 sm:px-5">
      <div className="glass w-full min-w-0 max-w-md rounded-2xl p-5 shadow-glow sm:rounded-[2rem] sm:p-8">
        <Logo />

        <h1 className="mt-8 text-2xl font-semibold sm:mt-10 sm:text-3xl">
          Sign in
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Track money, plan budgets, and understand spending.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 sm:mt-8">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm text-slate-400"
            >
              Email
            </label>

            <input
              id="login-email"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm text-slate-400"
            >
              Password
            </label>

            <input
              id="login-password"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}