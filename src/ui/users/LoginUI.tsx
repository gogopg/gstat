"use client";

import TextFormField from "@/ui/users/FormTextField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

type LoginUser = {
  id: string;
  password: string;
};

export default function LoginUI() {
  const form = useForm({ defaultValues: { id: "", password: "" } });
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (data: LoginUser) => {
    type LoginSuccessResponse = {
      user: {
        id: string;
        username: string;
      };
    };

    type LoginErrorResponse = {
      message?: string;
    };

    const isLoginSuccess = (value: unknown): value is LoginSuccessResponse => {
      if (!value || typeof value !== "object") {
        return false;
      }

      const candidate = value as Partial<LoginSuccessResponse>;
      const user = candidate.user;
      return !!user && typeof user === "object" && typeof user.id === "string" && typeof user.username === "string";
    };

    const isLoginError = (value: unknown): value is LoginErrorResponse => {
      if (!value || typeof value !== "object") {
        return false;
      }

      const candidate = value as Partial<LoginErrorResponse>;
      return candidate.message === undefined || typeof candidate.message === "string";
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: unknown = await response.json().catch(() => null);
        if (!isLoginSuccess(result)) {
          throw new Error("unexpected response");
        }

        login({ id: result.user.id, username: result.user.username });
        alert("로그인 성공");
        router.refresh();
        router.push("/");
      } else {
        const errorData: unknown = await response.json().catch(() => null);
        const message = isLoginError(errorData) && errorData.message ? errorData.message : "알 수 없는 오류";
        console.error("Registration failed:", errorData);
        alert(`로그인 실패: ${message}`);
      }
    } catch (error) {
      console.error("Network error or unexpected error:", error);
      alert("네트워크 오류 또는 예상치 못한 오류가 발생했습니다.");
    }
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-4xl font-bold">로그인</p>
      <Form {...form}>
        <form
          onSubmit={(event) => {
            void onSubmit(event);
          }}
          className="space-y-4"
        >
          <TextFormField control={form.control} name={"id"} label={"아이디"} placeholder={"아이디"} />
          <TextFormField
            control={form.control}
            name={"password"}
            label={"패스워드"}
            placeholder={"패스워드"}
            type={"password"}
          />
          <Button className="w-full" type="submit">
            로그인
          </Button>
        </form>
      </Form>

      <div className="mt-4 flex flex-col gap-4">
        <Link href="/signup">
          <p className="font-bold text-blue-500 underline underline-offset-4">회원가입</p>
        </Link>
      </div>
    </div>
  );
}
