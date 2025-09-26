import { create } from "zustand";

export type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hydrateFromServer: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, isAuthenticated: false });
    window.location.href = "/";
  },
  hydrateFromServer: (user) => {
    if (user) set({ user, isAuthenticated: true });
    else set({ user: null, isAuthenticated: false });
  },
}));
