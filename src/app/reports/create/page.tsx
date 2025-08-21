"use server";
import CreateReportForm from "@/app/reports/create/CreateReportForm";
import { getSessionUser } from "@/util/auth";
import { insertReport } from "@/app/service/ReportService";

export default async function Page() {

  const isAuthenticated= !!(await getSessionUser());
  const insertFunction = insertReport;

  return (<CreateReportForm isAuthenticated={isAuthenticated} insertReport={insertFunction}/>)
}
