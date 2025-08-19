import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStatReportStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PerformanceRecord } from "@/types/report";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useDialogStore } from "@/store/dialogStore";

type props = {
  record: PerformanceRecord;
  reportName: string;
};

export default function PerformanceRecordItem({ record, reportName }: props) {
  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    useDialogStore.getState().openDialog({
      title: `${record.name} 기록 삭제`,
      description: `${record.name} 기록을 삭제합니다. 삭제하면 복구할 수 없습니다.`,
      showCancelButton: true,
      onConfirm: () => useStatReportStore.getState().deletePerformanceRecord(reportName, record.name),
    });
  };

  return (
    <AccordionItem className="rounded-md border bg-white px-4 py-3 shadow-sm" value={record.name} key={record.name}>
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <AccordionTrigger className="flex-1 cursor-pointer">{record.name}</AccordionTrigger>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="inline-flex text-red-500"
          aria-label="기록 삭제"
          onClick={onDelete}
        >
          <TrashIcon className="h-5 w-5" />
          삭제
        </Button>
      </div>
      <AccordionContent className="flex w-full flex-col gap-4 text-balance">
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {record.profileRecords.map((profile) => (
            <Card className="max-w-sm min-w-50" key={`${profile.name}`}>
              <CardHeader>
                <CardTitle>{profile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(profile.stats).map(([key, value]) => {
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
