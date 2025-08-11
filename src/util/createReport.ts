import { ProfileDefinition, StatReport } from "@/types/report";

export function createDefaultReport(type: StatReport["type"], name: string, defs: ProfileDefinition[]): StatReport {
  const base = { name, createdAt: new Date().toISOString(), profileDefinitions: defs };
  switch (type) {
    case "performance":
      return { ...base, type, payload: { statDefinitions: [], performanceRecords: [] } };
    default:
      return { ...base, type, payload: { k: 16, matchRecords: [], eloRating: [], bestOf: 1 } };
  }
}
