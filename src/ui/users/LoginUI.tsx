"use client";

import TextFormField from "@/ui/users/FormTextField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

type LoginUser = {
  id: string;
  password: string;
};

export default function LoginUI() {
  const form = useForm({ defaultValues: { id: "", password: "" } });
  const onSubmit = form.handleSubmit(async (data: LoginUser) => {
    console.log(data);
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-4xl font-bold">로그인</p>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
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

      <div className="flex flex-col gap-4 mt-4">
        <Link href="/signup">
          <p className="font-bold text-blue-500 underline underline-offset-4">회원가입</p>
        </Link>
      </div>
    </div>
  );
}
