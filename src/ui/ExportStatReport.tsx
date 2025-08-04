import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpFromLine } from "lucide-react";
import React, { useState } from "react";
import { useStatReportStore } from "@/store/store";

export function ExportStatReport() {
  const reportText = JSON.stringify(useStatReportStore.getState().statReports);
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      alert("클립보드에 복사되었습니다!");
    } catch (err) {
      alert("복사 실패!");
      console.error(err);
    }
  };

  return (
    <Dialog open={open}>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-blue-500"
        aria-label="리포트 JSON Text"
        onClick={() => setOpen(true)}
      >
        <ArrowUpFromLine className="h-5 w-5" />
        리포트 내보내기
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>리포트 내보내기</DialogTitle>
        </DialogHeader>
        <DialogDescription>리포트 텍스트를 저장하세요.</DialogDescription>
        <div>
          <Button type="button" onClick={copyToClipboard}>
            클립보드로 복사
          </Button>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Textarea placeholder="JSON 텍스트" readOnly={true} value={reportText} />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" onClick={() => setOpen(false)}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
