import { matchRecord } from "@/types/matchRecord";

export type StatDefinition = { value: string };
export type Profile = {
  name: string;
  matchRecords: matchRecord[];
};
