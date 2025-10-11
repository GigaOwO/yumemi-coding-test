import { PopulationCompositionPerYearResponse } from "../types";

/**
 * 人口データ取得関数のパラメータ
 */
type GetPopulationDataProps = {
  /** 都道府県コード */
  prefCode: number;
};

/**
 * 指定された都道府県の人口構成データを取得する
 * 内部のルートハンドラ経由でRESAS APIからデータを取得する
 *
 * @param params - パラメータオブジェクト
 * @param params.prefCode - 都道府県コード
 * @returns 人口構成データのレスポンス
 * @throws {Error} APIリクエストが失敗した場合
 */
export async function getPopulationData({
  prefCode,
}: GetPopulationDataProps): Promise<PopulationCompositionPerYearResponse> {
  const res = await fetch(`/api/population?prefCode=${prefCode}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch population data");
  }
  return res.json();
}
