import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { schema } from "@/db/schema";

interface RequestBody {
  id: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json().catch(() => ({}));
    const { id, email, password, passwordCheck } = body;

    if (!id || !email || !password || !passwordCheck) {
      return NextResponse.json({ message: "모든 필드를 채워주세요." }, { status: 400 });
    }
    if (password !== passwordCheck) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, id));
      if (existingUser.length > 0) {
        return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
      }

      const insertedUsers = await db
        .insert(schema.users)
        .values({
          username: id, // 요청 본문의 id를 username 컬럼에 매핑
          email,
          passwordHash: hashedPassword,
        })
        .returning({
          id: schema.users.id,
          username: schema.users.username,
          email: schema.users.email,
          createdAt: schema.users.createdAt,
        });

      return NextResponse.json(
        { user: insertedUsers[0], message: "회원가입이 성공적으로 완료되었습니다." },
        { status: 201 },
      );
    } catch (error: unknown) { // any 대신 unknown 사용
      console.error("Database operation error:", error);

      if (error && typeof error === 'object' && 'code' in error) {
        const dbError = error as { code: string; detail?: string };

        if (dbError.code === "23505") {
          if (dbError.detail?.includes("Key (username)")) {
            return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
          }
          if (dbError.detail?.includes("Key (email)")) {
            return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
          }
          return NextResponse.json({ message: "중복된 값이 존재합니다." }, { status: 409 });
        }
      }
      throw error;
    }
  } catch (error: unknown) { // any 대신 unknown 사용
    console.error("Registration error:", error);

    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ message: "서버 오류가 발생했습니다.", error: errorMessage }, { status: 500 });
  }
}
