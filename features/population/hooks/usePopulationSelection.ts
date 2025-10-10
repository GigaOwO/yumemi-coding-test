import { useState } from "react";

export type SelectedPrefecture = {
  prefCode: number;
  prefName: string;
};

/**
 * チェックボックスで選択された都道府県を管理するフック
 * データのフェッチとキャッシュはSWRが担当するため、このフックは選択状態のみを管理
 */
export function usePopulationSelection() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<
    SelectedPrefecture[]
  >([]);

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
