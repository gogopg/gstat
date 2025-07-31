import { Profile, StatDefinition } from "@/types/profile";

export type ReportDefinition = { value: string };
export type StatReport = {
  name: string;
  statDefinitions: StatDefinition[];
  profileDefinitions: ReportDefinition[];
  profiles: Profile[];
};
