"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, loginRequest } from "@/lib/api";
import type { User } from "@/types";

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("budget_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api<User>("/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("budget_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await loginRequest(email, password);
    localStorage.setItem("budget_token", data.access_token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await api<{ access_token: string; user: User }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      },
      false
    );

    localStorage.setItem("budget_token", data.access_token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("budget_token");
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
