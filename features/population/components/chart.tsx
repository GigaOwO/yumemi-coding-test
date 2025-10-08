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
import { PopulationCategory } from "../types";
import { SelectedPrefecture } from "../hooks/usePopulationSelection";

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

export default function Chart({ selectedPrefectures, category }: Props) {
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

  // データセットの作成
  const datasets = selectedPrefectures
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
    selectedPrefectures.length > 0 && selectedPrefectures[0].data
      ? selectedPrefectures[0].data.data[0]?.data.map((d) => d.year) || []
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

  return <Line options={options} data={data} />;
}
