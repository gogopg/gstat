import { cookies } from "next/headers";

export async function getSessionUser() {
  const cookie = (await cookies()).get("user-session");
  if (!cookie) return null;

  try {
    const user = JSON.parse(cookie.value);
    return { id: user.id, username: user.username };
  } catch {
    return null;
  }
}