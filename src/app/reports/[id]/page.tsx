"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StatReport } from "@/types/statReport";
import { Badge } from "@/components/ui/badge";

import { CirclePlusIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import CreateMatchRecordInput from "@/ui/CreateMatchRecordInput";
import { MatchRecord } from "@/types/matchRecord";
import { ProfileRecord } from "@/types/profile";
import { useStatReportStore } from "@/store/store";

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

  const pathname = usePathname().split("/")[2];
  const [statReport, setStatReport] = useState<StatReport>();
  const [createRecordFlag, setCreateRecordFlag] = useState(false);

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

    setStatReport((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        matchRecords: [...prev.matchRecords, newMatchRecord],
      };
    });

    cancelRecordInput();
  };

  const cancelRecordInput = () => {
    setCreateRecordFlag(false);
    recordMethods.reset();
  };

  useEffect(() => {
    console.log("statReport", statReport);
  }, [statReport]);

  useEffect(() => {
    const report = useStatReportStore.getState().find(pathname);
    if (report) {
      setStatReport(report);
    }
  }, [pathname]);

  if (!statReport) {
    return <div>해당 보고서를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <Label>스텟</Label>
      {statReport.statDefinitions.map((item) => (
        <Badge key={`stat-${item.value}`}>{item.value}</Badge>
      ))}
      <Label>프로필</Label>
      {statReport.profileDefinitions.map((item) => (
        <Badge key={`profile-${item.name}`}>{item.name}</Badge>
      ))}

      {!createRecordFlag && (
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => setCreateRecordFlag(true)}
        >
          <CirclePlusIcon className="h-4 w-4" />
          기록 추가
        </Button>
      )}
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
    </div>
  );
}
