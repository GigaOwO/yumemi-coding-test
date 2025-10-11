import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPrefectures } from "@/features/prefecture/services";
import { getPopulationData } from "@/features/population/services";

// fetchをモック
global.fetch = vi.fn();

describe("Prefecture Service (Unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPrefectures", () => {
    it("正常に都道府県一覧を取得できる", async () => {
      const mockResponse = {
        message: null,
        result: [
          { prefCode: 1, prefName: "北海道" },
          { prefCode: 2, prefName: "青森県" },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getPrefectures();

      expect(fetch).toHaveBeenCalledWith(
        "/api/prefectures",
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      expect(data).toEqual(mockResponse);
    });

    it("APIエラー時に例外をスローする", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getPrefectures()).rejects.toThrow(
        "Failed to fetch prefectures"
      );
    });

    it("ネットワークエラー時に例外をスローする", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      await expect(getPrefectures()).rejects.toThrow("Network error");
    });
  });
});

describe("Population Service (Unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPopulationData", () => {
    it("正常に人口データを取得できる", async () => {
      const mockResponse = {
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
          ],
        },
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getPopulationData({ prefCode: 1 });

      expect(fetch).toHaveBeenCalledWith(
        "/api/population?prefCode=1",
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      expect(data).toEqual(mockResponse);
    });

    it("APIエラー時に例外をスローする", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(getPopulationData({ prefCode: 999 })).rejects.toThrow(
        "Failed to fetch population data"
      );
    });

    it("ネットワークエラー時に例外をスローする", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      await expect(getPopulationData({ prefCode: 1 })).rejects.toThrow(
        "Network error"
      );
    });

    it("異なる都道府県コードで正しく動作する", async () => {
      const testCases = [
        { prefCode: 1, prefName: "北海道" },
        { prefCode: 13, prefName: "東京都" },
        { prefCode: 27, prefName: "大阪府" },
        { prefCode: 47, prefName: "沖縄県" },
      ];

      for (const { prefCode } of testCases) {
        const mockResponse = {
          message: null,
          result: {
            boundaryYear: 2020,
            data: [
              {
                label: "総人口",
                data: [{ year: 1980, value: 10000 }],
              },
            ],
          },
        };

        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        await getPopulationData({ prefCode });

        expect(fetch).toHaveBeenCalledWith(
          `/api/population?prefCode=${prefCode}`,
          expect.any(Object)
        );

        vi.clearAllMocks();
      }
    });
  });
});
