"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownFromLine } from "lucide-react";
import React, { useState } from "react";
import { useStatReportStore } from "@/store/store";
import type { StatReport } from "@/types/report";

function isStatReportArray(value: unknown): value is StatReport[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const candidate = item as { name?: unknown; type?: unknown; payload?: unknown; profileDefinitions?: unknown };
    return (
      typeof candidate.name === "string" &&
      (candidate.type === "performance" || candidate.type === "elo") &&
      Array.isArray(candidate.profileDefinitions) &&
      typeof candidate.payload === "object" &&
      candidate.payload !== null
    );
  });
}

export function ImportStatReport() {
  const [draftText, setDraftText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    try {
      const parsed: unknown = JSON.parse(draftText);
      if (!isStatReportArray(parsed)) {
        throw new Error("잘못된 포맷입니다.");
      }

      useStatReportStore.getState().addMany(parsed);
      setDraftText("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to import reports", error);
      alert("JSON 텍스트를 확인해 주세요.");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setDraftText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-blue-500"
        aria-label="텍스트로 리포트 추가"
        onClick={() => {
          setOpen(true);
        }}
      >
        <ArrowDownFromLine className="h-5 w-5" />
        리포트 가져오기
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>리포트 가져오기</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Textarea
              placeholder="JSON 텍스트"
              value={draftText}
              onChange={(event) => {
                setDraftText(event.target.value);
              }}
              id="report-text"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="button" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
