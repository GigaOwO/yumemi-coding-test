import useSWR from "swr";
import { getPrefectures } from "../services";
import { PrefectureResponse } from "../types";
import CheckBox from "./CheckBox";

/**
 * PrefectureSelectorコンポーネントのプロパティ
 */
type Props = {
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
 *   onToggle={(code, name, checked) => {
 *     console.log(`${name} was ${checked ? 'selected' : 'deselected'}`);
 *   }}
 * />
 * ```
 */
export default function PrefectureSelector({ onToggle }: Props) {
  const { data, error, isLoading } = useSWR<PrefectureResponse>(
    "prefecture",
    getPrefectures
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading prefectures</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-8 gap-2">
      {data.result.map((prefecture) => (
        <div key={prefecture.prefCode}>
          <CheckBox
            prefName={prefecture.prefName}
            prefCode={prefecture.prefCode}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}
