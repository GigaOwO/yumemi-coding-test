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
import { useChartData } from "../hooks/useChartData";
import { getChartOptions } from "../config/chartConfig";
import {
  convertMapToList,
  createChartDatasets,
  extractChartLabels,
} from "../utils/chartDataTransform";

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
 * 複数の都道府県の人口推移を折れ線グラフで表示するコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @param props.selectedPrefectures - 選択された都道府県のリスト
 * @param props.category - 表示する人口カテゴリ（総人口、年少人口等）
 * @returns 人口推移グラフコンポーネント
 */
export default function Chart({ selectedPrefectures, category }: Props) {
  const { populationDataMap, handleDataLoaded } =
    useChartData(selectedPrefectures);

  // グラフのオプション設定を取得
  const options = getChartOptions(category);

  // populationDataMapから配列を作成
  const populationDataList = convertMapToList(populationDataMap);

  // データセットの作成
  const datasets = createChartDatasets(populationDataList, category);

  // X軸のラベル（年）を取得
  const labels = extractChartLabels(populationDataList);

  const data = {
    labels,
    datasets,
  };

  if (selectedPrefectures.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 rounded">
        <p className="text-white text-sm sm:text-base">
          都道府県を選択してください
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 各都道府県のデータを個別にフェッチ（Reactのフックルールに準拠） */}
      {selectedPrefectures.map((pref) => (
        <ChartDataProvider
          key={pref.prefCode}
          prefCode={pref.prefCode}
          prefName={pref.prefName}
          onDataLoaded={handleDataLoaded}
        />
      ))}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
