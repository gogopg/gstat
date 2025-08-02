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
import { PlusCircleIcon, Trash, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useStatReportStore } from "@/store/store";

type ConfirmDialogType = {
  reportName: string;
};

export function ConfirmDialog({ reportName }: ConfirmDialogType) {
  const [open, setOpen] = useState(false);

  const deleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const confirmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    useStatReportStore.getState().remove(reportName);
    setOpen(false);
  };

  const cancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <Button
        type="button"
        variant="ghost"
        className="inline-flex text-red-500"
        aria-label="새 리포트 추가"
        onClick={deleteClick}
      >
        <TrashIcon className="h-5 w-5" />
        삭제
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{reportName} 리포트 삭제</DialogTitle>
          <DialogDescription>{reportName} 리포트를 삭제합니다. 삭제하면 복구할 수 없습니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={cancelClick}>
            취소
          </Button>
          <Button type="button" onClick={confirmClick}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
