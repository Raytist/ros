"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { api } from "@/services/api/client";
import { setApiTokenGetter } from "@/services/api/fetch-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password, role = "candidate") => {
        try {
          const { user, token } = await api.auth.login(email, password, role);
          set({ user, token, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      switchRole: async (role) => {
        const email =
          role === "recruiter" ? "recruiter@roseltorg.ru" : "anna.petrova@example.ru";
        await get().login(email, "demo", role);
      },
    }),
    { name: "roseltorg-auth" }
  )
);

setApiTokenGetter(() => useAuthStore.getState().token);
