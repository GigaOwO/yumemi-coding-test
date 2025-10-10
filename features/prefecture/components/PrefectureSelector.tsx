import useSWR from "swr";
import { getPrefectures } from "../services";
import { PrefectureResponse } from "../types";
import CheckBox from "./CheckBox";

type Props = {
  onToggle: (prefCode: number, prefName: string, isChecked: boolean) => void;
};

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
