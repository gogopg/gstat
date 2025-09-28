"use server";

import CreateReportForm from "@/app/reports/create/CreateReportForm";
import { insertReport } from "@/app/service/ReportService";
import { getSessionUser } from "@/util/auth";

export default async function Page() {
  const isAuthenticated = !!(await getSessionUser());

  return <CreateReportForm isAuthenticated={isAuthenticated} insertReport={insertReport} />;
}
