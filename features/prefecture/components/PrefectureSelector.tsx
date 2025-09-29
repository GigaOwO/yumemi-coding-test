import useSWR from "swr";
import { getPrefectures } from "../fetcher";
import { PrefectureResponse } from "../types";
import CheckBox from "./CheckBox";
export default function PrefectureSelector() {
  const { data, error, isLoading } = useSWR<PrefectureResponse>(
    "prefecture",
    getPrefectures
  );
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
          />
        </div>
      ))}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading prefectures</div>}
    </div>
  );
}
