import { Autocomplete, TextField } from "@mui/material";
import type { DataField } from "../classes/DataField";
import {
  type AverageFilterAction,
  type EmptyFilterAction,
  type MaxFilterAction,
  type MinFilterAction,
  type DisplayAction,
} from "../classes/FilterOption";

interface Props {
  dataField?: DataField;
  onChange: (action: DisplayAction) => void;
}

function GetAvailableActions(dataField?: DataField): DisplayAction[] {
  if (dataField == undefined) return [];
  else {
    switch (dataField.type) {
      case "date":
      case "integer":
        return [
          { type: "Max", fieldId: dataField.id },
          { type: "Min", fieldId: dataField.id },
          { type: "Average", fieldId: dataField.id },
        ];
      case "enum":
      case "boolean":
      case "text":
      default:
        return [];
    }
  }
}

function GetOptionFromDisplayAction(
  displayAction: DisplayAction,
  index: number,
) {
  //only use primes as id. This ensures together with the id that each generated option has a unique id
  switch (displayAction.type) {
    case "Max":
      return { label: "Maximum", id: 3 * index, action: displayAction };
    case "Min":
      return { label: "Minimum", id: 5 * index, action: displayAction };
    case "Average":
      return { label: "Durchschnitt", id: 7 * index, action: displayAction };
    default:
      return { label: "", id: 2 * index, action: undefined };
  }
}

function GenerateAutoCompleteOptions(dataField?: DataField) {
  return GetAvailableActions(dataField).map((dataField, index) =>
    GetOptionFromDisplayAction(dataField, index),
  );
}

function DataRecordFilterActionDisplay({ dataField, onChange }: Props) {
  return (
    <>
      <Autocomplete
        options={GenerateAutoCompleteOptions(dataField)}
        renderInput={(params) => <TextField {...params} label="Select" />}
        getOptionKey={(option) => option.id}
        onChange={(_, selectedOption) => {
          onChange(
            selectedOption != null && selectedOption.action != undefined
              ? selectedOption.action
              : { type: "Empty", fieldId: -1 },
          );
        }}
      ></Autocomplete>
    </>
  );
}

export default DataRecordFilterActionDisplay;
