"use client";

import StatDefinitionInput from "@/ui/StatReportComps/StatDefinitionInput";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ReportType, StatReport } from "@/types/report";
import { useRouter } from "next/navigation";
import ProfileDefinitionInput from "@/ui/StatReportComps/ProfileDefinitionInput";
import { useStatReportStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDefaultReport } from "@/util/createReport";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CreateReportFormProps = {
  isAuthenticated: boolean;
  insertReport: (report: StatReport) => Promise<void>;
};

export default function CreateReportForm({ isAuthenticated, insertReport }: CreateReportFormProps) {
  const router = useRouter();
  const [isMultiSet, setIsMultiSet] = useState(false);
  const methods = useForm<StatReport>({
    defaultValues: createDefaultReport("elo", "", []),
    shouldUnregister: false,
  });

  const selectedType = methods.watch("type");

  const handleSubmit = methods.handleSubmit(async (data) => {
    const report: StatReport =
      data.type === "elo"
        ? {
            ...data,
            payload: {
              ...data.payload,
              eloRatings: data.profileDefinitions.map((profile) => ({
                profile,
                score: 1000,
              })),
            },
          }
        : data;

    if (isAuthenticated) {
      await insertReport(report);
    } else {
      useStatReportStore.getState().add(report);
    }
  });

  const changeIsMultiSet = (checked: boolean) => {
    methods.setValue("payload.bestOf", 1, { shouldDirty: true, shouldValidate: true });
    setIsMultiSet(checked);
  };

  useEffect(() => {
    if (selectedType === "performance") {
      const performanceRecords = methods.getValues("payload.performanceRecords");
      if (!Array.isArray(performanceRecords)) {
        methods.setValue("payload.performanceRecords", []);
      }
    }
  }, [methods, selectedType]);

  return (
    <div className="flex w-1/3 flex-col gap-8">
      <label className="text-3xl font-bold">새 리포트 추가</label>
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="flex flex-col gap-8"
        >
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
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    field.onChange(value as ReportType);
                  }}
                >
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold">가중치</label>
                <Input {...methods.register("payload.k")} placeholder="가중치" />
              </div>
              <div className="tems-center flex gap-4">
                <Checkbox
                  id="multiSet"
                  onCheckedChange={(checked) => {
                    changeIsMultiSet(checked === true);
                  }}
                />
                <Label htmlFor="multiSet">세트 적용</Label>
              </div>
              {isMultiSet && (
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold">경기 수</label>
                  <Controller
                    name="payload.bestOf"
                    control={methods.control}
                    render={({ field }) => (
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          const parsed = Number.parseInt(value, 10);
                          if (parsed === 3 || parsed === 5 || parsed === 7) {
                            field.onChange(parsed);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="경기 수 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">BO3</SelectItem>
                          <SelectItem value="5">BO5</SelectItem>
                          <SelectItem value="7">BO7</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              className="flex w-1/3"
              onClick={() => {
                router.back();
              }}
            >
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
