"use client";
import React, { useEffect, useState } from "react";
import { ImportStatReport } from "@/ui/ImportStatReport";
import { StatReport } from "@/types/statReport";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/dist/client/link";
import { useStatReportStore } from "@/store/store";
import { StatReportCard } from "@/ui/StatReportCard";
import { ExportStatReport } from "@/ui/ExportStatReport";

export default function page() {
  const reports = useStatReportStore((state) => state.statReports);

  return (
    <div>
      <Link href="/reports/creation">
        <Button type="button" variant="ghost" className="inline-flex text-blue-500" aria-label="새 리포트 추가">
          <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
        </Button>
      </Link>

      <ImportStatReport />
      <ExportStatReport />

      <div>
        {reports.map((report) => {
          return <StatReportCard key={report.name} statReport={report}></StatReportCard>;
        })}
      </div>
    </div>
  );
}
