"use client";

import StatDefinitionInput from "@/ui/StatDefinitionInput";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StatReport } from "@/types/statReport";
import { useRouter } from "next/navigation";
import ProfileDefinitionInput from "@/ui/ProfileDefinitionInput";

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
    const reportsOrigin = localStorage.getItem("reports");

    if (reportsOrigin) {
      const reports = JSON.parse(reportsOrigin);
      reports.reports.push({ name: data.name, data: data });
      localStorage.setItem("reports", JSON.stringify(reports));
    } else {
      const target = {
        reports: [{ name: data.name, data: data }],
      };

      localStorage.setItem("reports", JSON.stringify(target));
    }
    router.push(`/reports/${data.name}`);
  });

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <input {...methods.register("name")} placeholder="report 이름" />
          <StatDefinitionInput />
          <ProfileDefinitionInput />

          <button type="submit">저장</button>
        </form>
      </FormProvider>
    </div>
  );
}
