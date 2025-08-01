import { StatDefinition } from "@/types/profile";
import { MatchRecord } from "@/types/matchRecord";

export type ProfileDefinition = {
  name: string;
  description?: string;
};
export type StatReport = {
  name: string;
  statDefinitions: StatDefinition[];
  profileDefinitions: ProfileDefinition[];
  matchRecords: MatchRecord[];
};
