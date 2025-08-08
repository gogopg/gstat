import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { StatReport } from "@/types/report";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog, DeleteConfirmDialogType } from "@/ui/DeleteConfirmDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { useStatReportStore } from "@/store/store";

type StatReportCardType = {
  statReport: StatReport;
};

export function StatReportCard({ statReport }: StatReportCardType) {
  const router = useRouter();

  const clickPopover = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const deleteOption: DeleteConfirmDialogType = {
    title: `${statReport.name} 리포트 삭제`,
    description: `${statReport.name} 리포트를 삭제합니다. 삭제하면 복구할 수 없습니다.`,
    executeFunction: () => useStatReportStore.getState().remove(statReport.name),
  };

  return (
    <Card
      className="max-w-[360px] min-w-[240px] grow basis-[240px] cursor-pointer rounded border shadow transition-shadow hover:shadow-lg"
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
                <DeleteConfirmDialog
                  title={deleteOption.title}
                  description={deleteOption.description}
                  executeFunction={deleteOption.executeFunction}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
