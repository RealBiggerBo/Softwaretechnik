import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { type UiItem } from "../classes/UiItems";
import type {
  DateImplicitFilter,
  DateRangeFilter,
  DateValueFilter,
  EnumValueFilter,
  FilterOption,
  IntegerRangeFilter,
  IntegerValueFilter,
  StringValueFilter,
} from "../classes/FilterOption";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import NumberField from "./NumberField";

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
        <DatePicker
          value={dayjs(filterOption.value.value)}
          onChange={(pickerVal) => {
            onChange({
              ...filterOption,
              value: {
                ...(filterOption.value as DateValueFilter),
                value: pickerVal
                  ? pickerVal.format("YYYY-MM-DD")
                  : "0000-00-00",
              },
            });
          }}
        ></DatePicker>
      )}
      {filterOption.value.type === "DateImplicitFilter" && (
        <NumberField
          label={"Letzte Monate"}
          onValueChange={(newVale) =>
            onChange({
              ...filterOption,
              value: {
                ...(filterOption.value as DateImplicitFilter),
                monthSpan: newVale ? newVale : 0,
              },
            })
          }
        ></NumberField>
      )}
      {filterOption.value.type === "EnumValueFilter" && (
        <Autocomplete
          multiple={true}
          options={filterOption.value.possibleValues}
          value={filterOption.value.value}
          getOptionLabel={(f) => f}
          onChange={(_, selectedOptions) => {
            onChange({
              ...filterOption,
              value: {
                ...(filterOption.value as EnumValueFilter),
                value: selectedOptions,
              },
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Felder auswählen" />
          )}
        ></Autocomplete>
      )}
      {filterOption.value.type === "StringValueFilter" && (
        <TextField
          value={filterOption.value.value}
          onChange={(e) =>
            onChange({
              ...filterOption,
              value: {
                ...(filterOption.value as StringValueFilter),
                value: e.target.value,
              },
            })
          }
        ></TextField>
      )}
      {filterOption.value.type === "IntegerRangeFilter" && (
        <>
          <NumberField
            label={"Von"}
            onValueChange={(newVale) =>
              onChange({
                ...filterOption,
                value: {
                  ...(filterOption.value as IntegerRangeFilter),
                  minValue: newVale ? newVale : 0,
                },
              })
            }
          ></NumberField>
          <NumberField
            label={"Bis"}
            onValueChange={(newVale) =>
              onChange({
                ...filterOption,
                value: {
                  ...(filterOption.value as IntegerRangeFilter),
                  maxValue: newVale ? newVale : 0,
                },
              })
            }
          ></NumberField>
        </>
      )}
      {filterOption.value.type === "IntegerValueFilter" && (
        <NumberField
          label={"Wert"}
          onValueChange={(newVale) =>
            onChange({
              ...filterOption,
              value: {
                ...(filterOption.value as IntegerValueFilter),
                value: newVale ? newVale : 0,
              },
            })
          }
        ></NumberField>
      )}
    </>
  );
}

export default FilterOptionEditor;
