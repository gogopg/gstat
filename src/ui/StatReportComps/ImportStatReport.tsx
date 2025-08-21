"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownFromLine } from "lucide-react";
import React, { useState } from "react";
import { useStatReportStore } from "@/store/store";

export function ImportStatReport() {
  const [draftText, setDraftText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const reportList = JSON.parse(draftText);
    useStatReportStore.getState().addMany(reportList);

    setOpen(false);
    setDraftText(draftText);
  };

  const handleCancel = () => {
    setOpen(false);
    setTimeout(() => {
      setDraftText(draftText); // 안정적으로 초기화
    }, 200);
  };

  return (
    <Dialog open={open}>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-blue-500"
        aria-label="텍스트로 리포트 추가"
        onClick={() => setOpen(true)}
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
            <Textarea placeholder="JSON 텍스트" onChange={(e) => setDraftText(e.target.value)} id="report-text" />
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
