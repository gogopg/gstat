import { cookies } from "next/headers";

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
