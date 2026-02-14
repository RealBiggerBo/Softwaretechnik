import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { type DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Button } from "@mui/material";
import {
  ToNormalPreset,
  ToUiItem,
  ToUiPreset,
  type UiItem,
} from "../classes/UiItems";
import PresetDisplay from "../components/PresetDisplay";
import { useSearchParams } from "react-router";
import FilterOptionDisplay from "../components/FilterOptionDisplay";
import FilterOptionList from "../components/FilterOptionList";
import type { FilterOption } from "../classes/FilterOption";
import DataRecordList from "../components/DataRecordList";

interface Props {
  caller: IApiCaller;
}

function GetDefaultFilterOptions(type: string): UiItem<FilterOption>[] {
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

function Search(
  type: string,
  options: UiItem<FilterOption>[],
  setSearchResult: (recordds: DataRecord[]) => void,
  caller: IApiCaller,
) {
  let res;
  if (type == "fall") res = caller.TrySearchFall(options);
  else res = caller.TrySearchAnfrage(options);

  alert(
    "Not yet implemented. Dummy values provided. FilterOptions were: " +
      JSON.stringify(options),
  );

  const dummyValues: DataRecord[] = [
    {
      dataFields: [
        {
          type: "text",
          id: 0,
          required: true,
          name: "Name",
          text: "Fall1",
          maxLength: -1,
        },
      ],
    },
    {
      dataFields: [
        {
          type: "text",
          id: 0,
          required: true,
          name: "Name",
          text: "Fall2",
          maxLength: -1,
        },
      ],
    },
    {
      dataFields: [
        {
          type: "text",
          id: 0,
          required: true,
          name: "Name",
          text: "Fall3",
          maxLength: -1,
        },
      ],
    },
    {
      dataFields: [
        {
          type: "text",
          id: 0,
          required: true,
          name: "Name",
          text: "Fall4",
          maxLength: -1,
        },
      ],
    },
  ];

  setSearchResult(dummyValues);
}

function SearchPage({ caller }: Props) {
  const type = useSearchParams()[0].get("type")?.toLocaleLowerCase() ?? "";
  const [options, setOptions] = useState(GetDefaultFilterOptions(type));
  const [format, setFormat] = useState<DataRecord>({ dataFields: [] });
  const [searchResult, setSearchResult] = useState<DataRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result =
        type == "fall"
          ? await caller.GetFallJson()
          : await caller.GetAnfrageJson();

      setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json));
    };
    fetchData();
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
      <Button onClick={() => Search(type, options, setSearchResult, caller)}>
        Suchen
      </Button>
      <br></br>
      <DataRecordList data={searchResult}></DataRecordList>
    </>
  );
}
export default SearchPage;
