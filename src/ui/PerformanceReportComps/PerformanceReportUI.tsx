"use client"

import { PerformanceRecord, ProfileRecord, StatReport } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormProvider, useForm } from "react-hook-form";
import CreateStatRecordInput from "@/ui/PerformanceReportComps/CreateStatRecordInput";
import { CirclePlusIcon } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { useStatReportStore } from "@/store/store";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PerformanceRecordItem from "@/ui/PerformanceReportComps/PerformanceRecordItem";

type props = Extract<StatReport, { type: "performance" }>;

type StatRecordInput = {
  statRecords: {
    [profileKey: string]: {
      [statKey: string]: string;
    };
  };
  statRecordName: string;
};

export default function PerformanceReportUI({ statReport }: { statReport: props }) {
  const recordMethods = useForm<StatRecordInput>({
    defaultValues: {
      statRecords: {},
      statRecordName: "",
    },
  });

  const [createRecordFlag, setCreateRecordFlag] = useState(false);
  const router = useRouter();
  const id = statReport.name;

  const addStatRecord = (rawData: StatRecordInput) => {
    const newStatRecord: PerformanceRecord = {
      name: rawData.statRecordName,
      createdAt: new Date().toISOString(),
      profileRecords: [],
    };

    const statRecordList = Object.values(rawData.statRecords);
    const resultMap = new Map<string, ProfileRecord>();

    for (const record of statRecordList) {
      const profileName = Object.keys(record)[0];
      const statObj = record[profileName];

      const existing = resultMap.get(profileName);
      if (!existing) {
        resultMap.set(profileName, {
          name: profileName,
          count: 1,
          stats: Object.fromEntries(Object.entries(statObj).map(([k, v]) => [k, Number(v)])),
        });
      } else {
        for (const [statKey, value] of Object.entries(statObj)) {
          existing.stats[statKey] = Number(value);
        }
      }
    }
    newStatRecord.profileRecords.push(...Array.from(resultMap.values()));
    useStatReportStore.getState().addPerformanceRecord(statReport?.name, newStatRecord);

    cancelRecordInput();
  };

  const cancelRecordInput = () => {
    setCreateRecordFlag(false);
    recordMethods.reset();
  };

  if (!statReport) {
    return <div>해당 보고서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-1/2 flex-col gap-4">
        <p className="text-3xl font-bold">{statReport.name}</p>

        <Button
          variant="blue"
          onClick={() => {
            router.push(`/reports/${id}/graph`);
          }}
        >
          그래프
        </Button>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">스텟</p>
          <div className="flex gap-0.5">
            {statReport.payload.statDefinitions.map((item) => (
              <Badge className="bg-blue-400" key={`stat-${item.value}`}>
                {item.value}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">프로필</p>
          <div className="flex gap-0.5">
            {statReport.profileDefinitions.map((item) => (
              <Badge className="bg-red-600" key={`profile-${item.name}`}>
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {createRecordFlag && (
        <div>
          <FormProvider {...recordMethods}>
            <CreateStatRecordInput
              statDefinitions={statReport.payload.statDefinitions}
              profileDefinitions={statReport.profileDefinitions}
              executeFunctionAction={() => recordMethods.handleSubmit(addStatRecord)()}
              cancelFunctionAction={cancelRecordInput}
            />
          </FormProvider>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center">
          <p className="text-lg font-bold">기록 목록</p>
          {!createRecordFlag && (
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-1 text-blue-500"
              onClick={() => setCreateRecordFlag(true)}
            >
              <CirclePlusIcon className="h-4 w-4" />
              기록 추가
            </Button>
          )}
        </div>
        <div>
          <Accordion type="single" collapsible className="flex w-full flex-col gap-2" defaultValue="item-1">
            {statReport.payload.performanceRecords?.map((record) => (
                <PerformanceRecordItem record={record} reportName={statReport.name} key={record.name}/>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
