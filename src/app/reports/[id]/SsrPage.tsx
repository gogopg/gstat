"use server";
import { getSessionUser } from "@/util/auth";
import { getReport } from "@/app/service/ReportService";
import PerformanceReportUI from "@/ui/PerformanceReportComps/PerformanceReportUI";
import EloReportUI from "@/ui/EloReportComps/EloReportUI";

type props = {
  token: string;
};

export default async function SsrPage({ token }: props) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("아이디 없음");
  }

  const report = await getReport(token, user.id);

  if (!report) {
    return;
  }

  return (
    <>
      {report.type === "performance" && <PerformanceReportUI statReport={report} />}
      {report.type === "elo" && <EloReportUI statReport={report} />}
    </>
  );
}
