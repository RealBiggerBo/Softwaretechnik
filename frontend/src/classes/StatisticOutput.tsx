export type QueryOutput = {
  queryTitle: string;
  outputs: StatisticOutput[];
};

export type StatisticOutput = {
  displayAction: string;
  displayActionTitle: string;
  output: Record<string, unknown>;
};
