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
import { PopulationCategory, CHART_COLORS } from "../constants";
import { SelectedPrefecture } from "../hooks";
import { ChartDataProvider } from "./ChartDataProvider";
import { useState, useEffect, useCallback } from "react";
import { PopulationCompositionPerYear } from "../types";

/**
 * Chartコンポーネントのプロパティ
 */
type Props = {
  /** 選択された都道府県のリスト */
  selectedPrefectures: SelectedPrefecture[];
  /** 表示する人口カテゴリ */
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

/**
 * 都道府県コードをキーとして、都道府県名と人口データを格納するマップ
 */
type PopulationDataMap = Map<
  number,
  { prefName: string; data: PopulationCompositionPerYear | null }
>;

/**
 * 複数の都道府県の人口推移を折れ線グラフで表示するコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @param props.selectedPrefectures - 選択された都道府県のリスト
 * @param props.category - 表示する人口カテゴリ（総人口、年少人口等）
 * @returns 人口推移グラフコンポーネント
 */
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
        borderColor: CHART_COLORS[index % CHART_COLORS.length],
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
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
