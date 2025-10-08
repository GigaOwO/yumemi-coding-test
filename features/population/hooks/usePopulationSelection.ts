import { useState, useRef } from "react";
import { getPopulationData } from "@/features/population/fetcher";
import { PopulationCompositionPerYear } from "@/features/population/types";

export type SelectedPrefecture = {
  prefCode: number;
  prefName: string;
  data: PopulationCompositionPerYear | null;
};

export function usePopulationSelection() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<
    SelectedPrefecture[]
  >([]);
  const loadingRef = useRef<Map<number, boolean>>(new Map());

  async function togglePrefecture(
    prefCode: number,
    prefName: string,
    isChecked: boolean
  ) {
    if (isChecked) {
      if (loadingRef.current.get(prefCode)) {
        return;
      }

      loadingRef.current.set(prefCode, true);

      try {
        const populationData = await getPopulationData({ prefCode });

        if (loadingRef.current.get(prefCode)) {
          setSelectedPrefectures((prev) => [
            ...prev,
            { prefCode, prefName, data: populationData.result },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current.delete(prefCode);
      }
    } else {
      loadingRef.current.delete(prefCode);
      setSelectedPrefectures((prev) =>
        prev.filter((p) => p.prefCode !== prefCode)
      );
    }
  }

  return { selectedPrefectures, togglePrefecture };
}
