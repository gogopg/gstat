export type StatDefinition = { value: string };
export type ProfileDefinition = { id: string; name: string; description?: string };
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
  participants: { A: { profileId: string; profileName: string }; B: { profileId: string; profileName: string } };
  setResult: { A: number; B: number };
  matchDate: string;
  createdAt: string;
  roster?: { A: string[]; B: string[] };
  winnerSide: Side;
};
export type ReportBase = {
  name: string;
  createdAt: string;
  type: string;
  token?: string;
  profileDefinitions: ProfileDefinition[];
};
export type PerformancePayload = {
  statDefinitions: StatDefinition[];
  performanceRecords: PerformanceRecord[];
};
export type EloPayload = {
  k: number;
  eloRatings: EloRating[];
  bestOf: 1 | 3 | 5 | 7;
  lastUpdatedAt?: string;
  matchRecords: MatchRecord[];
};
export type EloRating = {
  profile: ProfileDefinition;
  score: number;
};

export type StatReport =
  | ({ type: "performance" } & ReportBase & {
        payload: PerformancePayload;
      })
  | ({ type: "elo" } & ReportBase & {
        payload: EloPayload;
      });

export type SimpleStatReport = Pick<StatReport, "name" | "type" | "token" | "createdAt">