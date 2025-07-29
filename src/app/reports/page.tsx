"use client";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";

export default function page() {
  const [reports, setReports] = useState();

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-blue-500"
        aria-label="새 리포트 추가"
        asChild
      >
        <Link href="/reports/creation">
          <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
        </Link>
      </Button>
        <div>
        </div>
    </div>
  );
}
