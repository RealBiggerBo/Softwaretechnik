import type { TextField } from "../classes/DataField";
import { TextField as Tf} from "@mui/material";

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
            textField.name = e.target.value;
            onChange(textField);
          }}
          defaultValue={textField.name}
        ></Tf>
      )}

      {
        <Tf
          type="text"
          disabled={isEditMode}
          onChange={(e) => {
            textField.text = e.target.value;
            onChange(textField);
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
