import { EnumField } from "../classes/DataField";
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
            const updatedEnumField = new EnumField(
              e.target.value,
              enumField.id,
              enumField.required,
              enumField.possibleValues
            );
            updatedEnumField.SetPossibleValues(enumField.GetPossibleValues());
            updatedEnumField.selectedValue = enumField.selectedValue;
            onChange(updatedEnumField);
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
                const updatedEnumField = new EnumField(
                  enumField.name,
                  enumField.id,
                  enumField.required,
                  enumField.possibleValues
                );
                updatedEnumField.SetPossibleValues(enumField.GetPossibleValues());
                updatedEnumField.selectedValue = newValue || "";
                onChange(updatedEnumField);
            }}
            defaultValue={enumField.selectedValue}
            renderInput={(params) => <Tf {...params} label={enumField.name} />}
        />
      }
    </>
  );
}

export default EnumDataField;