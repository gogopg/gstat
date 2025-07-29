"use client";
import React, { useState } from "react";
import { ReportCreationDialog } from "@/ui/ReportCreationDialog";
import { Report } from "@/types/report";
import { Label } from "@/components/ui/label";

export default function page() {
  const [reports, setReports] = useState<Report[]>([]);

  return (
    <div>
      <ReportCreationDialog reports={reports} setReportsAction={setReports} />

      <div>
        {reports.map((report) => {
          return <Label key={report.name}>{report.name}</Label>;
        })}
      </div>
    </div>
  );
}
