import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/prefectures/route";

// fetchをモック
global.fetch = vi.fn();

describe("GET /api/prefectures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 環境変数をリセット
    process.env.API_URL = "https://example.com";
    process.env.API_KEY = "test-api-key";
  });

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

    const response = await GET();
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/v1/prefectures",
      expect.objectContaining({
        headers: {
          "X-API-KEY": "test-api-key",
          "Content-Type": "application/json",
        },
      })
    );
    expect(data).toEqual(mockResponse);
  });

  it("API_URLが設定されていない場合は500エラーを返す", async () => {
    delete process.env.API_URL;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "API configuration is missing" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("API_KEYが設定されていない場合は500エラーを返す", async () => {
    delete process.env.API_KEY;

    const response = await GET();
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

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      error: "Failed to fetch prefectures from external API",
    });
  });

  it("ネットワークエラーが発生した場合は500エラーを返す", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Internal server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching prefectures:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
