import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { TextField } from "@mui/material";
import type { DataField, EnumField } from "../classes/DataField";
import { ToUiItem, type UiItem } from "../classes/UiItems";
import type { DateRangeFilter, FilterOption } from "../classes/FilterOption";
import { DatePicker } from "@mui/x-date-pickers";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";

interface Props {
  filterOption: UiItem<FilterOption>;
  onChange: (action: UiItem<FilterOption>) => void;
}

function FilterOptionEditor({ filterOption, onChange }: Props) {
  return (
    <>
      {filterOption.value.type === "DateRangeFilter" && (
        <>
          <DatePicker
            value={dayjs(filterOption.value.minValue)}
            onChange={(pickerVal) => {
              onChange({
                ...filterOption,
                value: {
                  ...(filterOption.value as DateRangeFilter),
                  minValue: pickerVal
                    ? pickerVal.format("YYYY-MM-DD")
                    : "0000-00-00",
                },
              });
            }}
          ></DatePicker>
          <DatePicker
            value={dayjs(filterOption.value.maxValue)}
            onChange={(pickerVal) => {
              onChange({
                ...filterOption,
                value: {
                  ...(filterOption.value as DateRangeFilter),
                  maxValue: pickerVal
                    ? pickerVal.format("YYYY-MM-DD")
                    : "0000-00-00",
                },
              });
            }}
          ></DatePicker>
        </>
      )}
      {filterOption.value.type === "DateValueFilter" && (
        <>
          <DatePicker></DatePicker>
        </>
      )}
      {filterOption.value.type === "EnumValueFilter" && (
        <>
          <label>Autocomplete here</label>
        </>
      )}
      {filterOption.value.type === "StringValueFilter" && (
        <>
          <input type="text"></input>
        </>
      )}
      {filterOption.value.type === "IntegerRangeFilter" && (
        <>
          <input type="number"></input>
          <input type="number"></input>
        </>
      )}
      {filterOption.value.type === "IntegerValueFilter" && (
        <>
          <input type="number"></input>
        </>
      )}
    </>
  );
}

export default FilterOptionEditor;
