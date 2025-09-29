import { getPrefectures } from "../fetcher";
import { PrefectureResponse } from "../types";

export default async function PrefectureSelector() {
  let data: PrefectureResponse;
  try {
    data = await getPrefectures();
  } catch {
    return <div>Error loading prefectures</div>;
  }

  return (
    <div>
      {data.result.map((prefecture) => (
        <div key={prefecture.prefCode} className="flex items-center space-x-2">
          <input type="checkbox" />
          <label>{prefecture.prefName}</label>
        </div>
      ))}
    </div>
  );
}
