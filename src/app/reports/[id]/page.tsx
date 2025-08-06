"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

import { CirclePlusIcon, TrashIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import CreateMatchRecordInput from "@/ui/CreateMatchRecordInput";
import { MatchRecord } from "@/types/matchRecord";
import { ProfileRecord } from "@/types/profile";
import { useStatReportStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmDialog } from "@/ui/DeleteConfirmDialog";

type MatchRecordInput = {
  matchRecords: {
    [profileKey: string]: {
      [statKey: string]: string;
    };
  };
  matchRecordName: string;
};
export default function Page() {
  const recordMethods = useForm<MatchRecordInput>({
    defaultValues: {
      matchRecords: {},
      matchRecordName: "",
    },
  });
  const { id } = useParams();
  const [createRecordFlag, setCreateRecordFlag] = useState(false);
  const router = useRouter();

  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id as string)),
  );

  const addMatchRecord = (rawData: MatchRecordInput) => {
    const newMatchRecord: MatchRecord = {
      name: rawData.matchRecordName,
      enterDate: new Date(),
      profileRecords: [],
    };

    const matchRecordList = Object.values(rawData.matchRecords);
    const resultMap = new Map<string, ProfileRecord>();

    for (const record of matchRecordList) {
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
    newMatchRecord.profileRecords.push(...Array.from(resultMap.values()));

    useStatReportStore.getState().addMatchRecord(statReport?.name, newMatchRecord);

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
    <div className="flex w-fit flex-col gap-8">
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
        <Label className="text-lg font-bold">프로필</Label>
        <div className="flex gap-0.5">
          {statReport.profileDefinitions.map((item) => (
            <Badge className="bg-red-600" key={`profile-${item.name}`}>
              {item.name}
            </Badge>
          ))}
        </div>
      </div>

      {createRecordFlag && (
        <div>
          <FormProvider {...recordMethods}>
            <CreateMatchRecordInput
              statDefinitions={statReport.statDefinitions}
              profileDefinitions={statReport.profileDefinitions}
            />
          </FormProvider>
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-1"
            onClick={recordMethods.handleSubmit(addMatchRecord)}
          >
            입력
          </Button>
          <Button type="button" variant="ghost" className="flex items-center gap-1" onClick={cancelRecordInput}>
            취소
          </Button>
        </div>
      )}

      <div>
        <div className="flex items-center mb-2">
          <label className="text-lg font-bold">매치 기록 목록</label>
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

          <Accordion type="single" collapsible className="flex flex-col gap-2 w-full" defaultValue="item-1">
            {statReport.matchRecords.map((record) => (
              <AccordionItem className="bg-white border rounded-md shadow-sm px-4 py-3" value={record.name} key={record.name}>
                <AccordionTrigger>{record.name}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <DeleteConfirmDialog
                      title={`${record.name} 기록 삭제`}
                      description={`${record.name} 기록을 삭제합니다. 삭제하면 복구할 수 없습니다.`}
                      executeFunction={() => useStatReportStore.getState().deleteMatchRecord(statReport?.name, record.name)}
                  />
                  {record.profileRecords.map((profile) => (
                    <Card className="w-full max-w-sm" key={`${profile.name}`}>
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
      </div>
    </div>
  );
}
