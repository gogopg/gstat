import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { StatReport } from "@/types/statReport";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EllipsisVerticalIcon } from "lucide-react";

type StatReportCardType = {
  statReport: StatReport;
};

export function StatReportCard({ statReport }: StatReportCardType) {
  const router = useRouter();

  const clickPopover = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <Card
      className="max-w-[360px] min-w-[240px] grow basis-[240px] rounded border shadow cursor-pointer"
      onClick={() => router.push(`/reports/${statReport.name}`)}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {statReport.name}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" onClick={clickPopover} className="cursor-pointer">
                  <EllipsisVerticalIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="flex w-fit items-center justify-center p-0">
                <ConfirmDialog reportName={statReport.name} />
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
