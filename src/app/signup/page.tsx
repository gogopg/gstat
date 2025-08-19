"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form} from "@/components/ui/form";
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

  const onSubmit = form.handleSubmit(async (data: FormValues) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful:", result);
        alert("회원가입이 성공적으로 완료되었습니다.");
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert(`회원가입 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("Network error or unexpected error:", error);
      alert("네트워크 오류 또는 예상치 못한 오류가 발생했습니다.");
    }
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
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
