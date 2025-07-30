import { Profile, StatDefinition } from "@/types/profile";

export type Report = {
    name : string,
    statDefinitions: StatDefinition[];
    profiles: Profile[];
}