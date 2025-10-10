import { PopulationCategory } from "@/features/population/constants";

/**
 * PopulationCategorySelectorコンポーネントのプロパティ
 */
type Props = {
  /** 現在選択されている人口カテゴリ */
  value: PopulationCategory;
  /** カテゴリが変更されたときのコールバック関数 */
  onChange: (value: PopulationCategory) => void;
};

/**
 * 人口データのカテゴリを選択するセレクトボックスコンポーネント
 * 総人口、年少人口、生産年齢人口、老年人口の中から選択できる
 *
 * @param props - コンポーネントのプロパティ
 * @param props.value - 現在選択されている人口カテゴリ
 * @param props.onChange - カテゴリが変更されたときのコールバック関数
 * @returns 人口カテゴリ選択コンポーネント
 */
export function PopulationCategorySelector({ value, onChange }: Props) {
  return (
    <div className="mt-6 sm:mt-8 mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label
        htmlFor="population-category"
        className="font-semibold text-sm sm:text-base"
      >
        表示データ:
      </label>
      <select
        id="population-category"
        value={value}
        onChange={(e) => onChange(e.target.value as PopulationCategory)}
        className="border rounded px-3 py-2 cursor-pointer text-sm sm:text-base w-full sm:w-auto bg-white dark:bg-gray-800 dark:border-gray-600"
      >
        <option value="総人口">総人口</option>
        <option value="年少人口">年少人口</option>
        <option value="生産年齢人口">生産年齢人口</option>
        <option value="老年人口">老年人口</option>
      </select>
    </div>
  );
}
