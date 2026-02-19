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
  Collapse,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Props {
  caller: IApiCaller;
}

function GetType(type: string | null) {
  switch (type?.toLowerCase() ?? "") {
    case "fall":
      return "fall";
    default:
      return "anfrage";
  }
}

function GetDefaultFilterOptions(
  type: "fall" | "anfrage",
): UiItem<FilterOption>[] {
  let options: UiItem<FilterOption>[] = [];

  return options;
}

function UpdateOptions(
  options: UiItem<FilterOption>[],
  toUpdate: UiItem<FilterOption>,
  newOption: UiItem<FilterOption>,
): UiItem<FilterOption>[] {
  return options.map((uiOption) =>
    uiOption.id === toUpdate.id ? newOption : uiOption,
  );
}

function AddNewOption(options: UiItem<FilterOption>[]) {
  return [...options, ToUiItem<FilterOption>({ type: "Empty", fieldId: -1 })];
}

function RemoveOption(
  options: UiItem<FilterOption>[],
  optionToRemove: UiItem<FilterOption>,
) {
  return options.filter((uiOption) => uiOption.value !== optionToRemove.value);
}

async function Search(
  type: "fall" | "anfrage",
  options: UiItem<FilterOption>[],
  setSearchResult: (recordds: DataRecord[]) => void,
  caller: IApiCaller,
) {
  let res;
  if (type == "fall")
    res = await caller.TrySearchFall(options.map((uiCase) => uiCase.value));
  else
    res = await caller.TrySearchAnfrage(
      options.map((uiOption) => uiOption.value),
    );

  const values: DataRecord[] =
    DataRecordConverter.ConvertSearchResultToDataRecord(res.searchResult);

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
  type: "fall" | "anfrage",
  entry: DataRecord,
  navigate: NavigateFunction,
) {
  navigate("/dataview?type=" + type + "&id=" + GetIdFromDataRecord(entry));
}

function SearchPage({ caller }: Props) {
  const navigate = useNavigate();
  const type: "anfrage" | "fall" = GetType(useSearchParams()[0].get("type"));
  const [options, setOptions] = useState(GetDefaultFilterOptions(type));
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [searchResult, setSearchResult] = useState<DataRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState(false);

  const bigType = type.charAt(0).toUpperCase() + type.slice(1);

  const loadData = async () => {
    const result =
      type == "fall"
        ? await caller.GetFallJson()
        : await caller.GetAnfrageJson();
    setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json)[1]);
  };
  useEffect(() => {
    loadData();
  }, [caller]);

  async function DeleteDataRecord(
    type: "fall" | "anfrage",
    entry: DataRecord,
    caller: IApiCaller,
    updateData: () => void,
  ) {
    let res;
    if (type == "fall")
      res = await caller.TryDeleteFall(GetIdFromDataRecord(entry));
    else res = await caller.TryDeleteAnfrage(GetIdFromDataRecord(entry));

    if (res.success) {
      activateSnackbar("Löschen erfolgreich");
      setSaveResult(true);
    } else {
      activateSnackbar(res.errorMsg);
      setSaveResult(false);
    }
    updateData();
  }

  function cancelDelete() {
    setOpenDialog(false);
  }

  function activateSnackbar(msg: string) {
    setOpenSnackbar(true);
    setSnackbarMessage(msg);
  }

  return (
    <Stack spacing={2}>
      <h1>
        {type == "anfrage" && "Anfragesuche"}
        {type == "fall" && "Fallsuche"}
      </h1>
      <Stack direction={"row"} alignItems={"center"}>
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="h5">Suchfilter</Typography>
      </Stack>
      <Collapse in={isExpanded}>
        <FilterOptionList
          format={format}
          filterOptions={options}
          addText="Neuer Suchfilter"
          removeText="Löschen"
          updateFilterOption={(toUpdate, newOption) =>
            setOptions(UpdateOptions(options, toUpdate, newOption))
          }
          addNewFilterOption={() => setOptions(AddNewOption(options))}
          removeFilterOption={(toRemove) =>
            setOptions(RemoveOption(options, toRemove))
          }
        />
        <br />
      </Collapse>
      <StyledButton
        text="Suchen"
        onClick={async () =>
          await Search(type, options, setSearchResult, caller)
        }
      />
      <DataRecordList
        data={searchResult}
        mapEntry={(entry) => {
          return (
            <>
              <StyledButton
                text="Bearbeiten / Anzeigen"
                onClick={() => NavigateToDataPage(type, entry, navigate)}
              />
              <StyledButton
                color="error"
                text="Löschen"
                onClick={() => setOpenDialog(true)}
              />
              <Dialog open={openDialog} onClose={cancelDelete}>
                <DialogTitle>{bigType} löschen?</DialogTitle>
                <DialogContent>
                  Möchten Sie {bigType} {GetIdFromDataRecord(entry)} wirklich
                  löschen?
                </DialogContent>
                <DialogActions>
                  <StyledButton onClick={cancelDelete} text="Abbrechen" />
                  <StyledButton
                    color="error"
                    onClick={async () => {
                      await DeleteDataRecord(type, entry, caller, loadData);
                      setOpenDialog(false);
                    }}
                    text="Löschen"
                  />
                </DialogActions>
              </Dialog>
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
            </>
          );
        }}
      />
    </Stack>
  );
}
export default SearchPage;
