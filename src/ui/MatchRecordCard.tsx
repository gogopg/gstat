import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchRecord } from "@/types/report";
import React from "react";
import { AwardIcon, EllipsisVerticalIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/ui/DeleteConfirmDialog";
import { useStatReportStore } from "@/store/store";

type props = {
  matchRecords: MatchRecord[];
  reportName: string;
};

export default function MatchRecordCard({ matchRecords, reportName }: props) {
  const winnerStyle = "text-blue-600";
  const loserStyle = "text-gray-400";

  const clickPopover = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-2">
      {matchRecords.map((matchRecord) => {
        return (
          <Card key={matchRecord.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{matchRecord.name}</CardTitle>
                <CardDescription>경기일 : {matchRecord.matchDate}</CardDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" onClick={clickPopover} className="cursor-pointer">
                      <EllipsisVerticalIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="start" className="flex w-fit items-center justify-center p-0">
                    <DeleteConfirmDialog
                      title={`${matchRecord.name} 기록 삭제`}
                      description={`${matchRecord.name} 기록을 삭제합니다. 삭제하면 복구할 수 없습니다.`}
                      executeFunction={() => {
                        useStatReportStore.getState().deleteMatchRecord(reportName, matchRecord.id);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="text-2xl font-extrabold">
              <div className="flex items-center justify-center gap-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <AwardIcon className={matchRecord.winnerSide === "A" ? "text-yellow-500" : "invisible"} />
                </span>
                <p className="mr-4">{matchRecord.participants.A.profileName}</p>
                <p className={matchRecord.winnerSide === "A" ? winnerStyle : loserStyle}>{matchRecord.setResult.A}</p>
                <p>:</p>
                <p className={matchRecord.winnerSide === "B" ? winnerStyle : loserStyle}>{matchRecord.setResult.B}</p>
                <p className="ml-4">{matchRecord.participants.B.profileName}</p>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <AwardIcon className={matchRecord.winnerSide === "B" ? "text-yellow-500" : "invisible"} />
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
