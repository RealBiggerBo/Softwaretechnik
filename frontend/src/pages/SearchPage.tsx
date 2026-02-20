import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { type DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { ToUiItem, type UiItem } from "../classes/UiItems";
import {
  useNavigate,
  useSearchParams,
  type NavigateFunction,
} from "react-router";
import FilterOptionList from "../components/FilterOptionList";
import type { FilterOption } from "../classes/FilterOption";
import DataRecordList from "../components/DataRecordList";
import StyledButton from "../components/Styledbutton";
import {
  Alert,
  Autocomplete,
  Box,
  Collapse,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DialogComponent from "../components/DialogComponent";
import { jsx } from "react/jsx-runtime";

interface Props {
  caller: IApiCaller;
}

function GetType(type: string | null) {
  switch (type?.toLowerCase() ?? "") {
    case "fall":
      return "Fall";
    default:
      return "Anfrage";
  }
}

function GetDefaultFilterOptions(
  type: "Fall" | "Anfrage",
): UiItem<FilterOption>[] {
  let options: UiItem<FilterOption>[] = [];

  return options;
}

function UpdateOptions(
  options: UiItem<FilterOption>[],
  idToUpdate: string,
  newOption: UiItem<FilterOption>,
): UiItem<FilterOption>[] {
  return options.map((uiOption) =>
    uiOption.id === idToUpdate ? newOption : uiOption,
  );
}

function AddNewOption(options: UiItem<FilterOption>[]) {
  return [...options, ToUiItem<FilterOption>({ type: "Empty", fieldId: -1 })];
}

function RemoveOption(options: UiItem<FilterOption>[], optionId: string) {
  return options.filter((uiOption) => uiOption.id !== optionId);
}

async function Search(
  type: "Fall" | "Anfrage",
  options: UiItem<FilterOption>[],
  formats: [number, DataRecord][],
  formatVersion: number,
  setSearchResult: (recordds: DataRecord[]) => void,
  caller: IApiCaller,
) {
  console.log(formats);
  console.log(formatVersion);
  let res;
  if (type == "Fall")
    res = await caller.TrySearchFall(
      options.map((uiCase) => uiCase.value),
      formatVersion,
    );
  else
    res = await caller.TrySearchAnfrage(
      options.map((uiOption) => uiOption.value),
      formatVersion,
    );

  console.log("Ergebnis der Suche mit formatversion " + formatVersion + ":");
  console.log(res);

  //Convert res.searchResult to Record<string, unknown>[]

  //merge with current format
  console.log(
    "DAS HIER WILLST DU SEHEN::::" + JSON.stringify(res.searchResult),
  );
  const values: DataRecord[] =
    DataRecordConverter.ConvertSearchResultToDataRecord(
      res.searchResult,
      GetCurrentSelectedFormat(formats, formatVersion),
    );

  console.log("Konvertierte records:");
  console.log(values);

  setSearchResult(values);
}

function GetIdFromDataRecord(dataRecord: DataRecord) {
  const idFields = dataRecord.dataFields.filter(
    (field) => field.name.toLowerCase() === "id",
  );
  if (idFields.length <= 0 || idFields[0].type !== "text") return -1;
  const id = Number(idFields[0].text);

  return isNaN(id) ? -1 : id;
}

function NavigateToDataPage(
  type: "Fall" | "Anfrage",
  entry: DataRecord,
  navigate: NavigateFunction,
) {
  navigate(
    "/dataview?type=" +
      type.toLowerCase() +
      "&id=" +
      GetIdFromDataRecord(entry),
  );
}

function GetCurrentSelectedFormat(
  formats: [number, DataRecord][],
  formatVersion: number,
): DataRecord {
  const fittingFiltes = formats.filter((format) => format[0] == formatVersion);

  if (fittingFiltes.length >= 1) return fittingFiltes[0][1];
  return { dataFields: [] };
}

function SearchPage({ caller }: Props) {
  const navigate = useNavigate();
  const type: "Anfrage" | "Fall" = GetType(useSearchParams()[0].get("type"));
  const [options, setOptions] = useState(GetDefaultFilterOptions(type));
  //const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [formats, setFormats] = useState<[number, DataRecord][]>([]);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<
    number | undefined
  >(undefined);
  const [searchResult, setSearchResult] = useState<DataRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogObject, setDialogObject] = useState({
    isOpen: false,
    title: "",
    body: "",
    yes: "",
    no: "",
    yesAction: async () => {},
    noAction: async () => {},
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState(false);

  const loadFormats = async () => {
    const smallType = type == "Anfrage" ? "anfrage" : "fall";
    const result = await caller.GetExistingDataFormats(smallType);

    const formats = DataRecordConverter.ConvertToFormatCollection(
      result.formats,
    );
    setFormats(formats);
    if (formats.length >= 1)
      setSelectedFormatVersion(formats[formats.length - 1][0]);
    else setSelectedFormatVersion(undefined);
  };
  useEffect(() => {
    loadFormats();
  }, [caller, type]);

  async function DeleteDataRecord(
    type: "Fall" | "Anfrage",
    entry: DataRecord,
    formatVersion: number,
    caller: IApiCaller,
  ) {
    let res;
    if (type == "Fall")
      res = await caller.TryDeleteFall(GetIdFromDataRecord(entry));
    else res = await caller.TryDeleteAnfrage(GetIdFromDataRecord(entry));

    if (res.success) {
      activateSnackbar("Löschen erfolgreich");
      setSaveResult(true);
    } else {
      activateSnackbar(res.errorMsg);
      setSaveResult(false);
    }
    await Search(
      type,
      options,
      formats,
      formatVersion,
      setSearchResult,
      caller,
    );
  }

  function activateSnackbar(msg: string) {
    setOpenSnackbar(true);
    setSnackbarMessage(msg);
  }

  function OpenDialogObject(
    type: "Fall" | "Anfrage",
    entry: DataRecord,
    formatVersion: number,
    caller: IApiCaller,
  ) {
    const id = GetIdFromDataRecord(entry);
    const title = type + " löschen?";
    const body = "Möchten Sie " + type + " " + id + " wirklich löschen";
    const yes = "Löschen";
    const no = "Abbrechen";
    const yesAction = async () => {
      await DeleteDataRecord(type, entry, formatVersion, caller);
      await CloseDialogObject();
    };

    setDialogObject({
      isOpen: true,
      title: title,
      body: body,
      yes: yes,
      no: no,
      yesAction: yesAction,
      noAction: CloseDialogObject,
    });
  }
  async function CloseDialogObject() {
    setDialogObject({
      ...dialogObject,
      isOpen: false,
    });
  }

  return (
    <>
      <Stack spacing={2}>
        <h1>{type + "suche"}</h1>
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography variant="h5">Suchfilter</Typography>
        </Stack>
        <Collapse in={isExpanded}>
          <Autocomplete
            value={
              selectedFormatVersion ? selectedFormatVersion.toString() : ""
            }
            options={formats.map((formats) => formats[0].toString())}
            onChange={(_, newValue) =>
              setSelectedFormatVersion(
                newValue
                  ? isNaN(Number(newValue))
                    ? undefined
                    : Number(newValue)
                  : undefined,
              )
            }
            renderInput={(params) => (
              <TextField {...params} label="Formatversion auswählen" />
            )}
          ></Autocomplete>
          <FilterOptionList
            format={GetCurrentSelectedFormat(
              formats,
              selectedFormatVersion ? selectedFormatVersion : -1,
            )}
            filterOptions={options}
            addText="Neuer Suchfilter"
            removeText="Löschen"
            updateFilterOptionById={(toUpdate, newOption) =>
              setOptions(UpdateOptions(options, toUpdate, newOption))
            }
            addNewFilterOption={() => setOptions(AddNewOption(options))}
            removeFilterOptionById={(toRemove) =>
              setOptions(RemoveOption(options, toRemove))
            }
          />
          <br />
        </Collapse>
        <StyledButton
          text="Suchen"
          onClick={async () => {
            console.log("vor suche");
            await Search(
              type,
              options,
              formats,
              selectedFormatVersion ? selectedFormatVersion : -1,
              setSearchResult,
              caller,
            );
            console.log("nach such");
          }}
        />
        <DataRecordList
          data={searchResult}
          mapEntry={(entry) => {
            return (
              <Box sx={{ padding: "5px" }}>
                <StyledButton
                  text="Bearbeiten / Anzeigen"
                  onClick={() => NavigateToDataPage(type, entry, navigate)}
                />
                <StyledButton
                  color="error"
                  text="Löschen"
                  onClick={() =>
                    OpenDialogObject(
                      type,
                      entry,
                      selectedFormatVersion ? selectedFormatVersion : -1,
                      caller,
                    )
                  }
                />
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                >
                  <Alert
                    severity={saveResult ? "success" : "error"}
                    onClose={() => setOpenSnackbar(false)}
                  >
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </Box>
            );
          }}
        />
      </Stack>
      <DialogComponent dialogObject={dialogObject} />
    </>
  );
}
export default SearchPage;
