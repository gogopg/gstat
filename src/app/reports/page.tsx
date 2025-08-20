import { ImportStatReport } from "@/ui/StatReportComps/ImportStatReport";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/dist/client/link";
import { useStatReportStore } from "@/store/store";
import { StatReportCard } from "@/ui/StatReportComps/StatReportCard";
import { ExportStatReport } from "@/ui/StatReportComps/ExportStatReport";
import { getReports } from "@/app/service/ReportService";
import { cookies } from "next/headers";

import LocalReportPageUI from "@/ui/StatReportComps/LocalReportPageUI.dynamic";
import DBReportPageUI from "@/ui/StatReportComps/DBReportPageUI";

export default async function Page() {
  const session = (await cookies()).get("user-session");
  console.log("session", session)

  const user = session ? JSON.parse(session?.value || "") : null;
  const reports = user ? await getReports(user.id) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Link href="/reports/create">
          <Button type="button" variant="ghost" className="inline-flex text-blue-500" aria-label="새 리포트 추가">
            <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
          </Button>
        </Link>

        {/*<ImportStatReport />*/}
        {/*<ExportStatReport />*/}
      </div>

      {session ? <DBReportPageUI reports={reports}/> : <LocalReportPageUI />}
    </div>
  );
}
