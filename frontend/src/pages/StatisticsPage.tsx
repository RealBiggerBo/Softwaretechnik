import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import PresetEditor from "../components/PresetEditor";
import StyledButton from "../components/Styledbutton";
import StatisticOutputDisplay from "../classes/StatisticOutputDisplay";
import type { QueryOutput } from "../classes/StatisticOutput";

interface Props {
  caller: IApiCaller;
}

function StatisticsPage({ caller }: Props) {
  const [presets, setPresets] = useState<PresetItemListElement[]>([]);
  const [presetSeed, setPresetSeed] = useState<UiItem<UiPreset> | null>(null);
  const presetRef = useRef<UiItem<UiPreset> | null>(null);
  const [presetTitle, setPresetTitle] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<string>("csv");
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [statisticsType, setStatisticsType] = useState<"Anfrage" | "Fall">(
    "Fall",
  );
  const [statisticResults, setStatisticResults] = useState<QueryOutput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [overwritePresetDialogOpen, setOverwritePresetDialogOpen] =
    useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handlePresetChange = useCallback(
    (nextPreset: UiItem<UiPreset> | null) => {
      presetRef.current = nextPreset;
    },
    [],
  );

  const presetTitles = useMemo(
    () =>
      presets
        .filter((presetItem) => presetItem.type === statisticsType)
        .map((presetItem) => presetItem.title),
    [presets, statisticsType],
  );

  useEffect(() => {
    const fetchPresets = async () => {
      console.log("getStatisticsList");
      const { success, errorMsg, presetsList } =
        await caller.GetStatisticsPresetList();
      if (!success) {
        setSnackbarMessage(errorMsg);
        setSnackbarOpen(true);
        return;
      }
      setPresets(presetsList);
      setPresetSeed(null);
      presetRef.current = null;
      setPresetTitle("");
    };

    void fetchPresets();
  }, [caller]);

  useEffect(() => {
    const fetchFormat = async () => {
      const result = await caller.GetAnfrageJson();
      if (result.success) {
        if (statisticsType === "Anfrage") {
          setFormat(
            DataRecordConverter.ConvertFormatToDataRecord(result.json)[1],
          );
        } else if (statisticsType === "Fall") {
          setFormat(
            DataRecordConverter.ConvertFormatToDataRecord(result.json)[1],
          );
        } else {
          setSnackbarMessage(result.errorMsg);
          setSnackbarOpen(true);
        }
      }
    };
    void fetchFormat();
  }, [caller, statisticsType]);

  async function handleExport() {
    const res = await caller.TryExportStatistic(presetTitle, fileFormat);
    if (!res.success) {
      setSnackbarMessage(res.errorMsg);
      setSnackbarOpen(true);
      return;
    }

    const link = document.createElement("a");
    link.href = res.url;
    link.download = res.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handlePresetTitleChange = useCallback(
    (_event: React.SyntheticEvent, value: string | null) => {
      setPresetTitle(value ?? "");
    },
    [],
  );

  async function handlePresetShowOrCreate() {
    if (!presetTitle) return;

    const existingPreset = presets
      .filter((p) => p.type === statisticsType)
      .find((p) => p.title === presetTitle);

    if (existingPreset) {
      const {
        success,
        errorMsg,
        preset: loadedPreset,
      } = await caller.GetStatisticsPreset(existingPreset.title);

      if (success) {
        const uiPreset = ToUiPreset(loadedPreset);
        setPresetSeed(uiPreset);
        presetRef.current = uiPreset;
      } else {
        setSnackbarMessage(errorMsg);
        setSnackbarOpen(true);
      }
      return;
    }

    const newPreset = ToUiPreset({
      PresetTitle: presetTitle,
      globalRecordType: statisticsType,
      globalFilterOptions: [],
      queries: [],
    });

    setPresetSeed(newPreset);
    presetRef.current = newPreset;
    setPresets((prev) => [
      ...prev,
      {
        title: presetTitle,
        type: statisticsType,
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  const handleStatisticsTypeChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, value: "Anfrage" | "Fall" | null) => {
      if (!value) return;
      setStatisticsType(value);
    },
    [],
  );

  const handleFileFormatChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setFileFormat(event.target.value);
    },
    [],
  );

  async function handleSave() {
    const currentPreset = presetRef.current;
    if (!currentPreset) return;

    const res = await caller.TryCreateStatisticPreset(
      statisticsType,
      presetTitle,
      ToNormalPreset(currentPreset),
    );
    console.log(res.errorMsg);
    if (!res.success) {
      if (res.errorMsg === "Preset mit diesem Namen existiert bereits.") {
        setOverwritePresetDialogOpen(true);
      } else {
        setSnackbarMessage(res.errorMsg);
        setSnackbarOpen(true);
      }
    }
  }

  function handleOverwriteDialogClose() {
    setOverwritePresetDialogOpen(false);
  }

  async function handleOverwriteConfirm() {
    const currentPreset = presetRef.current;
    if (!currentPreset) return;
    const res = await caller.TryUpdateStatisticPreset(
      statisticsType,
      presetTitle,
      ToNormalPreset(currentPreset),
    );
    setOverwritePresetDialogOpen(false);
    if (!res.success) {
      setSnackbarMessage(res.errorMsg);
      setSnackbarOpen(true);
    }
  }

  async function handleExecuteStatistic() {
    const currentPreset = presetRef.current;
    if (!currentPreset) return;

    setIsLoading(true);
    const res = await caller.GetStatisticsData(ToNormalPreset(currentPreset));

    if (res.success) {
      setStatisticResults(res.results);
    } else {
      console.error(res.errorMsg);
    }
    setIsLoading(false);
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
                  options={presetTitles}
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
              {presetSeed && (
                <PresetEditor
                  preset={presetSeed}
                  format={format}
                  onPresetChange={handlePresetChange}
                />
              )}
              <Stack spacing={2} direction="row">
                <StyledButton
                  text="Statistik anzeigen"
                  onClick={handleExecuteStatistic}
                  disabled={!presetSeed || isLoading}
                  variant="outlined"
                />
              </Stack>
              <Stack spacing={2} direction="row">
                <TextField
                  select
                  fullWidth
                  label="Format"
                  sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
                  value={fileFormat}
                  onChange={handleFileFormatChange}
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
                  disabled={!presetSeed}
                  onClick={handleExport}
                />
              </Stack>
            </Stack>
          </form>
        </Grid>
        <Grid size={6}>
          <h1>Statistik</h1>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <StatisticOutputDisplay queryOutputs={statisticResults} />
          )}
        </Grid>
      </Grid>

      {/* Overwrite Preset Dialog */}
      <Dialog
        open={overwritePresetDialogOpen}
        onClose={handleOverwriteDialogClose}
        aria-labelledby="overwrite-dialog-title"
        aria-describedby="overwrite-dialog-description"
      >
        <DialogTitle id="overwrite-dialog-title">
          Preset überschreiben?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="overwrite-dialog-description">
            Ein Preset mit diesem Namen existiert bereits. Möchten Sie es
            überschreiben?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleOverwriteDialogClose}
            autoFocus
          >
            Nein
          </Button>
          <Button variant="outlined" onClick={handleOverwriteConfirm}>
            Ja
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default StatisticsPage;
