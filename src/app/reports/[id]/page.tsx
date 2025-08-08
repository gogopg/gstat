"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

import { CirclePlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import CreateStatRecordInput from "@/ui/CreateStatRecordInput";
import { useStatReportStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmDialog } from "@/ui/DeleteConfirmDialog";
import { StatRecord, ProfileRecord } from "@/types/report";

type StatRecordInput = {
  statRecords: {
    [profileKey: string]: {
      [statKey: string]: string;
    };
  };
  statRecordName: string;
};
export default function Page() {
  const recordMethods = useForm<StatRecordInput>({
    defaultValues: {
      statRecords: {},
      statRecordName: "",
    },
  });
  const { id } = useParams();
  const [createRecordFlag, setCreateRecordFlag] = useState(false);
  const router = useRouter();

  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id as string)),
  );

  const addStatRecord = (rawData: StatRecordInput) => {
    const newStatRecord: StatRecord = {
      name: rawData.statRecordName,
      enterDate: new Date(),
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
    useStatReportStore.getState().addStatRecord(statReport?.name, newStatRecord);

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
            {statReport.statDefinitions.map((item) => (
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
              statDefinitions={statReport.statDefinitions}
              profileDefinitions={statReport.profileDefinitions}
              executeFunctionAction={() => recordMethods.handleSubmit(addStatRecord)()}
              cancelFunctionAction={cancelRecordInput}
            />
          </FormProvider>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center">
          <p className="text-lg font-bold">매치 기록 목록</p>
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
            {statReport.statRecords.map((record) => (
              <AccordionItem
                className="rounded-md border bg-white px-4 py-3 shadow-sm"
                value={record.name}
                key={record.name}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex-1">
                    <AccordionTrigger className="flex-1 cursor-pointer">{record.name}</AccordionTrigger>
                  </div>
                  <DeleteConfirmDialog
                    title={`${record.name} 기록 삭제`}
                    description={`${record.name} 기록을 삭제합니다. 삭제하면 복구할 수 없습니다.`}
                    executeFunction={() =>
                      useStatReportStore.getState().deleteStatRecord(statReport?.name, record.name)
                    }
                  />
                </div>
                <AccordionContent className="flex w-full flex-col gap-4 text-balance">
                  <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                    {record.profileRecords.map((profile) => (
                      <Card className="max-w-sm min-w-50" key={`${profile.name}`}>
                        <CardHeader>
                          <CardTitle>{profile.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {Object.entries(profile.stats).map(([key, value]) => {
                            return (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{key}</span>
                                <span>{value}</span>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
