import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { TextField } from "@mui/material";
import { type DisplayAction } from "../classes/DisplayAction";
import type { DataField } from "../classes/DataField";
import { ToUiItem, type UiItem } from "../classes/UiItems";

interface Props {
  action: UiItem<DisplayAction>;
  format: DataRecord;
  onChange: (action: UiItem<DisplayAction>) => void;
}

function GetAvailableActions(dataField?: DataField): UiItem<DisplayAction>[] {
  if (dataField == undefined) return [];
  else {
    switch (dataField.type) {
      case "date":
      case "integer":
        return [
          ToUiItem({ type: "Max", fieldId: dataField.id }),
          ToUiItem({ type: "Min", fieldId: dataField.id }),
          ToUiItem({ type: "Average", fieldId: dataField.id }),
        ];
      case "enum":
      case "boolean":
      case "text":
      default:
        return [];
    }
  }
}

function GetOptionFromDisplayAction(displayAction: UiItem<DisplayAction>): {
  label: string;
  action: UiItem<DisplayAction>;
} {
  //only use primes as id. This ensures together with the id that each generated option has a unique id
  switch (displayAction.value.type) {
    case "Max":
      return { label: "Maximum", action: displayAction };
    case "Min":
      return { label: "Minimum", action: displayAction };
    case "Average":
      return { label: "Durchschnitt", action: displayAction };
    default:
      return {
        label: "",
        action: ToUiItem({ type: "Empty", fieldId: -1 }),
      };
  }
}

function GenerateAutoCompleteOptions(dataField?: DataField) {
  return GetAvailableActions(dataField).map((dataField) =>
    GetOptionFromDisplayAction(dataField),
  );
}

function GetSelectedFieldOption(
  action: UiItem<DisplayAction>,
  fields: DataField[],
) {
  return fields.find((f) => f.id === action.value.fieldId) ?? null;
}

function GetSelectedActionOption(
  action: UiItem<DisplayAction>,
  options: ReturnType<typeof GenerateAutoCompleteOptions>,
) {
  return (
    options.find((o) => o.action?.value.type === action.value.type) ?? null
  );
}

function DisplayActionDisplay({ action, format, onChange }: Props) {
  const selectedDataField = format.dataFields.find(
    (f) => f.id === action.value.fieldId,
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
          options={actionOptions}
          value={selectedActionOption}
          renderInput={(params) => (
            <TextField {...params} label="Operation auswählen" />
          )}
          getOptionKey={(option) => option.action?.id}
          onChange={(_, selectedOption) => {
            onChange(
              selectedOption?.action ??
                ToUiItem({
                  type: "Empty",
                  fieldId: -1,
                }),
            );
          }}
        />
      )}
    </>
  );
}

export default DisplayActionDisplay;
