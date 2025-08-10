import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchRecord } from "@/types/report";
import React from "react";
import { AwardIcon } from "lucide-react";

type props = {
  matchRecords: MatchRecord[];
};

export default function MatchRecordCard({ matchRecords }: props) {
  const winnerStyle = "text-blue-600";
  const loserStyle = "text-gray-400";
  return (
    <div className="flex flex-col gap-2">
      {matchRecords.map((matchRecord) => {
        return (
          <Card key={matchRecord.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{matchRecord.name}</CardTitle>
                <CardDescription>경기일 : {matchRecord.matchDate}</CardDescription>
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
