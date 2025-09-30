export type PopulationCompositionPerYear = {
  boundaryYear: number;
  data: {
    label: string;
    data: {
      year: number;
      value: number;
      rate?: number;
    }[];
  }[];
};

export type PopulationCompositionPerYearResponse = {
  message: string | null;
  result: PopulationCompositionPerYear;
};

export type PopulationCategory =
  | "総人口"
  | "年少人口"
  | "生産年齢人口"
  | "老年人口";
