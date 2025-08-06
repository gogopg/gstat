import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";

export type DeleteConfirmDialogType = {
  title: string;
  description: string;
  executeFunction: () => void
};

export function DeleteConfirmDialog({ executeFunction, title, description }: DeleteConfirmDialogType) {
  const [open, setOpen] = useState(false);

  const deleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const confirmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    executeFunction();
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
        aria-label={title}
        onClick={deleteClick}
      >
        <TrashIcon className="h-5 w-5" />
        삭제
      </Button>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
