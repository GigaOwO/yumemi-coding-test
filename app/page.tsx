"use client";

import { useState } from "react";
import Chart from "@/features/population/components/chart";
import PrefectureSelector from "@/features/prefecture/components/PrefectureSelector";
import { usePopulationSelection } from "@/features/population/hooks";
import { PopulationCategory } from "@/features/population/constants";
import { PopulationCategorySelector } from "@/features/population/components/PopulationCategorySelector";

export default function Home() {
  const { selectedPrefectures, togglePrefecture } = usePopulationSelection();
  const [category, setCategory] = useState<PopulationCategory>("総人口");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口構成</h1>

      <PrefectureSelector onToggle={togglePrefecture} />

      <PopulationCategorySelector value={category} onChange={setCategory} />

      <Chart selectedPrefectures={selectedPrefectures} category={category} />
    </main>
  );
}
