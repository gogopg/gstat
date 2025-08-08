"use client";
import React from "react";
import { ImportStatReport } from "@/ui/ImportStatReport";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/dist/client/link";
import { useStatReportStore } from "@/store/store";
import { StatReportCard } from "@/ui/StatReportCard";
import { ExportStatReport } from "@/ui/ExportStatReport";

export default function page() {
  const reports = useStatReportStore((state) => state.statReports);

  return (
    <div className="flex flex-col gap-4">
        <div className="flex">
      <Link href="/reports/create">
        <Button type="button" variant="ghost" className="inline-flex text-blue-500" aria-label="새 리포트 추가">
          <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
        </Button>
      </Link>

      <ImportStatReport />
      <ExportStatReport />
        </div>

        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {reports.map((report) => {
          return <StatReportCard key={report.name} statReport={report}></StatReportCard>;
        })}
      </div>
    </div>
  );
}
