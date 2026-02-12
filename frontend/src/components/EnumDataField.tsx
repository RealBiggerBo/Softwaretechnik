import { type EnumField } from "../classes/DataField";
import { TextField as Tf, Autocomplete, Stack } from "@mui/material";

interface Props {
  enumField: EnumField;
  isEditMode: boolean;
  onChange: (field: EnumField) => void;
}

function EnumDataField({ enumField, isEditMode, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{enumField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            //TODO: extract in seperate method ||
            //(l. 39...)                       \/
            // const updatedEnumField = new EnumField(
            //   e.target.value,
            //   enumField.id,
            //   enumField.required,
            //   enumField.possibleValues,
            // );
            // updatedEnumField.possibleValues = enumField.possibleValues;
            // updatedEnumField.selectedValue = enumField.selectedValue;
            // onChange(updatedEnumField);
            onChange({ ...enumField, name: e.target.value });
          }}
          defaultValue={enumField.name}
        ></Tf>
      )}

      {
        <Autocomplete
          disablePortal
          options={enumField.possibleValues}
          disabled={isEditMode}
          onChange={(_, newValue) => {
            //TODO: extract in seperate method ||
            //(l. 20...)                       \/
            // const updatedEnumField = new EnumField(
            //   enumField.name,
            //   enumField.id,
            //   enumField.required,
            //   enumField.possibleValues,
            // );
            // updatedEnumField.possibleValues = enumField.possibleValues;
            // updatedEnumField.selectedValue = newValue || "";
            // onChange(updatedEnumField);
            onChange({ ...enumField, selectedValue: newValue || "" });
          }}
          defaultValue={enumField.selectedValue}
          renderInput={(params) => <Tf {...params} label={enumField.name} />}
          size="small"
          sx={{ width: 300 }}
        />
      }
    </Stack>
  );
}

export default EnumDataField;
