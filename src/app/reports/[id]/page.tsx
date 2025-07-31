"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StatReport } from "@/types/statReport";

export default function Page() {
  const pathname = usePathname().split("/")[2];
  const [target, setTarget] = useState<StatReport | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reports");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const reports: StatReport[] = parsed.reports || [];

      const match = reports.find((report) => report.name === pathname);
      setTarget(match || null);

      console.log("data", match);
    } catch (err) {
      console.error("Failed to parse reports:", err);
    }
  }, [pathname]);

  return <div>{target ? `보고서 이름: ${target.name}` : "해당 보고서를 찾을 수 없습니다."}</div>;
}
