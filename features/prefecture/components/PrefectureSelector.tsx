import useSWR from "swr";
import { getPrefectures } from "../fetcher";
import { Prefecture } from "../types";

export default function PrefectureSelector() {
  const { data, error, isLoading } = useSWR("prefecture", getPrefectures);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {data.result.map((prefecture: Prefecture) => (
        <div key={prefecture.prefCode} className="flex items-center space-x-2">
          <input type="checkbox" />
          <label>{prefecture.prefName}</label>
        </div>
      ))}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading prefectures</div>}
    </div>
  );
}
