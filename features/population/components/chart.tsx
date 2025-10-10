import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { PopulationCategory } from "../constants";
import { SelectedPrefecture } from "../hooks";
import { ChartDataProvider } from "./ChartDataProvider";
import { useState, useEffect, useCallback } from "react";
import { PopulationCompositionPerYear } from "../types";

type Props = {
  selectedPrefectures: SelectedPrefecture[];
  category: PopulationCategory;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  "rgb(255, 99, 132)",
  "rgb(53, 162, 235)",
  "rgb(75, 192, 192)",
  "rgb(255, 159, 64)",
  "rgb(153, 102, 255)",
  "rgb(255, 205, 86)",
  "rgb(201, 203, 207)",
  "rgb(54, 162, 235)",
];

type PopulationDataMap = Map<
  number,
  { prefName: string; data: PopulationCompositionPerYear | null }
>;

export default function Chart({ selectedPrefectures, category }: Props) {
  const [populationDataMap, setPopulationDataMap] = useState<PopulationDataMap>(
    new Map()
  );

  // 選択された都道府県が変更されたら、マップを更新
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `都道府県別人口構成 - ${category}`,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "人口数",
        },
      },
      x: {
        title: {
          display: true,
          text: "年",
        },
      },
    },
  };

  // populationDataMapから配列を作成
  const populationDataList = Array.from(populationDataMap.entries()).map(
    ([prefCode, { prefName, data }]) => ({
      prefCode,
      prefName,
      data,
    })
  );

  // データセットの作成
  const datasets = populationDataList
    .filter((pref) => pref.data)
    .map((pref, index) => {
      const categoryData = pref.data!.data.find((d) => d.label === category);

      if (!categoryData) {
        return null;
      }

      return {
        label: pref.prefName,
        data: categoryData.data.map((d) => d.value),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length]
          .replace("rgb", "rgba")
          .replace(")", ", 0.5)"),
      };
    })
    .filter((dataset) => dataset !== null);

  // X軸のラベル（年）を取得
  const labels =
    populationDataList.length > 0 && populationDataList[0].data
      ? populationDataList[0].data.data[0]?.data.map((d) => d.year) || []
      : [];

  const data = {
    labels,
    datasets,
  };

  if (selectedPrefectures.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 rounded">
        <p className="text-white">都道府県を選択してください</p>
      </div>
    );
  }

  return (
    <>
      {/* ChartDataProviderコンポーネントを使ってデータを取得 */}
      {selectedPrefectures.map((pref) => (
        <ChartDataProvider
          key={pref.prefCode}
          prefCode={pref.prefCode}
          prefName={pref.prefName}
          onDataLoaded={handleDataLoaded}
        />
      ))}
      <Line options={options} data={data} />
    </>
  );
}
