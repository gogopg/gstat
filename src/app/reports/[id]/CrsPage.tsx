"use client";
import { useStatReportStore } from "@/store/store";
import PerformanceReportUI from "@/ui/PerformanceReportComps/PerformanceReportUI";
import EloReportUI from "@/ui/EloReportComps/EloReportUI";

type props = {
  id: string;
};

export default function CrsPage({ id }: props) {
  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id)),
  );

  if (!statReport) {
    return null;
  }

  return (
    <>
      {statReport.type === "performance" && <PerformanceReportUI statReport={statReport} />}
      {statReport.type === "elo" && <EloReportUI statReport={statReport} />}
    </>
  );
}
