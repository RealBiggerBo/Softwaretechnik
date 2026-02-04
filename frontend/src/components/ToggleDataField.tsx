import { ToggleField } from "../classes/DataField";
import { TextField as Tf, Checkbox, FormControlLabel, Stack} from "@mui/material";

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
            const updatedToggleField = new ToggleField(
              e.target.value,
              toggleField.id,
              toggleField.required,
              toggleField.isSelected
            );
            onChange(updatedToggleField);
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
                  const updatedToggleField = new ToggleField(
                    toggleField.name,
                    toggleField.id,
                    toggleField.required,
                    e.target.checked
                  );
                  onChange(updatedToggleField);
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