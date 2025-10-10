import { useState } from "react";

/**
 * 選択された都道府県の情報
 */
export type SelectedPrefecture = {
  /** 都道府県コード */
  prefCode: number;
  /** 都道府県名 */
  prefName: string;
};

/**
 * チェックボックスで選択された都道府県を管理するフック
 * データのフェッチとキャッシュはSWRが担当するため、このフックは選択状態のみを管理
 *
 * @returns 選択された都道府県のリストと、選択を切り替える関数
 */
export function usePopulationSelection() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<
    SelectedPrefecture[]
  >([]);

  /**
   * 都道府県の選択状態を切り替える
   *
   * @param prefCode - 都道府県コード
   * @param prefName - 都道府県名
   * @param isChecked - チェック状態（trueで選択、falseで選択解除）
   */
  function togglePrefecture(
    prefCode: number,
    prefName: string,
    isChecked: boolean
  ) {
    if (isChecked) {
      setSelectedPrefectures((prev) => [...prev, { prefCode, prefName }]);
    } else {
      setSelectedPrefectures((prev) =>
        prev.filter((p) => p.prefCode !== prefCode)
      );
    }
  }

  return { selectedPrefectures, togglePrefecture };
}
