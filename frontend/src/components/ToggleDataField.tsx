import type { ToggleField } from "../classes/DataField";
import { TextField as Tf, Checkbox, FormControlLabel} from "@mui/material";

interface Props {
  toggleField: ToggleField;
  isEditMode: boolean;
  onChange: (field: ToggleField) => void;
}

function ToggleDataField({ toggleField, isEditMode, onChange }: Props) {
  return (
    <>
      {!isEditMode && <label>{toggleField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            toggleField.name = e.target.value;
            onChange(toggleField);
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
                onChange={(e) => { toggleField.isSelected = e.target.checked; 
                    onChange(toggleField);}}
            />
        }
        label={toggleField.name}
        />
      }
    </>
  );
}

export default ToggleDataField;