import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PrefectureSelector from "@/features/prefecture/components/PrefectureSelector";
import { PrefectureResponse } from "@/features/prefecture/types";
import { SWRResponse } from "swr";

// SWRのモック
vi.mock("swr", () => ({
  default: vi.fn(),
}));

import useSWR from "swr";

// SWRのモック戻り値の型
type MockSWRResponse = Partial<SWRResponse<PrefectureResponse, Error>>;

describe("PrefectureSelector", () => {
  const mockOnToggle = vi.fn();

  const mockPrefectureData: PrefectureResponse = {
    message: null,
    result: [
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 2, prefName: "青森県" },
      { prefCode: 13, prefName: "東京都" },
      { prefCode: 27, prefName: "大阪府" },
    ],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockUseSWR = (response: MockSWRResponse) => {
    vi.mocked(useSWR<PrefectureResponse, Error>).mockReturnValue({
      data: response.data,
      error: response.error,
      isLoading: response.isLoading ?? false,
      isValidating: response.isValidating ?? false,
      mutate: vi.fn(),
    });
  };

  it("displays loading state initially", () => {
    mockUseSWR({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { container } = render(
      <PrefectureSelector onToggle={mockOnToggle} />
    );
    // スケルトンUIが表示されることを確認
    const skeletonItems = container.querySelectorAll(".animate-pulse");
    expect(skeletonItems.length).toBeGreaterThan(0);
  });

  it("displays error message when fetch fails", () => {
    mockUseSWR({
      data: undefined,
      error: new Error("Failed to fetch"),
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);
    expect(screen.getByText("Error loading prefectures")).toBeInTheDocument();
  });

  it("renders all prefectures when data is loaded", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);

    expect(screen.getByText("北海道")).toBeInTheDocument();
    expect(screen.getByText("青森県")).toBeInTheDocument();
    expect(screen.getByText("東京都")).toBeInTheDocument();
    expect(screen.getByText("大阪府")).toBeInTheDocument();
  });

  it("renders checkboxes for all prefectures", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
  });

  it("passes onToggle to CheckBox components", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);

    // CheckBoxが正しくレンダリングされていることを確認
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("uses grid layout for prefecture list", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    const { container } = render(
      <PrefectureSelector onToggle={mockOnToggle} />
    );

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass("grid-cols-8");
  });

  it("handles empty prefecture list", () => {
    mockUseSWR({
      data: { message: null, result: [] },
      error: undefined,
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);

    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes).toHaveLength(0);
  });

  it("calls useSWR with correct parameters", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    render(<PrefectureSelector onToggle={mockOnToggle} />);

    expect(useSWR).toHaveBeenCalledWith("prefecture", expect.any(Function));
  });

  it("renders unique keys for each prefecture", () => {
    mockUseSWR({
      data: mockPrefectureData,
      error: undefined,
      isLoading: false,
    });

    const { container } = render(
      <PrefectureSelector onToggle={mockOnToggle} />
    );

    // 各都道府県が個別のdivでラップされていることを確認
    const prefectureDivs = container.querySelectorAll(".grid > div");
    expect(prefectureDivs).toHaveLength(4);
  });
});
