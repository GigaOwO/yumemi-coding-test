export const POPULATION_CATEGORIES = [
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
] as const;

export type PopulationCategory = (typeof POPULATION_CATEGORIES)[number];
