"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface JournalUser {
  id: number;
  salutation?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  designation?: string;
  affiliation?: string;
  country?: string;
  state?: string;
  city?: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  profile_image?: string;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: JournalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function JournalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JournalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/journals/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/journals/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refresh();
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/journals/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useJournalAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useJournalAuth must be used within JournalAuthProvider");
  }
  return context;
}
