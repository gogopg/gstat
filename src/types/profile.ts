import { StatValue } from "@/types/matchRecord";

export type StatDefinition = { value: string };
export type ProfileRecord = {
  name: string;
  stats: StatValue;
  count: number;
};
