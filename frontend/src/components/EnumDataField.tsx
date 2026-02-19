import { useState } from "react";
import { type EnumField } from "../classes/DataField";
import { TextField as Tf, Autocomplete, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { memo } from "react";

interface Props {
  enumField: EnumField;
  isEditMode: boolean;
  onChange: (field: EnumField) => void;
  onDelete: (id: number) => void;
}

function EnumDataField({ enumField, isEditMode, onChange, onDelete }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isError = touched && value.trim() === "" && enumField.required;

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
          value={enumField.name}
        ></Tf>
      )}

      {
        <>
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
              setValue(newValue || "");
            }}
            value={enumField.selectedValue}
            renderInput={(params) => (
              <Tf
                {...params}
                label={enumField.name}
                onBlur={() => setTouched(true)}
                error={isError}
                helperText={isError ? "Dieses Feld ist erforderlich" : ""}
              />
            )}
            size="small"
            sx={{ width: 300 }}
          />
          <br />
        </>
      }
      {isEditMode && (
        <DeleteIcon color="error" onClick={() => onDelete(enumField.id)} />
      )}
    </Stack>
  );
}

export default memo(EnumDataField);
