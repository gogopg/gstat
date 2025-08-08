import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { PerformanceReport, StatReport } from "@/types/report";
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
  const a = [
    {
      statDefinitions: [
        { value: "DPM" },
        { value: "CSM" },
        { value: "GPM" },
        { value: "GD@15" },
        { value: "CSD@15" },
        { value: "XPD@15" },
        { value: "KDA" },
        { value: "DMG%" },
      ],
      profileDefinitions: [
        { name: "RULER" },
        { name: "VIPER" },
        { name: "GUMAYUSI" },
        { name: "JIWOO" },
        { name: "DEOKDAM" },
      ],
      matchRecords: [
        {
          name: "1차기록",
          enterDate: "2025-08-02T20:43:55.887Z",
          profileRecords: [
            {
              name: "RULER",
              count: 1,
              stats: {
                DPM: 687.6,
                CSM: 9.1,
                GPM: 445,
                "GD@15": -46,
                "CSD@15": 0.1,
                "XPD@15": 1,
                KDA: 4.2,
                "DMG%": 25,
              },
            },
            {
              name: "VIPER",
              count: 1,
              stats: {
                DPM: 859.5,
                CSM: 9.5,
                GPM: 458,
                "GD@15": 310,
                "CSD@15": 4.8,
                "XPD@15": 296,
                KDA: 5.1,
                "DMG%": 30.2,
              },
            },
            {
              name: "GUMAYUSI",
              count: 1,
              stats: {
                DPM: 867.1,
                CSM: 10,
                GPM: 492,
                "GD@15": 283,
                "CSD@15": 13.9,
                "XPD@15": 177,
                KDA: 9.9,
                "DMG%": 28.4,
              },
            },
            {
              name: "JIWOO",
              count: 1,
              stats: {
                DPM: 757.7,
                CSM: 8.7,
                GPM: 425,
                "GD@15": -184,
                "CSD@15": -5.7,
                "XPD@15": 24,
                KDA: 2.6,
                "DMG%": 27,
              },
            },
            {
              name: "DEOKDAM",
              count: 1,
              stats: {
                DPM: 809.8,
                CSM: 8.5,
                GPM: 425,
                "GD@15": -247,
                "CSD@15": -16.5,
                "XPD@15": -477,
                KDA: 3.3,
                "DMG%": 31.2,
              },
            },
          ],
        },
        {
          name: "24242",
          enterDate: "2025-08-06T21:12:29.495Z",
          profileRecords: [
            {
              name: "RULER",
              count: 1,
              stats: { DPM: 1, CSM: 1, GPM: 1, "GD@15": 1, "CSD@15": 1, "XPD@15": 1, KDA: 1, "DMG%": 1 },
            },
            {
              name: "VIPER",
              count: 1,
              stats: { DPM: 1, CSM: 1, GPM: 1, "GD@15": 1, "CSD@15": 1, "XPD@15": 1, KDA: 1, "DMG%": 1 },
            },
            {
              name: "GUMAYUSI",
              count: 1,
              stats: { DPM: 1, CSM: 1, GPM: 1, "GD@15": 1, "CSD@15": 1, "XPD@15": 1, KDA: 1, "DMG%": 1 },
            },
            {
              name: "JIWOO",
              count: 1,
              stats: { DPM: 1, CSM: 1, GPM: 1, "GD@15": 1, "CSD@15": 1, "XPD@15": 1, KDA: 1, "DMG%": 1 },
            },
            {
              name: "DEOKDAM",
              count: 1,
              stats: { DPM: 1, CSM: 1, GPM: 1, "GD@15": 1, "CSD@15": 1, "XPD@15": 1, KDA: 1, "DMG%": 1 },
            },
          ],
        },
      ],
      name: "LCK 2025 3~5라운드",
    },
  ];

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
