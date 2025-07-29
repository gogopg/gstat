export type Stat = { value: string };
export type StatMap = Record<string, number>;
export type ProfileData = {
  name: string;
  stats: StatMap;
};
