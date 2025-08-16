import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, users } from "@/db"; // src/db/index.ts에서 db 인스턴스 및 users 스키마 가져오기
import { eq } from "drizzle-orm"; // Drizzle 쿼리 빌더를 위해 eq 가져오기

interface RequestBody {
  id: string; // 유저네임으로 사용될 필드
  email: string;
  password: string;
  passwordCheck: string; // 클라이언트 측 유효성 검사용이므로 서버에서는 사용하지 않음
}

// Next.js 앱 라우터에서 API 라우트가 Node.js 런타임을 사용하도록 강제 (PostgreSQL 연결에 필요)
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json().catch(() => ({}));
    const { id, email, password, passwordCheck } = body;

    // 필수 필드 유효성 검사
    if (!id || !email || !password || !passwordCheck) {
      return NextResponse.json({ message: "모든 필드를 채워주세요." }, { status: 400 });
    }
    // 비밀번호 일치 여부 확인 (클라이언트 측에서 주로 처리되지만, 서버에서도 한 번 더 검증)
    if (password !== passwordCheck) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // 아이디(username) 중복 사전 체크
      // Drizzle ORM을 사용하여 users 테이블에서 id(username)가 일치하는 레코드 조회
      const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.username, id));
      if (existingUser.length > 0) {
        return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
      }

      // 사용자 정보 삽입
      const insertedUsers = await db
        .insert(users)
        .values({
          username: id, // 요청 본문의 id를 username 컬럼에 매핑
          email,
          passwordHash: hashedPassword,
          // createdAt 필드는 Drizzle 스키마의 defaultNow() 설정에 따라 DB에서 자동 생성됩니다.
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
        });

      return NextResponse.json(
        { user: insertedUsers[0], message: "회원가입이 성공적으로 완료되었습니다." },
        { status: 201 },
      );
    } catch (error: any) {
      console.error("Database operation error:", error);

      // PostgreSQL의 중복 키 위반 오류 (Error Code: 23505) 처리
      if (error?.code === "23505") {
        if (error.detail?.includes("Key (username)")) {
          return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
        }
        if (error.detail?.includes("Key (email)")) {
          return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
        }
        // 기타 중복 위반
        return NextResponse.json({ message: "중복된 값이 존재합니다." }, { status: 409 });
      }
      throw error; // 예상치 못한 다른 DB 오류는 다시 throw 하여 일반 에러 핸들링으로 보냅니다.
    }
  } catch (error: any) {
    console.error("Registration error:", error);

    // 일반적인 서버 오류 처리 (예: JSON 파싱 오류, 네트워크 오류 등)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ message: "서버 오류가 발생했습니다.", error: errorMessage }, { status: 500 });
  }
}
