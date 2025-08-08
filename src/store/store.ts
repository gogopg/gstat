import { create } from "zustand";
import { StatReport } from "@/types/report";
import { MatchRecord, PerformanceRecord } from "@/types/report";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type StatReportStoreType = {
  statReports: StatReport[];
  add: (report: StatReport) => void;
  addMany: (report: StatReport[]) => void;
  remove: (name: string) => void;
  update: (name: string, data: Partial<StatReport>) => void;
  find: (name: string) => StatReport | null;
  addPerformanceRecord: (name: string, record: PerformanceRecord) => void;
  deletePerformanceRecord: (reportName: string, recordName: string) => void;
  addMatchRecord: (name: string, record: MatchRecord) => void;
  deleteMatchRecord: (reportName: string, matchName: string) => void;
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
      // ---------- Performance ----------
      addPerformanceRecord: (name, record) =>
        set((state) => {
          const r = state.statReports.find((x) => x.name === name && x.type === "performance");
          if (!r || r.type !== "performance") return;
          r.report.performanceRecords.push(record);
        }),

      deletePerformanceRecord: (reportName, recordName) =>
        set((state) => {
          const r = state.statReports.find((x) => x.name === reportName && x.type === "performance");
          if (!r || r.type !== "performance") return;
          r.report.performanceRecords = r.report.performanceRecords.filter((p) => p.name !== recordName);
        }),

      // ---------- Elo ----------
      addMatchRecord: (name, record) =>
        set((state) => {
          const r = state.statReports.find((x) => x.name === name && x.type === "elo");
          if (!r || r.type !== "elo") return;
          r.report.matchRecords.push(record);
        }),

      deleteMatchRecord: (reportName, matchName) =>
        set((state) => {
          const r = state.statReports.find((x) => x.name === reportName && x.type === "elo");
          if (!r || r.type !== "elo") return;
          r.report.matchRecords = r.report.matchRecords.filter((m) => m.name !== matchName);
        }),
    })),
    {
      name: "StatReports",
    },
  ),
);
