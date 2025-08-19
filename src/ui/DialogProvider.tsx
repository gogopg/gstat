"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialogStore";
import { Button } from "@/components/ui/button";

export function DialogProvider() {
  const { isOpen, config, closeDialog } = useDialogStore();
  const onConfirmClick = () => {
    if (config?.onConfirm) {
      config.onConfirm();
    }

    closeDialog();
  };

  if (!config) {
    return <div></div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          {config.description && <DialogDescription>{config.description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          {config.showCancelButton && <Button onClick={closeDialog}>취소</Button>}
          <Button variant="outline" onClick={onConfirmClick}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
