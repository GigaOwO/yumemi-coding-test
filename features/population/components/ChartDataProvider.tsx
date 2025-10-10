import { useEffect } from "react";
import { usePopulationData } from "../hooks/usePopulationData";
import { PopulationCompositionPerYear } from "../types/population";

type Props = {
  prefCode: number;
  prefName: string;
  onDataLoaded: (
    prefCode: number,
    prefName: string,
    data: PopulationCompositionPerYear | null
  ) => void;
};

/**
 * 個別の都道府県のデータを取得し、親コンポーネントに渡すコンポーネント
 * Reactのフックのルールに従うため、各都道府県ごとに独立したコンポーネントとして実装
 */
export function ChartDataProvider({ prefCode, prefName, onDataLoaded }: Props) {
  const { data } = usePopulationData(prefCode);

  // データが読み込まれたら親に通知（useEffectで制御して無限ループを防ぐ）
  useEffect(() => {
    onDataLoaded(prefCode, prefName, data?.result || null);
  }, [prefCode, prefName, data, onDataLoaded]);

  return null; // このコンポーネントは何もレンダリングしない
}
