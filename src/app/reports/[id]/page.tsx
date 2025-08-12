"use client";
import { useStatReportStore } from "@/store/store";
import { useParams } from "next/navigation";
import PerformanceReportUI from "@/ui/PerformanceReportComps/PerformanceReportUI";
import EloReportUI from "@/ui/EloReportComps/EloReportUI";

export default function Page() {
  const { id } = useParams();
  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id as string)),
  );

  if (!statReport) {
    return;
  }

  return (
    <>
      {statReport.type === "performance" && <PerformanceReportUI statReport={statReport} />}
      {statReport.type === "elo" && <EloReportUI statReport={statReport} />}
    </>
  );
}
