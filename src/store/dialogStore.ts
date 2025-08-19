import { ReactNode } from "react";
import { create } from "zustand";

export type DialogConfig = {
  title: string;
  description: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  showCancelButton: boolean;
  children?: ReactNode;
};

type DialogState = {
  isOpen: boolean;
  config: DialogConfig | null;
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
};

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  config: { title: "", description: "", showCancelButton: false },

  openDialog: (config: DialogConfig) => {
    set({
      isOpen: true,
      config,
    });
  },
  closeDialog: () => {
    const currentConfig = get().config;
    if (currentConfig?.onCancel) {
      currentConfig.onCancel();
    }
    set({
      isOpen: false,
      config: null,
    });
  },
}));
