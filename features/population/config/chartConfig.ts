import { ChartOptions } from "chart.js";
import { PopulationCategory } from "../constants";

/**
 * Chart.jsのグラフオプション設定を生成する関数
 *
 * @param category - 表示する人口カテゴリ
 * @returns Chart.jsのオプション設定
 */
export function getChartOptions(
  category: PopulationCategory
): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: `都道府県別人口構成 - ${category}`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "人口数",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "年",
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };
}
