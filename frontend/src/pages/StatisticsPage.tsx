import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { type IApiCaller } from "../classes/IApiCaller";
import DatePickerRange from "../components/DatePickerRange";
import TemplateDialog from "../components/TemplateDialog";

interface Props {
  caller: IApiCaller;
}

function StatisticsPage({ caller }: Props) {
  const [presets, setPresets] = useState<string[]>(["Vorlage 1", "Vorlage 2"]);
  const [timeStart, setTimeStart] = useState<Dayjs | null>(null);
  const [timeEnd, setTimeEnd] = useState<Dayjs | null>(null);
  const [preset, setPreset] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<string>("CSV");
  const [TemplatesDialogueOpen, setTemplatesDialogueOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchPresets = async () => {
      const availablePresets = await caller.GetStatisticsPresets();
      setPresets(availablePresets);
      setPreset((prev) => prev || availablePresets[0] || "");
    };

    void fetchPresets();
  }, [caller]);

  const exportDisabled =
    !timeStart ||
    !timeEnd ||
    timeStart.isAfter(timeEnd) ||
    !preset ||
    !fileFormat;

  function formatDateForApi(value: Dayjs | null): string {
    return value?.toISOString() ?? "";
  }

  async function handleExport() {
    const url = await caller.GetExportUrl(
      formatDateForApi(timeStart),
      formatDateForApi(timeEnd),
      preset,
      "",
      fileFormat,
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <h1>Auswahlmenü</h1>
          <form>
            <Stack direction="column" spacing={2}>
              <DatePickerRange
                start={timeStart}
                end={timeEnd}
                onStartChange={setTimeStart}
                onEndChange={setTimeEnd}
              />
              <Stack spacing={2} direction="row">
                <TextField
                  select
                  fullWidth
                  label="Vorlage"
                  sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
                  value={preset}
                  onChange={(event) => setPreset(event.target.value)}
                >
                  {presets.map((preset) => (
                    <MenuItem key={preset} value={preset}>
                      {preset}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  onClick={() => setTemplatesDialogueOpen(true)}
                  variant="outlined"
                  size="large"
                  sx={{ px: 3 }}
                >
                  Vorlage Erstellen
                </Button>
                <TemplateDialog
                  caller={caller}
                  open={TemplatesDialogueOpen}
                  onClose={() => setTemplatesDialogueOpen(false)}
                />
                <Button variant="contained" size="large" sx={{ px: 3 }}>
                  Anzeigen
                </Button>
              </Stack>
              <Stack spacing={2} direction="row">
                <TextField
                  select
                  fullWidth
                  label="Format"
                  sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
                  value={fileFormat}
                  onChange={(event) => setFileFormat(event.target.value)}
                >
                  <MenuItem value="CSV">CSV</MenuItem>
                </TextField>
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  sx={{ px: 3 }}
                  disabled={exportDisabled}
                  onClick={handleExport}
                >
                  Exportieren
                </Button>
              </Stack>
            </Stack>
          </form>
        </Grid>
        <Grid size={6}>
          <h1>Statistik</h1>
        </Grid>
      </Grid>
    </Box>
  );
}
export default StatisticsPage;
