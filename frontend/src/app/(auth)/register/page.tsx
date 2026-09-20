
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
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
          Create account
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Create your account to manage your personal finances.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 sm:mt-8">
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-2 block text-sm text-slate-400"
            >
              Name
            </label>

            <input
              id="register-name"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm text-slate-400"
            >
              Email
            </label>

            <input
              id="register-email"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm text-slate-400"
            >
              Password
            </label>

            <input
              id="register-password"
              className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
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
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}