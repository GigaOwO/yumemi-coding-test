import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/population/route";
import { NextRequest } from "next/server";

// fetchをモック
global.fetch = vi.fn();

describe("GET /api/population", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 環境変数をリセット
    process.env.API_URL = "https://example.com";
    process.env.API_KEY = "test-api-key";
  });

  const createRequest = (prefCode?: string) => {
    const url = prefCode
      ? `http://localhost:3000/api/population?prefCode=${prefCode}`
      : "http://localhost:3000/api/population";
    return new NextRequest(url);
  };

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

    const request = createRequest("1");
    const response = await GET(request);
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/v1/population/composition/perYear?prefCode=1",
      expect.objectContaining({
        headers: {
          "X-API-KEY": "test-api-key",
          "Content-Type": "application/json",
        },
      })
    );
    expect(data).toEqual(mockResponse);
  });

  it("prefCodeが指定されていない場合は400エラーを返す", async () => {
    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Prefecture code is required" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("API_URLが設定されていない場合は500エラーを返す", async () => {
    delete process.env.API_URL;

    const request = createRequest("1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "API configuration is missing" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("API_KEYが設定されていない場合は500エラーを返す", async () => {
    delete process.env.API_KEY;

    const request = createRequest("1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "API configuration is missing" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("外部APIがエラーを返した場合は適切なエラーレスポンスを返す", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const request = createRequest("999");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      error: "Failed to fetch population data from external API",
    });
  });

  it("ネットワークエラーが発生した場合は500エラーを返す", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const request = createRequest("1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Internal server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching population data:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("複数の都道府県コードで正しく動作する", async () => {
    const prefCodes = ["1", "13", "27", "40"];

    for (const prefCode of prefCodes) {
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

      const request = createRequest(prefCode);
      const response = await GET(request);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(
        `https://example.com/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        expect.any(Object)
      );
      expect(data).toEqual(mockResponse);

      vi.clearAllMocks();
    }
  });
});
