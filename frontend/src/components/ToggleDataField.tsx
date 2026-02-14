import { type ToggleField } from "../classes/DataField";
import {
  TextField as Tf,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  toggleField: ToggleField;
  isEditMode: boolean;
  onChange: (field: ToggleField) => void;
  onDelete: (id: number) => void;
}

function ToggleDataField({
  toggleField,
  isEditMode,
  onChange,
  onDelete,
}: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{toggleField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({ ...toggleField, name: e.target.value });
          }}
          value={toggleField.name}
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
      {isEditMode && (
        <DeleteIcon color="error" onClick={() => onDelete(toggleField.id)} />
      )}
    </Stack>
  );
}

export default ToggleDataField;
