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
export type Side = "A" | "B";
export type MatchRecord = {
  id: string;
  name?: string;
  participants?: { A?: { teamId?: string; teamName?: string }; B?: { teamId?: string; teamName?: string } };
  matchDate: string;
  createdAt: string;
  score: { A: number; B: number };
  roster?: { A: string[]; B: string[] };
  winnerSide: Side;
};
export type ReportBase = {
  name: string;
  createdAt: string;
  type: string;
  profileDefinitions: ProfileDefinition[];
};
export type PerformanceReport = {
  statDefinitions: StatDefinition[];
  performanceRecords: PerformanceRecord[];
};
export type EloReport = {
  k: number;
  eloRating: EloRating[];
  bestOf: 1 | 3 | 5 | 7;
  matchRecords: MatchRecord[];
};
export type EloRating = {
  profileId: string;
  profileName: string;
  score: number;
};

export type StatReport =
  | ({ type: "performance" } & ReportBase & {
        report: PerformanceReport;
      })
  | ({ type: "elo" } & ReportBase & {
        report: EloReport;
      });
