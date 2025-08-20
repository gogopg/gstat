import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.reload();
        } catch (error) {
          console.error("로그아웃 API 호출 실패:", error);
        }
        set({ user: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
