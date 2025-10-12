import { useEffect, useRef } from "react";
import { usePopulationData } from "../hooks";
import { PopulationCompositionPerYear } from "../types";

/**
 * ChartDataProviderコンポーネントのプロパティ
 */
type Props = {
  /** 都道府県コード */
  prefCode: number;
  /** 都道府県名 */
  prefName: string;
  /**
   * データ読み込み完了時のコールバック関数
   * @param prefCode - 都道府県コード
   * @param prefName - 都道府県名
   * @param data - 人口構成データ（取得失敗時はnull）
   */
  onDataLoaded: (
    prefCode: number,
    prefName: string,
    data: PopulationCompositionPerYear | null
  ) => void;
};

/**
 * 個別の都道府県のデータを取得し、親コンポーネントに渡すコンポーネント
 * Reactのフックのルールに従うため、各都道府県ごとに独立したコンポーネントとして実装
 * SWRによるキャッシングを活用しつつ、データが変更されたときのみ親に通知
 */
export function ChartDataProvider({ prefCode, prefName, onDataLoaded }: Props) {
  const { data } = usePopulationData(prefCode);
  const prevDataRef = useRef<typeof data>(undefined);

  // データが変更されたときのみ親に通知（無限ループ防止）
  useEffect(() => {
    // データが実際に変更された場合のみコールバックを実行
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      onDataLoaded(prefCode, prefName, data?.result || null);
    }
  }, [data, prefCode, prefName, onDataLoaded]);

  return null; // このコンポーネントは何もレンダリングしない
}
