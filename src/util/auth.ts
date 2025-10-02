import { cookies } from "next/headers";
import { headers } from "next/headers";

export type SessionUser = {
  id: string;
  username: string;
};

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SessionUser>;
  return typeof candidate.id === "string" && typeof candidate.username === "string";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const headerStore = await Promise.resolve(headers());
  const userId = headerStore.get("x-user-id");
  const username = headerStore.get("x-user-username");

  if (userId && username) {
    return { id: userId, username };
  }

  const cookieStore = await Promise.resolve(cookies());
  const cookie = cookieStore.get("user-session");
  if (!cookie) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(cookie.value);
    if (isSessionUser(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
