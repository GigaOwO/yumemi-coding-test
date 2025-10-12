import { useState, useCallback, useEffect } from "react";
import { SelectedPrefecture } from "./usePopulationSelection";
import { PopulationDataMap } from "../utils/chartDataTransform";
import { PopulationCompositionPerYear } from "../types";

/**
 * チャートデータの状態管理を行うカスタムフック
 * 選択された都道府県のデータをマップとして管理する
 *
 * @param selectedPrefectures - 選択された都道府県のリスト
 * @returns 人口データマップとデータ読み込みコールバック
 */
export function useChartData(selectedPrefectures: SelectedPrefecture[]) {
  const [populationDataMap, setPopulationDataMap] = useState<PopulationDataMap>(
    new Map()
  );

  // 選択された都道府県が変更されたら、選択解除されたものを削除
  useEffect(() => {
    setPopulationDataMap((prev) => {
      const newMap = new Map(prev);
      const selectedCodes = new Set(selectedPrefectures.map((p) => p.prefCode));

      // 選択されていない都道府県のデータを削除
      for (const [code] of newMap) {
        if (!selectedCodes.has(code)) {
          newMap.delete(code);
        }
      }

      return newMap;
    });
  }, [selectedPrefectures]);

  /**
   * データが読み込まれたときのコールバック関数
   * 都道府県ごとのデータをマップに格納する
   *
   * @param prefCode - 都道府県コード
   * @param prefName - 都道府県名
   * @param data - 人口構成データ
   */
  const handleDataLoaded = useCallback(
    (
      prefCode: number,
      prefName: string,
      data: PopulationCompositionPerYear | null
    ) => {
      setPopulationDataMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(prefCode, { prefName, data });
        return newMap;
      });
    },
    []
  );

  return {
    populationDataMap,
    handleDataLoaded,
  };
}
