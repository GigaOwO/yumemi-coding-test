import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { getPopulationData } from "@/features/population/fetcher";
import { PopulationCompositionPerYearResponse } from "@/features/population/types";
import { PrefectureResponse } from "@/features/prefecture/types";
import { ChartOptions } from "chart.js";

// モック
vi.mock("@/features/population/fetcher");
vi.mock("swr", () => ({
  default: vi.fn(),
}));

// Chart.jsのモック用の型定義
interface MockLineChartProps {
  data: {
    labels: number[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
  options: ChartOptions<"line">;
}

vi.mock("react-chartjs-2", () => ({
  Line: ({ data, options }: MockLineChartProps) => (
    <div data-testid="line-chart">
      <div data-testid="chart-title">{options.plugins?.title?.text || ""}</div>
      <div data-testid="chart-datasets">{JSON.stringify(data.datasets)}</div>
    </div>
  ),
}));

import useSWR from "swr";

describe("Home", () => {
  const mockPrefectureData: PrefectureResponse = {
    message: null,
    result: [
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 2, prefName: "青森県" },
    ],
  };

  const mockPopulationResponse: PopulationCompositionPerYearResponse = {
    message: null,
    result: {
      boundaryYear: 2020,
      data: [
        {
          label: "総人口",
          data: [
            { year: 1980, value: 12817 },
            { year: 1985, value: 12707 },
          ],
        },
        {
          label: "年少人口",
          data: [
            { year: 1980, value: 2906 },
            { year: 1985, value: 2769 },
          ],
        },
        {
          label: "生産年齢人口",
          data: [
            { year: 1980, value: 8360 },
            { year: 1985, value: 8420 },
          ],
        },
        {
          label: "老年人口",
          data: [
            { year: 1980, value: 1551 },
            { year: 1985, value: 1518 },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSWR<PrefectureResponse, Error>).mockReturnValue({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    vi.mocked(getPopulationData).mockResolvedValue(mockPopulationResponse);
  });

  it("renders main title", () => {
    render(<Home />);
    expect(screen.getByText("都道府県別人口構成")).toBeInTheDocument();
  });

  it("renders prefecture selector", () => {
    render(<Home />);
    expect(screen.getByText("北海道")).toBeInTheDocument();
    expect(screen.getByText("青森県")).toBeInTheDocument();
  });

  it("renders category selector with default value", () => {
    render(<Home />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select).toHaveValue("総人口");
  });

  it("renders all category options", () => {
    render(<Home />);
    const options = screen.getAllByRole("option") as HTMLOptionElement[];

    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("総人口");
    expect(options[1]).toHaveTextContent("年少人口");
    expect(options[2]).toHaveTextContent("生産年齢人口");
    expect(options[3]).toHaveTextContent("老年人口");
  });

  it("displays empty state message initially", () => {
    render(<Home />);
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
  });

  it("fetches and displays population data when prefecture is selected", async () => {
    render(<Home />);

    const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(getPopulationData).toHaveBeenCalledWith({ prefCode: 1 });
    });

    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  it("changes category when dropdown is changed", async () => {
    render(<Home />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByTestId("chart-title")).toHaveTextContent(
        "都道府県別人口構成 - 総人口"
      );
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "年少人口" } });

    await waitFor(() => {
      expect(screen.getByTestId("chart-title")).toHaveTextContent(
        "都道府県別人口構成 - 年少人口"
      );
    });
  });

  it("handles multiple prefecture selections", async () => {
    render(<Home />);

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    // 北海道を選択
    fireEvent.click(checkboxes[0]);
    await waitFor(() => {
      expect(getPopulationData).toHaveBeenCalledWith({ prefCode: 1 });
    });

    // 青森県を選択
    fireEvent.click(checkboxes[1]);
    await waitFor(() => {
      expect(getPopulationData).toHaveBeenCalledWith({ prefCode: 2 });
    });

    expect(getPopulationData).toHaveBeenCalledTimes(2);
  });

  it("removes prefecture data when checkbox is unchecked", async () => {
    render(<Home />);

    const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement;

    // チェックを入れる
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(getPopulationData).toHaveBeenCalled();
    });

    // チェックを外す
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByText("都道府県を選択してください")
      ).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(getPopulationData).mockRejectedValue(new Error("API Error"));

    render(<Home />);

    const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch population data:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("updates chart when category is changed after prefecture selection", async () => {
    render(<Home />);

    // 都道府県を選択
    const checkbox = screen.getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByTestId("chart-title")).toHaveTextContent(
        "都道府県別人口構成 - 総人口"
      );
    });

    // カテゴリを変更
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "老年人口" } });

    await waitFor(() => {
      expect(screen.getByTestId("chart-title")).toHaveTextContent(
        "都道府県別人口構成 - 老年人口"
      );
    });
  });

  it("maintains selected prefectures when category changes", async () => {
    render(<Home />);

    // 2つの都道府県を選択
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    await waitFor(() => {
      expect(getPopulationData).toHaveBeenCalledTimes(2);
    });

    // カテゴリを変更
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "年少人口" } });

    // データが再取得されないことを確認（状態が保持されている）
    expect(getPopulationData).toHaveBeenCalledTimes(2);
  });

  it("renders display data label", () => {
    render(<Home />);
    expect(screen.getByText("表示データ:")).toBeInTheDocument();
  });
});
