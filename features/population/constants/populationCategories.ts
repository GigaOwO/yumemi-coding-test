/**
 * 人口データのカテゴリ一覧
 * 総人口、年少人口、生産年齢人口、老年人口の4種類
 */
export const POPULATION_CATEGORIES = [
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
] as const;

/**
 * 人口カテゴリの型
 * POPULATION_CATEGORIESの要素のいずれか
 */
export type PopulationCategory = (typeof POPULATION_CATEGORIES)[number];
