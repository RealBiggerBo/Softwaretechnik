import type { QueryOutput, StatisticOutput } from "./StatisticOutput";

interface Props {
  queryOutputs: QueryOutput[];
}

function StatisticOutputDisplay({ queryOutputs }: Props) {
  return queryOutputs.map((output) => output.queryTitle);
}

export default StatisticOutputDisplay;
