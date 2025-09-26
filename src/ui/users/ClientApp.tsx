"use client";
import { useEffect } from "react";
import { useAuthStore, User } from "@/store/authStore";

type props = {
  initialUser: User | null;
};

export default function ClientApp({ initialUser }: props) {
  const hydrateFromServer = useAuthStore((s) => s.hydrateFromServer);

  useEffect(() => {
    hydrateFromServer(initialUser);
  }, [initialUser, hydrateFromServer]);

  return null;
}
