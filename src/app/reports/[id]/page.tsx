"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StatReport } from "@/types/statReport";
import { Badge } from "@/components/ui/badge";

import { CirclePlusIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

type savedReports = {
  reports: {
    name: string;
    data: StatReport;
  }[];
};

export default function Page() {
  const methods = useForm<StatReport>({
    defaultValues: {
      name: "",
      statDefinitions: [],
      profileDefinitions: [],
      profiles: [],
      matchRecords: [],
    },
  });

  const pathname = usePathname().split("/")[2];
  const [statReport, setStatReport] = useState<StatReport | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reports");
      if (!raw) return;

      const parsed: savedReports = JSON.parse(raw);
      const match = parsed.reports.find((report) => report.name === pathname);
      setStatReport(match?.data || null);
      if (statReport) {
        methods.reset(statReport);
      }
    } catch (err) {
      console.error("Failed to parse reports:", err);
    }
  }, [pathname]);

  if (!statReport) {
    return <div>해당 보고서를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <Label>스텟</Label>
      {statReport.statDefinitions.map((item) => (
        <Badge key={item.value}>{item.value}</Badge>
      ))}
      <Label>프로필</Label>
      {statReport.profileDefinitions.map((item) => (
        <Badge key={item.value}>{item.value}</Badge>
      ))}

      <Button type="button" variant="ghost" className="flex items-center gap-1" onClick={() => append({ value: "" })}>
        <CirclePlusIcon className="h-4 w-4" />
        기록 추가
      </Button>
    </div>
  );
}
