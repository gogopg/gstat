import { StatReport } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CirclePlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

type PerfReport = Extract<StatReport, { type: "elo" }>;

export default function EloReportUI({ statReport }: { statReport: PerfReport }) {
  // const recordMethods = useForm<StatRecordInput>({
  //   defaultValues: {
  //     statRecords: {},
  //     statRecordName: "",
  //   },
  // });

  const [createRecordFlag, setCreateRecordFlag] = useState(false);

  const cancelRecordInput = () => {
    setCreateRecordFlag(false);
  };

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
      </div>

      {createRecordFlag && <div></div>}

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
        <div></div>
      </div>
    </div>
  );
}
