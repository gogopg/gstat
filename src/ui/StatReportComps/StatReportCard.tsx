"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { SimpleStatReport } from "@/types/report";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { useStatReportStore } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/store/dialogStore";

type props = {
  statReport: SimpleStatReport;
  isSsr: boolean;
};

export function StatReportCard({ statReport, isSsr }: props) {
  const router = useRouter();
  let reportKey = statReport.name;

  if (isSsr) reportKey = statReport.token || "";

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    useDialogStore.getState().openDialog({
      title: `${reportKey} 리포트 삭제`,
      description: `${reportKey} 리포트를 삭제합니다. 삭제하면 복구할 수 없습니다.`,
      showCancelButton: true,
      onConfirm: () => useStatReportStore.getState().remove(reportKey),
    });
  };

  return (
    <Card
      className="max-w-[360px] min-w-[240px] grow basis-[240px] cursor-pointer rounded border shadow transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/reports/${reportKey}`)}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {statReport.name}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={onDelete}>
                  <p className="text-red-500">삭제</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
