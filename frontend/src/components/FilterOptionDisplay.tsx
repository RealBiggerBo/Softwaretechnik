import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { TextField } from "@mui/material";
import type { DataField, EnumField } from "../classes/DataField";
import { ToUiItem, type UiItem } from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionEditor from "./FilterOptionEditor";

interface Props {
  action: UiItem<FilterOption>;
  format: DataRecord;
  onChange: (action: UiItem<FilterOption>) => void;
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
            minValue: "0000-00-00",
            maxValue: "0000-00-00",
          }),
          ToUiItem({
            type: "DateValueFilter",
            fieldId: dataField.id,
            value: "0000-00-00",
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
            value: "",
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

function FilterOptionDisplay({ action, format, onChange }: Props) {
  const selectedDataField = format.dataFields.find(
    (f) => f.id === action.value.fieldId,
  );
  const filterOptions = GenerateAutoCompleteOptions(selectedDataField);
  const selectedFilterOption = GetSelectedFilterOption(action, filterOptions);
  const selectedFieldOption = GetSelectedFieldOption(action, format.dataFields);

  return (
    <>
      <Autocomplete
        options={format.dataFields}
        value={selectedFieldOption}
        getOptionLabel={(f) => f.name}
        onChange={(_, field) => {
          onChange(
            field
              ? ToUiItem({ type: "Empty", fieldId: field.id })
              : ToUiItem({ type: "Empty", fieldId: -1 }),
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Feld auswählen" />
        )}
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
              selectedOption?.filter ??
                ToUiItem({
                  type: "Empty",
                  fieldId: -1,
                }),
            );
          }}
        />
      )}
      {selectedDataField != undefined && selectedFilterOption != undefined && (
        <FilterOptionEditor
          filterOption={action}
          onChange={onChange}
        ></FilterOptionEditor>
      )}
    </>
  );
}

export default FilterOptionDisplay;
