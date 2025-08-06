"use client";

import StatDefinitionInput from "@/ui/StatDefinitionInput";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StatReport } from "@/types/statReport";
import { useRouter } from "next/navigation";
import ProfileDefinitionInput from "@/ui/ProfileDefinitionInput";
import { useStatReportStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();

  const methods = useForm<StatReport>({
    defaultValues: {
      name: "",
      statDefinitions: [],
      profileDefinitions: [],
      matchRecords: [],
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    const newStatReport: StatReport = {
      statDefinitions: data.statDefinitions,
      profileDefinitions: data.profileDefinitions,
      matchRecords: [],
      name: data.name,
    };

    useStatReportStore.getState().add(newStatReport);

    router.push(`/reports/${data.name}`);
  });

  return (
    <div className="flex flex-col w-1/3 gap-8">
      <label className="font-bold text-3xl">새 리포트 추가</label>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">리포트 이름</label>
            <Input {...methods.register("name")} placeholder="리포트 이름" />
          </div>
          <StatDefinitionInput />
          <ProfileDefinitionInput />

          <div className="flex gap-2">
            <Button variant="secondary" type="button" className="flex w-1/3" onClick={router.back}>취소</Button>
            <Button className="flex w-1/3" type="submit">저장</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
