import Autocomplete from "@mui/material/Autocomplete";
import type { DataRecord } from "../classes/DataRecord";
import type { Query } from "../classes/Query";
import { TextField } from "@mui/material";
import type { DisplayAction } from "../classes/FilterOption";

interface Props {
  action: DisplayAction;
  format: DataRecord;
}

function DisplayActionDisplay({ action, format }: Props) {
  return (
    <>
      <Autocomplete
        options={format.dataFields.map((field, i) => field.name)}
        renderInput={(params) => <TextField {...params} label="Select" />}
      ></Autocomplete>{" "}
      {format.DisplayDataRecord(true)}
    </>
  );
}

export default DisplayActionDisplay;
