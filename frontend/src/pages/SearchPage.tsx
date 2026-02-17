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

async function DeleteDataRecord(
  type: "fall" | "anfrage",
  entry: DataRecord,
  caller: IApiCaller,
  updateData: () => void,
) {
  let res;
  if (type == "fall") res = await caller.TryDeleteFall(-1);
  else res = await caller.TryDeleteAnfrage(-1);

  if (res.success) alert("Löschen erfolgreich");
  else alert(res.errorMsg);
  updateData();
}

function SearchPage({ caller }: Props) {
  const navigate = useNavigate();
  const type: "anfrage" | "fall" = GetType(useSearchParams()[0].get("type"));
  const [options, setOptions] = useState(GetDefaultFilterOptions(type));
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [searchResult, setSearchResult] = useState<DataRecord[]>([]);

  const loadData = async () => {
    const result =
      type == "fall"
        ? await caller.GetFallJson()
        : await caller.GetAnfrageJson();
    setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json));
  };
  useEffect(() => {
    loadData();
  }, [caller]);

  return (
    <>
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
      ></FilterOptionList>
      <br></br>
      <StyledButton
        text="Suchen"
        onClick={async () =>
          await Search(type, options, setSearchResult, caller)
        }
      />
      <br></br>
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
                onClick={async () =>
                  await DeleteDataRecord(type, entry, caller, loadData)
                }
              />
            </>
          );
        }}
      />
    </>
  );
}
export default SearchPage;
