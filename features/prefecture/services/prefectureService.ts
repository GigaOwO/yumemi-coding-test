import { PrefectureResponse } from "../types";

/**
 * 都道府県一覧を取得する
 * 内部のルートハンドラ経由でRESAS APIからデータを取得する
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
  const res = await fetch("/api/prefectures", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch prefectures");
  }
  return res.json();
}
