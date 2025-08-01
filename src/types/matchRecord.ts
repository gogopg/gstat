import { ProfileRecord } from "@/types/profile";

export type StatValue = Record<string, number>;
export type MatchRecord = {
  name: string;
  enterDate: Date;
  profileRecords: ProfileRecord[];
};
