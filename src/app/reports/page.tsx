import { ImportStatReport } from "@/ui/StatReportComps/ImportStatReport";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { ExportStatReport } from "@/ui/StatReportComps/ExportStatReport";
import { getReports } from "@/app/service/ReportService";
import { getSessionUser } from "@/util/auth";

import LocalReportPageUI from "@/ui/StatReportComps/LocalReportPageUI.dynamic";
import DBReportPageUI from "@/ui/StatReportComps/DBReportPageUI";

export default async function Page() {
  const user = await getSessionUser();
  const reports = await getReports();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Link href="/reports/create">
          <Button type="button" variant="ghost" className="inline-flex text-blue-500" aria-label="새 리포트 추가">
            <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
          </Button>
        </Link>

        {!user && (
          <div>
            <ImportStatReport />
            <ExportStatReport />
          </div>
        )}
      </div>

      {user ? <DBReportPageUI reports={reports} /> : <LocalReportPageUI />}
    </div>
  );
}
