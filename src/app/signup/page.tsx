"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextFormField from "@/ui/users/FormTextField";

type FormValues = {
  id: string;
  email: string;
  password: string;
  passwordCheck: string;
};

export default function Page() {
  const form = useForm({
    defaultValues: {
      id: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data: FormValues) => {
    type ApiMessage = { message?: string };

    const isApiMessage = (value: unknown): value is ApiMessage => {
      if (!value || typeof value !== "object") {
        return false;
      }

      const candidate = value as Partial<ApiMessage>;
      return candidate.message === undefined || typeof candidate.message === "string";
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("회원가입이 성공적으로 완료되었습니다.");
      } else {
        const errorData: unknown = await response.json().catch(() => null);
        const message = isApiMessage(errorData) && errorData.message ? errorData.message : "알 수 없는 오류";
        console.error("Registration failed:", errorData);
        alert(`회원가입 실패: ${message}`);
      }
    } catch (error) {
      console.error("Network error or unexpected error:", error);
      alert("네트워크 오류 또는 예상치 못한 오류가 발생했습니다.");
    }
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-8"
        >
          <TextFormField control={form.control} name="id" label="아이디" placeholder="아이디" />
          <TextFormField control={form.control} name="email" label="이메일" placeholder="이메일" type="email" />
          <TextFormField
            control={form.control}
            name="password"
            label="패스워드"
            placeholder="패스워드"
            type="password"
          />
          <TextFormField
            control={form.control}
            name="passwordCheck"
            label="패스워드 확인"
            placeholder="패스워드 확인"
            type="password"
          />
          <Button type="submit">확인</Button>
        </form>
      </Form>
    </div>
  );
}
