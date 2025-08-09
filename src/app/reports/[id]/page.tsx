"use client";
import { useStatReportStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { StatReport } from "@/types/report";
import PerformanceReportUI from "@/ui/PerformanceReportUI";

export default function Page() {
  const { id } = useParams();
  const statReport = useStatReportStore((state) =>
    state.statReports.find((r) => r.name === decodeURIComponent(id as string)),
  );

  if (!statReport) {
    return;
  }

  return <>{statReport.type === "performance" && <PerformanceReportUI statReport={statReport} />}</>;
}
