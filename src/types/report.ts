export type StatDefinition = { value: string };
export type ProfileDefinition = { name: string; description?: string };
export type StatValue = Record<string, number>;
export type ReportType = "performance" | "elo";
export type ProfileRecord = {
  name: string;
  stats: StatValue;
  count: number;
};
export type PerformanceRecord = {
  name: string;
  createdAt: string;
  profileRecords: ProfileRecord[];
};
export type MatchRecord = {
  name: string;
  matchDate: string;
  createdAt: string;
  winner: string[];
  loser: string[];
};
export type ReportBase = {
  name: string;
  createdAt: string;
  profileDefinitions: ProfileDefinition[];
};
export type PerformanceReport = {
  statDefinitions: StatDefinition[];
  performanceRecords: PerformanceRecord[];
};
export type EloReport = {
  k: number;
  matchRecords: MatchRecord[];
};

export type StatReport =
    | ({ type: "performance" } & ReportBase & {
  report: PerformanceReport
})
    | ({ type: "elo" } & ReportBase & {
  report: EloReport
});
