export type StatDefinition = { value: string };
export type ProfileDefinition = { name: string; description?: string };
export type StatValue = Record<string, number>;
export type ProfileRecord = {
  name: string;
  stats: StatValue;
  count: number;
};
export type MatchRecord = {
  name: string;
  enterDate: Date;
  profileRecords: ProfileRecord[];
};
export type StatReport = {
  name: string;
  statDefinitions: StatDefinition[];
  profileDefinitions: ProfileDefinition[];
  matchRecords: MatchRecord[];
};