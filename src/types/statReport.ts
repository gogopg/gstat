import { Profile, StatDefinition } from "@/types/profile";
import { matchRecord } from "@/types/matchRecord";

export type profileDefinition = { value: string };
export type StatReport = {
  name: string;
  statDefinitions: StatDefinition[];
  profileDefinitions: profileDefinition[];
  profiles: Profile[];
  matchRecords: matchRecord[];
};
