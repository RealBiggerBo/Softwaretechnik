import { Box, Paper, Stack, Divider } from "@mui/material";
import type { QueryOutput } from "./StatisticOutput";
import { memo } from "react";

interface Props {
  queryOutputs: QueryOutput[];
}

function StatisticOutputDisplay({ queryOutputs }: Props) {
  if (queryOutputs.length === 0) {
    return <h3>Keine Statistiken vorhanden. Führen Sie eine Statistik aus.</h3>;
  }

  return (
    <Stack spacing={3}>
      {queryOutputs.map((output, index) => (
        <Paper key={index} elevation={2} sx={{ p: 2 }}>
          <h2>{output.queryTitle}</h2>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {output.outputs.map((statOutput, outIndex) => (
              <Box key={outIndex}>
                <h3>{statOutput.displayActionTitle}</h3>
                {Object.entries(statOutput.output).map(([key, value]) => (
                  <>
                    {key}: {String(value)}{" "}
                  </>
                ))}
              </Box>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default memo(StatisticOutputDisplay);
