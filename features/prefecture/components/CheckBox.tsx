/**
 * CheckBoxコンポーネントのプロパティ
 */
type Props = {
  /** 都道府県名 */
  prefName: string;
  /** 都道府県コード */
  prefCode: number;
  /** チェックボックスの状態が変更されたときのコールバック関数 */
  onToggle: (prefCode: number, prefName: string, isChecked: boolean) => void;
};

/**
 * 都道府県選択用のチェックボックスコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns チェックボックス要素
 *
 * @example
 * ```tsx
 * <CheckBox
 *   prefName="東京都"
 *   prefCode={13}
 *   onToggle={(code, name, checked) => console.log(code, name, checked)}
 * />
 * ```
 */
export default function CheckBox({ prefName, prefCode, onToggle }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(prefCode, prefName, e.target.checked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={prefCode.toString()}
        onChange={handleChange}
        className="mr-2 cursor-pointer"
      />
      <label htmlFor={prefCode.toString()} className="cursor-pointer text-sm">
        {prefName}
      </label>
    </div>
  );
}
