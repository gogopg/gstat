"use client";

import StatDefinitionInput from "@/ui/StatDefinitionInput";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ReportType, StatReport } from "@/types/report";
import { useRouter } from "next/navigation";
import ProfileDefinitionInput from "@/ui/ProfileDefinitionInput";
import { useStatReportStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDefaultReport } from "@/util/createReport";

export default function Page() {
  const router = useRouter();

  const methods = useForm<StatReport>({
    defaultValues: createDefaultReport("elo", "", []),
    shouldUnregister: true,
  });

  const selectedType = methods.watch("type");

  const onSubmit = methods.handleSubmit((data) => {
    useStatReportStore.getState().add(data);
    router.push(`/reports/${data.name}`);
  });

  useEffect(() => {
    if (selectedType === "performance" && !methods.getValues("report.performanceRecords")) {
      methods.setValue("report.performanceRecords", []);
    }
  }, [selectedType]);

  return (
    <div className="flex w-1/3 flex-col gap-8">
      <label className="text-3xl font-bold">새 리포트 추가</label>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold">리포트 이름</label>
            <Input {...methods.register("name")} placeholder="리포트 이름" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold">리포트 타입</label>
            <Controller
              name="type"
              control={methods.control}
              render={({ field }) => (
                <Select value={selectedType} onValueChange={(v: string) => field.onChange(v as ReportType)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="리포트 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elo">Elo</SelectItem>
                    <SelectItem value="performance">퍼포먼스</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <ProfileDefinitionInput />
          {selectedType === "performance" ? <StatDefinitionInput /> : null}
          {selectedType === "elo" ? (
            <div>
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold">가중치</label>
                <Input {...methods.register("report.k")} placeholder="가중치" />
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button variant="secondary" type="button" className="flex w-1/3" onClick={router.back}>
              취소
            </Button>
            <Button className="flex w-1/3" type="submit">
              저장
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
