import { TextField } from "../classes/DataField";
import { TextField as Tf } from "@mui/material";

interface Props {
  textField: TextField;
  isEditMode: boolean;
  onChange: (field: TextField) => void;
}

function TextDataField({ textField, isEditMode, onChange }: Props) {
  return (
    <>
      {!isEditMode && <label>{textField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            const updatedField = new TextField(
              e.target.value,
              textField.id,
              textField.required,
              textField.text,
              textField.maxLength
            )
            onChange(updatedField);
          }}
          defaultValue={textField.name}
        ></Tf>
      )}

      {
        <Tf
          type="text"
          disabled={isEditMode}
          onChange={(e) => {
            const updatedField = new TextField(
              textField.name,
              textField.id,
              textField.required,
              e.target.value,
              textField.maxLength
            )
            onChange(updatedField);
          }}
          placeholder={textField.name}
          defaultValue={textField.text}
          size="small"
        ></Tf>
      }
    </>
  );
}

export default TextDataField;
