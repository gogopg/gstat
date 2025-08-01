import { create } from "zustand";
import { StatReport } from "@/types/statReport";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type StatReportStoreType = {
  statReports: StatReport[];
  add: (report: StatReport) => void;
  remove: (name: string) => void;
  update: (name: string, data: Partial<StatReport>) => void;
  find: (name: string) => StatReport | null;
};

export const useStatReportStore = create<StatReportStoreType>()(
  persist(
    immer((set, get) => ({
      statReports: [],
      add: (report) =>
        set((state) => {
          state.statReports.push(report);
        }),
      remove: (name) =>
        set((state) => {
          state.statReports = state.statReports.filter((r: StatReport) => r.name !== name);
        }),
      update: (name, data) =>
        set((state) => {
          const target = state.statReports.find((r: StatReport) => r.name === name);
          if (target) Object.assign(target, data);
        }),
      find: (name: string) => {
          return get().statReports.find((item:StatReport)=> item.name === name) || null;
      },
    })),
    {
      name: "StatReports",
    },
  ),
);
