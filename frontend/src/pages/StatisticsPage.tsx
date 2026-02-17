import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { Dayjs } from "dayjs";
import { type ChangeEvent, useEffect, useState } from "react";
import type { PresetItemListElement } from "../classes/StatisticsTypes";
import { type IApiCaller } from "../classes/IApiCaller";
import { type DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import {
  ToNormalPreset,
  ToUiPreset,
  type UiItem,
  type UiPreset,
} from "../classes/UiItems";
import PresetDisplay from "../components/PresetDisplay";
import DatePickerRange from "../components/DatePickerRange";
import TemplateDialog from "../components/TemplateDialog";
import StyledButton from "../components/Styledbutton";

interface Props {
  caller: IApiCaller;
}

function StatisticsPage({ caller }: Props) {
  const [presets, setPresets] = useState<PresetItemListElement[]>([]);
  const [timeStart, setTimeStart] = useState<Dayjs | null>(null);
  const [timeEnd, setTimeEnd] = useState<Dayjs | null>(null);
  const [preset, setPreset] = useState<UiItem<UiPreset> | null>(null);
  const [presetTitle, setPresetTitle] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<string>("CSV");
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [TemplatesDialogueOpen, setTemplatesDialogueOpen] =
    useState<boolean>(false);
  const [statisticsType, setStatisticsType] = useState<"Anfrage" | "Fall">(
    "Fall",
  );

  useEffect(() => {
    const fetchPresets = async () => {
      const availablePresets = await caller.GetStatisticsPresetList();
      setPresets(availablePresets);
      setPreset(null);
      setPresetTitle("");
    };

    void fetchPresets();
  }, [caller]);

  useEffect(() => {
    const fetchFormat = async () => {
      const result = await caller.GetFallJson();

      setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json));
    };

    void fetchFormat();
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
      "preset",
      fileFormat,
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handlePresetChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const selectedTitle = event.target.value;
    const presetMeta = presets.find((p) => p.title === selectedTitle);
    if (!presetMeta) return;

    const { success, preset: loadedPreset } = await caller.GetStatisticsPreset(
      presetMeta.id,
    );

    if (success) {
      setPreset(ToUiPreset(loadedPreset));
      setPresetTitle(selectedTitle);
    }
  }

  function handleStatisticsTypeChange(
    event: React.MouseEvent<HTMLElement>,
    value: "Anfrage" | "Fall",
  ): void {
    setStatisticsType(value);
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <h1>Auswahlmenü</h1>
          <form>
            <Stack direction="column" spacing={2}>
              <ToggleButtonGroup
                color="primary"
                value={statisticsType}
                exclusive
                onChange={handleStatisticsTypeChange}
              >
                <ToggleButton value="Anfrage">Anfrage</ToggleButton>
                <ToggleButton value="Fall">Fall</ToggleButton>
              </ToggleButtonGroup>
              <Stack spacing={2} direction="row">
                <TextField
                  select
                  fullWidth
                  label="Vorlage"
                  sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
                  value={presetTitle}
                  onChange={handlePresetChange}
                >
                  {presets
                    .filter((presetItem) => presetItem.type === statisticsType)
                    .map((presetItem) => (
                      <MenuItem key={presetItem.id} value={presetItem.title}>
                        {presetItem.title}
                      </MenuItem>
                    ))}
                </TextField>
                <StyledButton
                  text="Vorlage speichern"
                  onClick={() => setTemplatesDialogueOpen(true)}
                  size="large"
                  sx={{ px: 3 }}
                />
              </Stack>
              {preset && (
                <PresetDisplay
                  preset={preset}
                  onChange={setPreset}
                  format={format}
                />
              )}
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
                <StyledButton
                  text="Exportieren"
                  type="button"
                  variant="outlined"
                  size="large"
                  sx={{ px: 3 }}
                  disabled={exportDisabled}
                  onClick={handleExport}
                />
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
