import { ProfileDefinition, StatReport } from "@/types/report";

export function createDefaultReport(type: StatReport["type"], name: string, defs: ProfileDefinition[]): StatReport {
  const base = { name, createdAt: new Date().toISOString(), profileDefinitions: defs };
  return type === "performance"
      ? ({ ...base, type, report: { statDefinitions: [], performanceRecords: [] } })
      : ({ ...base, type, report: { k: 32, matchRecords: [] } });
}