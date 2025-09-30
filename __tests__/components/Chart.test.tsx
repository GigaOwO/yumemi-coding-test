import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Chart from "@/features/population/components/chart";
import { SelectedPrefecture } from "@/app/page";
import { PopulationCategory } from "@/features/population/types";

vi.mock("react-chartjs-2", () => {
  interface MockLineProps {
    data: {
      labels: unknown[];
      datasets: unknown[];
    };
    options: {
      plugins: {
        title: {
          text: string;
        };
      };
    };
  }
  return {
    Line: ({ data, options }: MockLineProps) => (
      <div data-testid="line-chart">
        <div data-testid="chart-title">{options.plugins.title.text}</div>
        <div data-testid="chart-labels">{JSON.stringify(data.labels)}</div>
        <div data-testid="chart-datasets">{JSON.stringify(data.datasets)}</div>
      </div>
    ),
  };
});

describe("Chart", () => {
  const mockPopulationData = {
    boundaryYear: 2020,
    data: [
      {
        label: "総人口",
        data: [
          { year: 1980, value: 12817 },
          { year: 1985, value: 12707 },
          { year: 1990, value: 12571 },
        ],
      },
      {
        label: "年少人口",
        data: [
          { year: 1980, value: 2906 },
          { year: 1985, value: 2769 },
          { year: 1990, value: 2346 },
        ],
      },
      {
        label: "生産年齢人口",
        data: [
          { year: 1980, value: 8360 },
          { year: 1985, value: 8420 },
          { year: 1990, value: 8487 },
        ],
      },
      {
        label: "老年人口",
        data: [
          { year: 1980, value: 1551 },
          { year: 1985, value: 1518 },
          { year: 1990, value: 1738 },
        ],
      },
    ],
  };

  const mockSelectedPrefectures: SelectedPrefecture[] = [
    {
      prefCode: 1,
      prefName: "北海道",
      data: mockPopulationData,
    },
    {
      prefCode: 13,
      prefName: "東京都",
      data: mockPopulationData,
    },
  ];

  it("displays message when no prefectures are selected", () => {
    render(<Chart selectedPrefectures={[]} category="総人口" />);
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
  });

  it("renders chart with correct title for 総人口", () => {
    render(
      <Chart selectedPrefectures={mockSelectedPrefectures} category="総人口" />
    );
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "都道府県別人口構成 - 総人口"
    );
  });

  it("renders chart with correct title for 年少人口", () => {
    render(
      <Chart
        selectedPrefectures={mockSelectedPrefectures}
        category="年少人口"
      />
    );
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "都道府県別人口構成 - 年少人口"
    );
  });

  it("displays correct years as labels", () => {
    render(
      <Chart selectedPrefectures={mockSelectedPrefectures} category="総人口" />
    );
    const labels = screen.getByTestId("chart-labels");
    expect(labels).toHaveTextContent("[1980,1985,1990]");
  });

  it("creates datasets for each selected prefecture", () => {
    render(
      <Chart selectedPrefectures={mockSelectedPrefectures} category="総人口" />
    );
    const datasets = screen.getByTestId("chart-datasets");
    const datasetsContent = datasets.textContent || "";

    expect(datasetsContent).toContain("北海道");
    expect(datasetsContent).toContain("東京都");
  });

  it("displays correct data for selected category", () => {
    render(
      <Chart
        selectedPrefectures={mockSelectedPrefectures}
        category="年少人口"
      />
    );
    const datasets = screen.getByTestId("chart-datasets");
    const datasetsContent = datasets.textContent || "";

    // 年少人口のデータが含まれていることを確認
    expect(datasetsContent).toContain("2906");
    expect(datasetsContent).toContain("2769");
    expect(datasetsContent).toContain("2346");
  });

  it("handles prefecture with null data", () => {
    const prefecturesWithNull: SelectedPrefecture[] = [
      {
        prefCode: 1,
        prefName: "北海道",
        data: mockPopulationData,
      },
      {
        prefCode: 2,
        prefName: "青森県",
        data: null,
      },
    ];

    render(
      <Chart selectedPrefectures={prefecturesWithNull} category="総人口" />
    );

    const datasets = screen.getByTestId("chart-datasets");
    const datasetsContent = datasets.textContent || "";

    // 北海道のデータのみ表示される
    expect(datasetsContent).toContain("北海道");
    expect(datasetsContent).not.toContain("青森県");
  });

  it("renders chart for different categories", () => {
    const categories: PopulationCategory[] = [
      "総人口",
      "年少人口",
      "生産年齢人口",
      "老年人口",
    ];

    categories.forEach((category) => {
      const { unmount } = render(
        <Chart
          selectedPrefectures={mockSelectedPrefectures}
          category={category}
        />
      );

      expect(screen.getByTestId("chart-title")).toHaveTextContent(
        `都道府県別人口構成 - ${category}`
      );

      unmount();
    });
  });

  it("handles single prefecture selection", () => {
    const singlePrefecture: SelectedPrefecture[] = [
      {
        prefCode: 1,
        prefName: "北海道",
        data: mockPopulationData,
      },
    ];

    render(<Chart selectedPrefectures={singlePrefecture} category="総人口" />);

    const datasets = screen.getByTestId("chart-datasets");
    expect(datasets.textContent).toContain("北海道");
  });
});
