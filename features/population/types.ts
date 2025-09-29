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
