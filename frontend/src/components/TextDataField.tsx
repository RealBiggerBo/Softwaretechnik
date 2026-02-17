import { useState } from "react";
import { type TextField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  textField: TextField;
  isEditMode: boolean;
  onChange: (field: TextField) => void;
  onDelete: (id: number) => void;
}

function TextDataField({ textField, isEditMode, onChange, onDelete }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isError = touched && value.trim() === "" && textField.required;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{textField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({ ...textField, name: e.target.value });
          }}
          value={textField.name}
        ></Tf>
      )}

      {
        <Tf
          type="text"
          disabled={isEditMode}
          onChange={(e) => {
            onChange({ ...textField, text: e.target.value });
            setValue(e.target.value);
          }}
          placeholder={textField.name}
          value={textField.text}
          size="small"
          onBlur={() => setTouched(true)}
          error={isError}
          helperText={isError ? "Dieses Feld ist erforderlich" : ""}
          multiline
          maxRows={5}
          minRows={1}
          sx={{ width: 300 }}
        ></Tf>
      }
      {isEditMode && (
        <DeleteIcon color="error" onClick={() => onDelete(textField.id)} />
      )}
    </Stack>
  );
}

export default TextDataField;
