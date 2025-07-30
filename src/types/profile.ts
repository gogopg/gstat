export type StatDefinition = { value: string };
export type StatValue = Record<string, number>;
export type Profile = {
  name: string;
  stats: StatValue;
};
