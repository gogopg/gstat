import { create } from "zustand";
import { StatReport } from "@/types/report";
import { StatRecord } from "@/types/statRecord";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type StatReportStoreType = {
  statReports: StatReport[];
  add: (report: StatReport) => void;
  addMany: (report: StatReport[]) => void;
  remove: (name: string) => void;
  update: (name: string, data: Partial<StatReport>) => void;
  find: (name: string) => StatReport | null;
  addStatRecord(name: any, newStatRecord: StatRecord): void;
  deleteStatRecord(reportName: string | undefined, statRecordName: string): void;
};

export const useStatReportStore = create<StatReportStoreType>()(
  persist(
    immer((set, get) => ({
      statReports: [],
      add: (report) =>
        set((state) => {
          state.statReports.push(report);
        }),
      addMany: (reports: StatReport[]) =>
        set((state) => {
          state.statReports.push(...reports);
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
        return get().statReports.find((item: StatReport) => item.name === name) || null;
      },
      addStatRecord: (name: string, record: StatRecord) =>
        set((state) => {
          const report = state.statReports.find((r) => r.name === name);
          if (report) {
            report.statRecords.push(record);
          }
        }),
      deleteStatRecord: (reportName, statRecordName) =>
        set((state) => {
          const report = state.statReports.find((r) => r.name === reportName);

          if (report) {
            report.statRecords = report.statRecords.filter((r: StatRecord) => r.name !== statRecordName);
          }
        }),
    })),
    {
      name: "StatReports",
    },
  ),
);
