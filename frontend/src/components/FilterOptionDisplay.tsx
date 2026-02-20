import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { Box, Stack, TextField } from "@mui/material";
import type { DataField, EnumField } from "../classes/DataField";
import { ToUiItem, type UiItem } from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionEditor from "./FilterOptionEditor";
import { memo, useMemo } from "react";

interface Props {
  option: UiItem<FilterOption>;
  format: DataRecord;
  onChange: (action: UiItem<FilterOption>) => void;
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();

  // Months are 0-indexed (0 = January), so we add 1
  // padStart(2, '0') ensures "5" becomes "05"
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function GetAvailableOptions(dataField?: DataField): UiItem<FilterOption>[] {
  if (dataField == undefined) return [];
  else {
    switch (dataField.type) {
      case "date":
        return [
          ToUiItem({
            type: "DateRangeFilter",
            fieldId: dataField.id,
            minValue: getCurrentDate(),
            maxValue: getCurrentDate(),
          }),
          ToUiItem({
            type: "DateValueFilter",
            fieldId: dataField.id,
            value: getCurrentDate(),
          }),
          ToUiItem({
            type: "DateImplicitFilter",
            fieldId: dataField.id,
            monthSpan: 0,
          }),
        ];
      case "integer":
        return [
          ToUiItem({
            type: "IntegerRangeFilter",
            fieldId: dataField.id,
            minValue: 0,
            maxValue: 0,
          }),
          ToUiItem({
            type: "IntegerValueFilter",
            fieldId: dataField.id,
            value: 0,
          }),
        ];
      case "enum":
        return [
          ToUiItem({
            type: "EnumValueFilter",
            fieldId: dataField.id,
            value: [],
            possibleValues: (dataField as EnumField).possibleValues,
          }),
        ];
      case "text":
        return [
          ToUiItem({
            type: "StringValueFilter",
            fieldId: dataField.id,
            value: "",
          }),
        ];
      case "boolean":
      default:
        return [];
    }
  }
}

function GetOptionFromDisplayAction(filterOption: UiItem<FilterOption>): {
  label: string;
  filter: UiItem<FilterOption>;
} {
  switch (filterOption.value.type) {
    case "DateRangeFilter":
    case "IntegerRangeFilter":
      return { label: "Von - Bis", filter: filterOption };
    case "DateValueFilter":
    case "IntegerValueFilter":
    case "EnumValueFilter":
    case "StringValueFilter":
      return { label: "Exakt", filter: filterOption };
    case "DateImplicitFilter":
      return { label: "Letzte Monate", filter: filterOption };
    default:
      return {
        label: "",
        filter: ToUiItem({ type: "Empty", fieldId: -1 }),
      };
  }
}

function GenerateAutoCompleteOptions(dataField?: DataField) {
  return GetAvailableOptions(dataField).map((dataField) =>
    GetOptionFromDisplayAction(dataField),
  );
}

function GetSelectedFieldOption(
  action: UiItem<FilterOption>,
  fields: DataField[],
) {
  return fields.find((f) => f.id === action.value.fieldId) ?? null;
}

function GetSelectedFilterOption(
  action: UiItem<FilterOption>,
  options: ReturnType<typeof GenerateAutoCompleteOptions>,
) {
  return (
    options.find((o) => o.filter?.value.type === action.value.type) ?? null
  );
}

function FilterOptionDisplay({ option, format, onChange }: Props) {
  const selectedDataField = useMemo(
    () => format.dataFields.find((f) => f.id === option.value.fieldId),
    [format.dataFields, option.value.fieldId],
  );
  const filterOptions = useMemo(
    () => GenerateAutoCompleteOptions(selectedDataField),
    [selectedDataField],
  );
  const selectedFilterOption = useMemo(
    () => GetSelectedFilterOption(option, filterOptions),
    [option, filterOptions],
  );
  const selectedFieldOption = useMemo(
    () => GetSelectedFieldOption(option, format.dataFields),
    [option, format.dataFields],
  );

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          options={format.dataFields}
          value={selectedFieldOption}
          getOptionLabel={(f) => f.name}
        onChange={(_, field) => {
          onChange(
            field
              ? ToUiItem({ type: "Empty", fieldId: field.id }, option)
              : ToUiItem({ type: "Empty", fieldId: -1 }, option),
          );
        }}
          renderInput={(params) => (
            <TextField {...params} label="Feld auswählen" />
          )}
          sx={{ flex: 1 }}
        />
        {selectedDataField != undefined && (
          <Autocomplete
            options={filterOptions}
            value={selectedFilterOption}
            renderInput={(params) => (
              <TextField {...params} label="Operation auswählen" />
            )}
            getOptionKey={(option) => option.filter?.id}
            onChange={(_, selectedOption) => {
              onChange(
                selectedOption?.filter
                  ? ToUiItem(selectedOption.filter.value, option)
                  : ToUiItem(
                      {
                        type: "Empty",
                        fieldId: -1,
                      },
                      option,
                    ),
              );
            }}
            sx={{ flex: 1 }}
          />
        )}
      </Stack>
      {selectedDataField != undefined && selectedFilterOption != undefined && (
        <FilterOptionEditor
          filterOption={option}
          onChange={onChange}
        ></FilterOptionEditor>
      )}
    </Stack>
  );
}

export default memo(FilterOptionDisplay);
