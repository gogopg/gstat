"use client"

import { StatReportCard } from "@/ui/StatReportComps/StatReportCard";
import { useStatReportStore } from "@/store/store";

export default function LocalReportPageUI() {
  const reports = useStatReportStore.getState().statReports;

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {reports.map((report) => {
        return <StatReportCard key={report.name} statReport={report} isSsr={false} />;
      })}
    </div>
  )
}
