import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import { TextField } from "@mui/material";
import {
  AverageFilterAction,
  DisplayAction,
  MinFilterAction,
} from "../classes/FilterOption";

interface Props {
  action: { id: Number; action: DisplayAction };
  format: DataRecord;
  onChange: (action: { id: Number; action: DisplayAction }) => void;
}

function DisplayActionDisplay({ action, format, onChange }: Props) {
  return (
    <>
      <Autocomplete
        options={format.dataFields.map((field) => {
          return { label: field.name, field: field };
        })}
        renderInput={(params) => <TextField {...params} label="Select" />}
        getOptionKey={(options) => options.field.id}
        onChange={(_, newValue) => {
          onChange(
            newValue == null
              ? { id: -1, action: AverageFilterAction }
              : { id: newValue.field.id, action: action.action },
          );
        }}
      ></Autocomplete>
    </>
  );
}

export default DisplayActionDisplay;
