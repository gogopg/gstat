import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { StatReport } from "@/types/statReport";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/ui/ConfirmDialog";

type StatReportCardType = {
  statReport: StatReport;
};

export function StatReportCard({ statReport }: StatReportCardType) {
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm" onClick={() => router.push(`/reports/${statReport.name}`)}>
      <CardHeader>
        <CardTitle>{statReport.name}</CardTitle>
          <ConfirmDialog reportName={statReport.name}/>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
