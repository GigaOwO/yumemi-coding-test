import { getPopulationData } from "@/features/population/services";
import { getPrefectures } from "@/features/prefecture/services";
import { describe, it, expect } from "vitest";

describe("API Fetchers (integration)", () => {
  it("fetches prefectures", async () => {
    const data = await getPrefectures();
    expect(data).toHaveProperty("result");
    expect(Array.isArray(data.result)).toBe(true);
    expect(data.result[0]).toHaveProperty("prefCode");
    expect(data.result[0]).toHaveProperty("prefName");
  });

  it("fetches population for prefCode=1", async () => {
    const data = await getPopulationData({ prefCode: 1 });
    expect(data).toHaveProperty("result");
    expect(Array.isArray(data.result.data)).toBe(true);

    const firstCategory = data.result.data[0];
    expect(firstCategory).toHaveProperty("label");
    expect(Array.isArray(firstCategory.data)).toBe(true);

    const firstPoint = firstCategory.data[0];
    expect(firstPoint).toHaveProperty("year");
    expect(firstPoint).toHaveProperty("value");
  });
});
