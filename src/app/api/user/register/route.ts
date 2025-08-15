import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { getDb } from "@/db";

interface RequestBody {
  id: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: RequestBody = await request.json();
    const { id, email, password, passwordCheck } = body;

    if (!id || !email || !password || !passwordCheck) {
      return Response.json({ message: "모든 필드를 채워주세요." }, { status: 400 });
    }
    if (password !== passwordCheck) {
      return Response.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getDb();
    await db.insert(users).values({
      username: id,
      email,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ message: "회원가입이 성공적으로 완료되었습니다." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("duplicate key value violates unique constraint") || msg.includes("UNIQUE constraint failed")) {
      if (msg.includes("username") || msg.includes("users_username_key")) {
        return Response.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
      }
      if (msg.includes("email") || msg.includes("users_email_key")) {
        return Response.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
      }
    }

    if (msg.includes("ECONNREFUSED")) {
      return Response.json(
        { message: "데이터베이스에 연결할 수 없습니다. DATABASE_URL을 확인하거나 개발 환경에서는 인메모리 DB를 사용하도록 설정하세요." },
        { status: 500 }
      );
    }

    return Response.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
