import { PrefectureResponse } from "../types";

/**
 * 都道府県一覧を取得する
 *
 * @returns 都道府県一覧を含むレスポンス
 * @throws ネットワークエラーまたはAPIエラーが発生した場合
 *
 * @example
 * ```ts
 * const prefectures = await getPrefectures();
 * console.log(prefectures.result); // 都道府県の配列
 * ```
 */
export async function getPrefectures(): Promise<PrefectureResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/prefectures`,
    {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY ?? "",
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch prefectures");
  }
  return res.json();
}
