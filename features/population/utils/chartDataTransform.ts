import { PopulationCategory, CHART_COLORS } from "../constants";
import { PopulationCompositionPerYear } from "../types";

/**
 * 都道府県コードをキーとして、都道府県名と人口データを格納するマップ
 */
export type PopulationDataMap = Map<
  number,
  { prefName: string; data: PopulationCompositionPerYear | null }
>;

/**
 * 都道府県の人口データ
 */
type PopulationDataItem = {
  prefCode: number;
  prefName: string;
  data: PopulationCompositionPerYear | null;
};

/**
 * Chart.js用のデータセットを作成する
 *
 * @param populationDataList - 都道府県の人口データリスト
 * @param category - 表示する人口カテゴリ
 * @returns Chart.js用のデータセット
 */
export function createChartDatasets(
  populationDataList: PopulationDataItem[],
  category: PopulationCategory
) {
  return populationDataList
    .filter((pref) => pref.data)
    .map((pref, index) => {
      const categoryData = pref.data!.data.find((d) => d.label === category);

      if (!categoryData) {
        return null;
      }

      return {
        label: pref.prefName,
        data: categoryData.data.map((d) => d.value),
        borderColor: CHART_COLORS[index % CHART_COLORS.length],
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
          .replace("rgb", "rgba")
          .replace(")", ", 0.5)"),
      };
    })
    .filter((dataset) => dataset !== null);
}

/**
 * X軸のラベル（年）を取得する
 *
 * @param populationDataList - 都道府県の人口データリスト
 * @returns 年のラベル配列
 */
export function extractChartLabels(
  populationDataList: PopulationDataItem[]
): number[] {
  if (populationDataList.length > 0 && populationDataList[0].data) {
    return populationDataList[0].data.data[0]?.data.map((d) => d.year) || [];
  }
  return [];
}

/**
 * PopulationDataMapから配列形式に変換する
 *
 * @param populationDataMap - 都道府県コードをキーとした人口データマップ
 * @returns 都道府県の人口データリスト
 */
export function convertMapToList(
  populationDataMap: PopulationDataMap
): PopulationDataItem[] {
  return Array.from(populationDataMap.entries()).map(
    ([prefCode, { prefName, data }]) => ({
      prefCode,
      prefName,
      data,
    })
  );
}
