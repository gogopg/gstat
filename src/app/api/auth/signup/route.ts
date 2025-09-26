import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase, UserModel } from "@/db";

interface RequestBody {
  id: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: Partial<RequestBody> = await request.json().catch(() => ({}));
    const { id, email, password, passwordCheck } = body;

    if (!id || !email || !password || !passwordCheck) {
      return NextResponse.json({ message: "모든 필드를 채워주세요." }, { status: 400 });
    }
    if (password !== passwordCheck) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await UserModel.findOne({ $or: [{ username: id }, { email }] }).lean();
    if (existing) {
      if (existing.username === id) {
        return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
      }
      if (existing.email === email) {
        return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
      }
      return NextResponse.json({ message: "중복된 값이 존재합니다." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await UserModel.create({
        username: id,
        email,
        passwordHash: hashedPassword,
      });

      return NextResponse.json(
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
          },
          message: "회원가입이 성공적으로 완료되었습니다.",
        },
        { status: 201 },
      );
    } catch (error: unknown) {
      if (error && typeof error === "object" && "code" in error && (error as { code: number }).code === 11000) {
        const duplicated = error as { keyPattern?: Record<string, number> };
        if (duplicated.keyPattern?.username) {
          return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
        }
        if (duplicated.keyPattern?.email) {
          return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
        }
        if (duplicated.keyPattern?.id) {
          return NextResponse.json({ message: "중복된 값이 존재합니다." }, { status: 409 });
        }
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);

    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ message: "서버 오류가 발생했습니다.", error: errorMessage }, { status: 500 });
  }
}
