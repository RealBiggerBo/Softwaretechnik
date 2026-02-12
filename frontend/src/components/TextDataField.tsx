import { type TextField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";

interface Props {
  textField: TextField;
  isEditMode: boolean;
  onChange: (field: TextField) => void;
}

function TextDataField({ textField, isEditMode, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{textField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({ ...textField, name: e.target.value });
          }}
          defaultValue={textField.name}
        ></Tf>
      )}

      {
        <Tf
          type="text"
          disabled={isEditMode}
          onChange={(e) => {
            onChange({ ...textField, text: e.target.value });
          }}
          placeholder={textField.name}
          defaultValue={textField.text}
          size="small"
        ></Tf>
      }
    </Stack>
  );
}

export default TextDataField;
