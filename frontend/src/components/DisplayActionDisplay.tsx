import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { TextField } from "@mui/material";
import { type DisplayAction } from "../classes/DisplayAction";
import type { DataField } from "../classes/DataField";
import { ToUiItem, type UiItem } from "../classes/UiItems";
import { memo, useMemo } from "react";

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
          ToUiItem({ type: "Max", fieldId: dataField.id, title: "" }),
          ToUiItem({ type: "Min", fieldId: dataField.id, title: "" }),
          ToUiItem({ type: "Average", fieldId: dataField.id, title: "" }),
        ];
      case "enum":
      case "boolean":
      case "text":
        return [
          ToUiItem({
            type: "CountCategorized",
            fieldId: dataField.id,
            title: "",
          }),
        ];
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
    case "CountCategorized":
      return { label: "Kategorisierte Zählung", action: displayAction };
    default:
      return {
        label: "",
        action: ToUiItem({ type: "Empty", fieldId: -1, title: "" }),
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
  const selectedDataField = useMemo(
    () => format.dataFields.find((f) => f.id === action.value.fieldId),
    [format.dataFields, action.value.fieldId],
  );
  const actionOptions = useMemo(
    () => GenerateAutoCompleteOptions(selectedDataField),
    [selectedDataField],
  );
  const selectedActionOption = useMemo(
    () => GetSelectedActionOption(action, actionOptions),
    [action, actionOptions],
  );
  const selectedFieldOption = useMemo(
    () => GetSelectedFieldOption(action, format.dataFields),
    [action, format.dataFields],
  );

  return (
    <>
      <TextField
        label="Anzeige Options Titel"
        value={action.value.title}
        fullWidth
        onChange={(e) =>
          onChange({
            ...action,
            value: {
              ...action.value,
              title: e.target.value,
            },
          })
        }
      ></TextField>
      <Autocomplete
        options={format.dataFields}
        value={selectedFieldOption}
        getOptionLabel={(f) => f.name}
        onChange={(_, field) => {
          onChange(
            field
              ? ToUiItem(
                  {
                    type: "Empty",
                    fieldId: field.id,
                    title: action.value.title,
                  },
                  action,
                )
              : ToUiItem(
                  {
                    type: "Empty",
                    fieldId: -1,
                    title: action.value.title,
                  },
                  action,
                ),
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
              selectedOption && selectedOption.action
                ? {
                    ...action,
                    value: {
                      ...action.value,
                      type: selectedOption?.action.value.type,
                    },
                  }
                : ToUiItem(
                    {
                      type: "Empty",
                      fieldId: -1,
                      title: action.value.title,
                    },
                    action,
                  ),
            );
          }}
        />
      )}
    </>
  );
}

export default memo(DisplayActionDisplay);
