/**
 * CheckBoxコンポーネントのプロパティ
 */
type Props = {
  /** 都道府県名 */
  prefName: string;
  /** 都道府県コード */
  prefCode: number;
  /** チェックボックスの選択状態 */
  checked?: boolean;
  /** チェックボックスの状態が変更されたときのコールバック関数 */
  onToggle: (prefCode: number, prefName: string, isChecked: boolean) => void;
};

/**
 * 都道府県選択用のチェックボックスコンポーネント（制御コンポーネント）
 *
 * @param props - コンポーネントのプロパティ
 * @returns チェックボックス要素
 *
 * @example
 * ```tsx
 * <CheckBox
 *   prefName="東京都"
 *   prefCode={13}
 *   checked={true}
 *   onToggle={(code, name, checked) => console.log(code, name, checked)}
 * />
 * ```
 */
export default function CheckBox({
  prefName,
  prefCode,
  checked = false,
  onToggle,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(prefCode, prefName, e.target.checked);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <input
        type="checkbox"
        id={prefCode.toString()}
        checked={checked}
        onChange={handleChange}
        className="cursor-pointer w-4 h-4 sm:w-auto sm:h-auto"
      />
      <label
        htmlFor={prefCode.toString()}
        className="cursor-pointer text-xs sm:text-sm leading-tight"
      >
        {prefName}
      </label>
    </div>
  );
}
