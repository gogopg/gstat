"use client";
import React, { useState } from "react";
import { CreateReportDialog } from "@/ui/CreateReportDialog";
import { StatReport } from "@/types/statReport";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/dist/client/link";

export default function page() {
  const [reports, setReports] = useState<StatReport[]>([]);

  return (
    <div>
      <Link href="/reports/creation">
        <Button type="button" variant="ghost" className="inline-flex text-blue-500" aria-label="새 리포트 추가">
          <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
        </Button>
      </Link>

      <CreateReportDialog />

      <div>
        {reports.map((report) => {
          return <Label key={report.name}>{report.name}</Label>;
        })}
      </div>
    </div>
  );
}
