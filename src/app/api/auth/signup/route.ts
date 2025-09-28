import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase, UserDocument, UserModel } from "@/db";

interface RequestBody {
  id: string;
  email: string;
  password: string;
  passwordCheck: string;
}

function isRequestBody(value: unknown): value is RequestBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RequestBody>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.password === "string" &&
    typeof candidate.passwordCheck === "string"
  );
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json().catch(() => null);
    if (!isRequestBody(rawBody)) {
      return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
    }

    const { id, email, password, passwordCheck } = rawBody;

    if (!id || !email || !password || !passwordCheck) {
      return NextResponse.json({ message: "모든 필드를 채워주세요." }, { status: 400 });
    }
    if (password !== passwordCheck) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await UserModel.findOne({ $or: [{ username: id }, { email }] }).lean<UserDocument>();
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
      const createdUser = await UserModel.create({
        username: id,
        email,
        passwordHash: hashedPassword,
      });
      const persistedUser = await UserModel.findById(createdUser.id).lean<UserDocument>();
      if (!persistedUser) {
        throw new Error("생성된 사용자를 불러오지 못했습니다.");
      }

      const createdAt =
        persistedUser.createdAt instanceof Date
          ? persistedUser.createdAt.toISOString()
          : new Date().toISOString();

      return NextResponse.json(
        {
          user: {
            id: persistedUser.id,
            username: persistedUser.username,
            email: persistedUser.email,
            createdAt,
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
