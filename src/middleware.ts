import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get("user-session");

  if (userSession) {
    try {
      const parsed = JSON.parse(userSession.value);
      if (parsed.id && parsed.username) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", parsed.id);
        requestHeaders.set("x-user-username", parsed.username);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    } catch (error) {
      console.error("Failed to parse user session:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
