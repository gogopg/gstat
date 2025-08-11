import { MatchRecord, StatReport } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CirclePlusIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProfileSelectCombo from "@/ui/ProfileSelectCombo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/ui/DatePicker";
import { useStatReportStore } from "@/store/store";
import MatchRecordCard from "@/ui/MatchRecordCard";

type props = Extract<StatReport, { type: "elo" }>;

export default function EloReportUI({ statReport }: { statReport: props }) {
  const methods = useForm<MatchRecord>({
    defaultValues: {
      id: "",
      matchDate: new Date().toISOString(),
      name: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      winnerSide: "A",
      participants: { A: { profileName: "" }, B: { profileName: "" } },
    },
  });

  const [createRecordFlag, setCreateRecordFlag] = useState(false);

  const cancelRecordInput = () => {
    setCreateRecordFlag(false);
  };

  const onSubmit = methods.handleSubmit((data) => {
    data.id = crypto.randomUUID();
    data.setResult.A > data.setResult.B ? (data.winnerSide = "A") : (data.winnerSide = "B");
    useStatReportStore.getState().addMatchRecord(statReport?.name, data);
    cancelRecordInput();
    methods.reset();
  });

  if (!statReport) {
    return <div>해당 보고서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-1/2 flex-col gap-4">
        <p className="text-3xl font-bold">{statReport.name}</p>

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
        <div className="flex items-center gap-3">
          <p className="text-lg font-bold">세트</p>
          <div className="flex gap-0.5">
            {statReport.report.bestOf} 판 {Math.ceil(statReport.report.bestOf / 2)} 선승
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-lg font-bold">가중치</p>
          <div className="flex gap-0.5">{statReport.report.k}</div>
        </div>
      </div>

      {createRecordFlag ? (
        <div>
          <div className="mb-2 flex items-center">
            <p className="text-lg font-bold">기록 추가</p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormProvider {...methods}>
              <div className="flex gap-2">
                <Label>경기 이름</Label>
                <Input {...methods.register("name")} className="w-48" />
              </div>
              <div className="flex flex-col gap-4">
                <Label>경기 날짜</Label>
                <DatePicker />
              </div>
              <div className="flex flex-col gap-2">
                <Label>경기 결과</Label>
                <div className="flex items-center gap-2">
                  <ProfileSelectCombo
                    side={"A"}
                    profileDefinitions={statReport.profileDefinitions}
                  ></ProfileSelectCombo>
                  <Input {...methods.register("setResult.A")} type="number" className="w-24" />
                  <p>:</p>
                  <Input {...methods.register("setResult.B")} type="number" className="w-24" />
                  <ProfileSelectCombo
                    side={"B"}
                    profileDefinitions={statReport.profileDefinitions}
                  ></ProfileSelectCombo>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex items-center gap-1"
                  onClick={cancelRecordInput}
                >
                  취소
                </Button>
                <Button type="submit" className="flex items-center gap-1">
                  입력
                </Button>
              </div>
            </FormProvider>
          </form>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <p className="text-lg font-bold">기록 목록</p>
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-1 text-blue-500"
              onClick={() => setCreateRecordFlag(true)}
            >
              <CirclePlusIcon className="h-4 w-4" />
              기록 추가
            </Button>
          </div>
          <MatchRecordCard matchRecords={statReport.report.matchRecords} reportName={statReport.name} />
        </div>
      )}
    </div>
  );
}
