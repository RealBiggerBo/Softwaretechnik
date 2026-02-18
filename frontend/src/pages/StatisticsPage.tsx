import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
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
  const [fileFormat, setFileFormat] = useState<string>("csv");
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [statisticsType, setStatisticsType] = useState<"Anfrage" | "Fall">(
    "Fall",
  );

  useEffect(() => {
    const fetchPresets = async () => {
      console.log("getStatisticsList");
      const availablePresets = await caller.GetStatisticsPresetList();
      setPresets(availablePresets);
      setPreset(null);
      setPresetTitle("");
    };

    void fetchPresets();
  }, [caller]);

  useEffect(() => {
    const fetchFormat = async () => {
      if (statisticsType === "Anfrage") {
        const result = await caller.GetAnfrageJson();
        setFormat(
          DataRecordConverter.ConvertFormatToDataRecord(result.json)[1],
        );
      } else if (statisticsType === "Fall") {
        const result = await caller.GetFallJson();
        setFormat(
          DataRecordConverter.ConvertFormatToDataRecord(result.json)[1],
        );
      }
    };

    void fetchFormat();
  }, [caller, statisticsType]);

  const exportDisabled = !presetTitle;

  function formatDateForApi(value: Dayjs | null): string {
    return value?.toISOString() ?? "";
  }

  async function handleExport() {
    const res = await caller.TryExportStatistic(presetTitle, fileFormat);

    const link = document.createElement("a");
    link.href = res.url;
    console.log(res);

    link.download = res.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handlePresetTitleChange(
    _event: React.SyntheticEvent,
    value: string | null,
  ) {
    setPresetTitle(value ?? "");
  }

  async function handlePresetShowOrCreate() {
    if (!presetTitle) return;

    const existingPreset = presets
      .filter((p) => p.type === statisticsType)
      .find((p) => p.title === presetTitle);

    if (existingPreset) {
      const { success, preset: loadedPreset } =
        await caller.GetStatisticsPreset(existingPreset.title);

      if (success) {
        setPreset(ToUiPreset(loadedPreset));
      }

      return;
    }

    const newPreset = ToUiPreset({
      PresetTitle: presetTitle,
      globalRecordType: statisticsType,
      globalFilterOptions: [],
      queries: [],
    });

    setPreset(newPreset);
    setPresets((prev) => {
      const maxId = prev.reduce((max, p) => Math.max(max, p.id), 0);

      return [
        ...prev,
        {
          id: maxId + 1,
          title: presetTitle,
          type: statisticsType,
          updated_at: new Date().toISOString(),
        },
      ];
    });
  }

  function handleStatisticsTypeChange(
    event: React.MouseEvent<HTMLElement>,
    value: "Anfrage" | "Fall",
  ): void {
    setStatisticsType(value);
  }

  async function handleSave() {
    if (!preset) return;

    const res = await caller.TryCreateStatisticPreset(
      statisticsType,
      presetTitle,
      ToNormalPreset(preset),
    );
    console.log(res.errorMsg);
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
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={presets
                    .filter((presetItem) => presetItem.type === statisticsType)
                    .map((presetItem) => presetItem.title)}
                  value={presetTitle || null}
                  onChange={handlePresetTitleChange}
                  onInputChange={handlePresetTitleChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Vorlage" />
                  )}
                />
                <StyledButton
                  text="Vorlage anzeigen/erstellen"
                  onClick={handlePresetShowOrCreate}
                  variant="outlined"
                  sx={{ px: 7 }}
                />
                <StyledButton
                  text="Vorlage speichern"
                  onClick={handleSave}
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
                  <MenuItem value="csv">csv</MenuItem>
                  <MenuItem value="pdf">pdf</MenuItem>
                  <MenuItem value="xlsx">xlsx</MenuItem>
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

      {/*Nur zum Testen des Farbkontrastes*/}
      <StyledButton color="error" text="FEHLER"></StyledButton>
    </Box>
  );
}
export default StatisticsPage;
