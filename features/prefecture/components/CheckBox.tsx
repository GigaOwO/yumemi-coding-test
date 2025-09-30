type Props = {
  prefName: string;
  prefCode: number;
  onToggle: (prefCode: number, prefName: string, isChecked: boolean) => void;
};

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
        className="mr-2"
      />
      <label htmlFor={prefCode.toString()} className="cursor-pointer text-sm">
        {prefName}
      </label>
    </div>
  );
}
