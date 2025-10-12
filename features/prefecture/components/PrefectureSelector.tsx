import useSWR from "swr";
import { getPrefectures } from "../services";
import { PrefectureResponse } from "../types";
import CheckBox from "./CheckBox";
import PrefectureSelectorSkeleton from "./PrefectureSelectorSkeleton";

/**
 * PrefectureSelectorコンポーネントのプロパティ
 */
type Props = {
  /** 選択された都道府県コードのセット */
  selectedPrefCodes?: Set<number>;
  /** 都道府県が選択/選択解除されたときのコールバック関数 */
  onToggle: (prefCode: number, prefName: string, isChecked: boolean) => void;
};

/**
 * 都道府県選択UIコンポーネント
 *
 * 都道府県一覧を取得し、グリッド形式で表示します。
 * 各都道府県はチェックボックスで選択可能です。
 *
 * @param props - コンポーネントのプロパティ
 * @returns 都道府県選択UI
 *
 * @example
 * ```tsx
 * <PrefectureSelector
 *   selectedPrefCodes={new Set([1, 13])}
 *   onToggle={(code, name, checked) => {
 *     console.log(`${name} was ${checked ? 'selected' : 'deselected'}`);
 *   }}
 * />
 * ```
 */
export default function PrefectureSelector({
  selectedPrefCodes = new Set(),
  onToggle,
}: Props) {
  const { data, error, isLoading } = useSWR<PrefectureResponse>(
    "prefecture",
    getPrefectures
  );

  if (isLoading) {
    return <PrefectureSelectorSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded border border-red-300 dark:border-red-800">
        <p className="text-sm sm:text-base">
          都道府県データの読み込みに失敗しました。ページを再読み込みしてください。
        </p>
      </div>
    );
  }

  if (!data) {
    return <PrefectureSelectorSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
      {data.result.map((prefecture) => (
        <CheckBox
          key={prefecture.prefCode}
          prefName={prefecture.prefName}
          prefCode={prefecture.prefCode}
          checked={selectedPrefCodes.has(prefecture.prefCode)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
