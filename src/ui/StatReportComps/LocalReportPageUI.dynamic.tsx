"use client";
import dynamic from "next/dynamic";

const LocalReports = dynamic(() => import("./LocalReportPageUI"), {
  ssr: false,
  loading: () => <p>로컬 리포트 로딩…</p>,
});

export default LocalReports;