import { PopulationCategory } from "@/features/population/types";

type Props = {
  value: PopulationCategory;
  onChange: (value: PopulationCategory) => void;
};

export function PopulationCategorySelector({ value, onChange }: Props) {
  return (
    <div className="mt-8 mb-4">
      <label className="font-semibold mr-4">表示データ:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PopulationCategory)}
        className="border rounded px-3 py-2"
      >
        <option value="総人口">総人口</option>
        <option value="年少人口">年少人口</option>
        <option value="生産年齢人口">生産年齢人口</option>
        <option value="老年人口">老年人口</option>
      </select>
    </div>
  );
}
