import { type ToggleField } from "../classes/DataField";
import {
  TextField as Tf,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";

interface Props {
  toggleField: ToggleField;
  isEditMode: boolean;
  onChange: (field: ToggleField) => void;
}

function ToggleDataField({ toggleField, isEditMode, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{toggleField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({ ...toggleField, name: e.target.value });
          }}
          defaultValue={toggleField.name}
        ></Tf>
      )}

      {
        <FormControlLabel
          control={
            <Checkbox
              checked={toggleField.isSelected}
              disabled={isEditMode}
              onChange={(e) => {
                onChange({ ...toggleField, isSelected: e.target.checked });
              }}
            />
          }
          label=""
        />
      }
    </Stack>
  );
}

export default ToggleDataField;
