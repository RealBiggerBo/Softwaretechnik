export type QueryOutput = {
  queryTitle: string;
  outputs: StatisticOutput[];
};

export type StatisticOutput = {
  displayActionTitle: string;
  output: [string, unknown];
};
