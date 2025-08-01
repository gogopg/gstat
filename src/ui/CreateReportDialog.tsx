import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";

export function CreateReportDialog() {
  const [reportName, setReportName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    setReportName(draftName);
    setDraftName(draftName);
  };

  const handleCancel = () => {
    setOpen(false);
    setTimeout(() => {
      setDraftName(reportName); // 안정적으로 초기화
    }, 200);
  };

  return (
    <Dialog open={open}>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-blue-500"
        aria-label="새 리포트 추가"
        onClick={() => setOpen(true)}
      >
        <PlusCircleIcon className="h-5 w-5" />새 리포트 추가
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>새 리포트 생성</DialogTitle>
          <DialogDescription>새 리포트의 이름을 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="report-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="예: LCK 2025"
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
