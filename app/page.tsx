"use client";

import { useState, useRef } from "react";
import Chart from "@/features/population/components/chart";
import PrefectureSelector from "@/features/prefecture/components/PrefectureSelector";
import { getPopulationData } from "@/features/population/fetcher";
import {
  PopulationCategory,
  PopulationCompositionPerYear,
} from "@/features/population/types";

export type SelectedPrefecture = {
  prefCode: number;
  prefName: string;
  data: PopulationCompositionPerYear | null;
};

export default function Home() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<
    SelectedPrefecture[]
  >([]);
  const [category, setCategory] = useState<PopulationCategory>("総人口");

  const loadingRef = useRef<Map<number, boolean>>(new Map());

  async function handlePrefectureToggle(
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
      } catch (error) {
        console.error("Failed to fetch population data:", error);
      } finally {
        loadingRef.current.delete(prefCode);
      }
    } else {
      loadingRef.current.delete(prefCode);
      setSelectedPrefectures((prev) =>
        prev.filter((pref) => pref.prefCode !== prefCode)
      );
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口構成</h1>

      <PrefectureSelector onToggle={handlePrefectureToggle} />

      <div className="mt-8 mb-4">
        <label className="font-semibold mr-4">表示データ:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PopulationCategory)}
          className="border rounded px-3 py-2"
        >
          <option value="総人口">総人口</option>
          <option value="年少人口">年少人口</option>
          <option value="生産年齢人口">生産年齢人口</option>
          <option value="老年人口">老年人口</option>
        </select>
      </div>

      <Chart selectedPrefectures={selectedPrefectures} category={category} />
    </main>
  );
}
