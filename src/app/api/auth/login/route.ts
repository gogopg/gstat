import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase, UserDocument, UserModel } from "@/db";

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json({ message: "아이디와 비밀번호를 모두 입력해주세요." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ username: id }).lean<UserDocument>();

    if (!user) {
      return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const response = NextResponse.json({
      message: "로그인 성공",
      user: {
        id: user.id,
        username: user.username,
      },
    });

    response.cookies.set(
      "user-session",
      JSON.stringify({
        id: user.id,
        username: user.username,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      },
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
