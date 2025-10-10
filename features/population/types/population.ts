/**
 * 年次別の人口構成データ
 */
export type PopulationCompositionPerYear = {
  /** 境界年（データの区切りとなる年） */
  boundaryYear: number;
  /** 人口データの配列 */
  data: {
    /** カテゴリラベル（総人口、年少人口等） */
    label: string;
    /** 年次ごとのデータ */
    data: {
      /** 年 */
      year: number;
      /** 人口数 */
      value: number;
      /** 割合（オプション） */
      rate?: number;
    }[];
  }[];
};

/**
 * APIから返される人口構成データのレスポンス型
 */
export type PopulationCompositionPerYearResponse = {
  /** エラーメッセージ（エラーがない場合はnull） */
  message: string | null;
  /** 人口構成データ */
  result: PopulationCompositionPerYear;
};
