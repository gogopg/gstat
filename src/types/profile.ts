export type Stat = { value: string };
export type StatMap = Record<string, number>;
export type Profile = {
  name: string;
  stats: StatMap;
};
