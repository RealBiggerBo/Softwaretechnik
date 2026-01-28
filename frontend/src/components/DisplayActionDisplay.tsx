import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { Button, TextField } from "@mui/material";
import { type DisplayAction } from "../classes/FilterOption";
import type { DataField } from "../classes/DataField";

interface Props {
  action: DisplayAction;
  format: DataRecord;
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

function GetSelectedFieldOption(action: DisplayAction, fields: DataField[]) {
  return fields.find((f) => f.id === action.fieldId) ?? null;
}

function GetSelectedActionOption(
  action: DisplayAction,
  options: ReturnType<typeof GenerateAutoCompleteOptions>,
) {
  return options.find((o) => o.action?.type === action.type) ?? null;
}

function DisplayActionDisplay({ action, format, onChange }: Props) {
  const selectedDataField = format.dataFields.find(
    (f) => f.id === action.fieldId,
  );
  const actionOptions = GenerateAutoCompleteOptions(selectedDataField);
  const selectedActionOption = GetSelectedActionOption(action, actionOptions);
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
              ? { type: "Empty", fieldId: field.id }
              : { type: "Empty", fieldId: -1 },
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Feld auswählen" />
        )}
      />
      {selectedDataField != undefined && (
        <Autocomplete
          options={actionOptions}
          value={selectedActionOption}
          renderInput={(params) => (
            <TextField {...params} label="Operation auswählen" />
          )}
          getOptionKey={(option) => option.id}
          onChange={(_, selectedOption) => {
            onChange(selectedOption?.action ?? { type: "Empty", fieldId: -1 });
          }}
        />
      )}
    </>
  );
}

export default DisplayActionDisplay;
