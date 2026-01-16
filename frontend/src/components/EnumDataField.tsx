import type { EnumField } from "../classes/DataField";
import { TextField as Tf, Autocomplete} from "@mui/material";

interface Props {
  enumField: EnumField;
  isEditMode: boolean;
  onChange: (field: EnumField) => void;
}

function EnumDataField({ enumField, isEditMode, onChange }: Props) {
  return (
    <>
      {!isEditMode && <label>{enumField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            enumField.name = e.target.value;
            onChange(enumField);
          }}
          defaultValue={enumField.name}
        ></Tf>
      )}

      {
        <Autocomplete
            disablePortal
            options={enumField.GetPossibleValues()}
            disabled={isEditMode}
            onChange={(_, newValue) => {
                enumField.selectedValue = newValue || "";
                onChange(enumField);
            }}
            defaultValue={enumField.selectedValue}
            renderInput={(params) => <Tf {...params} label={enumField.name} />}
        />
      }
    </>
  );
}

export default EnumDataField;