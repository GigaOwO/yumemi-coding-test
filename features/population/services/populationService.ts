import { PopulationCompositionPerYearResponse } from "../types/population";

type GetPopulationDataProps = {
  prefCode: number;
};

export async function getPopulationData({
  prefCode,
}: GetPopulationDataProps): Promise<PopulationCompositionPerYearResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
    {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY ?? "",
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch population data");
  }
  return res.json();
}
