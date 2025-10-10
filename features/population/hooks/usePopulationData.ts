import useSWR from "swr";
import { getPopulationData } from "../services/populationService";
import { PopulationCompositionPerYearResponse } from "../types";

/**
 * 都道府県ごとの人口データをSWRでキャッシュして取得するカスタムフック
 * @param prefCode - 都道府県コード。nullの場合はフェッチしない
 * @returns SWRの戻り値(data, error, isLoading等)
 */
export function usePopulationData(prefCode: number | null) {
  const { data, error, isLoading } =
    useSWR<PopulationCompositionPerYearResponse>(
      // prefCodeがnullの場合はフェッチしない
      prefCode !== null ? `population/${prefCode}` : null,
      () => getPopulationData({ prefCode: prefCode! }),
      {
        // キャッシュを有効活用するための設定
        revalidateOnFocus: false, // フォーカス時に再検証しない
        revalidateOnReconnect: false, // 再接続時に再検証しない
        dedupingInterval: 60000, // 60秒間は同じリクエストを重複排除
      }
    );

  return {
    data,
    error,
    isLoading,
  };
}
